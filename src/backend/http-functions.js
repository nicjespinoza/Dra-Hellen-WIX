import wixData from 'wix-data';
import { ok, badRequest, serverError, response } from 'wix-http-functions';
// CAMBIO: Solo importamos desde el archivo unificado 'powertranz.web.js'
import { completePayment } from 'backend/powertranz3.web.js';

// Tu función de log se mantiene igual
async function logEvent(level, message, context = {}) {
    try {
        await wixData.insert('logs', {
            timestamp: new Date(),
            level,
            message,
            context: JSON.stringify(context, null, 2)
        });
    } catch (error) {
        console.error('Error al registrar log:', error);
    }
}

// LÓGICA UNIFICADA: Esta única función ahora maneja tanto pruebas como producción
export async function post_payment(request) {
    let requestBody = null;
    let powertranzResponse = null;
    let text = null;

    try {
        text = await request.body.text();
        requestBody = Object.fromEntries(new URLSearchParams(text));

        const headers = {};
        for (const key in request.headers) {
            headers[key] = request.headers[key];
        }

        await logEvent('DEBUG', 'Solicitud recibida en post_payment', {
            method: request.method,
            headers,
            bodyParams: Object.keys(requestBody),
            rawBody: text.substring(0, 500)
        });

        if (requestBody.Response) {
            try {
                powertranzResponse = JSON.parse(decodeURIComponent(requestBody.Response));
                await logEvent('DEBUG', 'Respuesta de PowerTranz parseada', {
                    transactionId: powertranzResponse.TransactionIdentifier,
                    status: powertranzResponse.Approved ? 'Approved' : 'Not Approved',
                    responseCode: powertranzResponse.IsoResponseCode,
                    authenticationStatus: powertranzResponse.ThreeDSecure?.AuthenticationStatus || 'N/A',
                    fullResponse: JSON.stringify(powertranzResponse, null, 2)
                });

                if (powertranzResponse.ThreeDSecure?.AuthenticationStatus === 'N') {
                    await logEvent('ERROR', 'Autenticación 3DS fallida', {
                        transactionId: powertranzResponse.TransactionIdentifier,
                        authenticationStatus: 'N'
                    });
                    return response({
                        status: 302,
                        headers: {
                            'Location': 'https://www.hellenaraya.com/pago-fallido',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: {}
                    });
                }
            } catch (e) {
                await logEvent('WARN', 'Error al parsear Response', {
                    response: requestBody.Response,
                    rawResponse: decodeURIComponent(requestBody.Response).substring(0, 500),
                    error: e.message
                });
            }
        }

        const spiToken = requestBody.SpiToken || requestBody.SPITOKEN || requestBody.spi_token;
        const transactionId = requestBody.TransactionIdentifier || requestBody.TRANSACTIONID || requestBody.transaction_id;

        if (!spiToken || !transactionId) {
            await logEvent('ERROR', 'Parámetros faltantes para completePayment', {
                receivedParams: Object.keys(requestBody),
                spiTokenPresent: !!spiToken,
                transactionIdPresent: !!transactionId
            });
            return response({
                status: 302,
                headers: {
                    'Location': 'https://www.hellenaraya.com/pago-fallido',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {}
            });
        }

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transactionId)) {
            await logEvent('ERROR', 'TransactionId con formato inválido', { transactionId });
            return response({
                status: 302,
                headers: {
                    'Location': 'https://www.hellenaraya.com/pago-fallido',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {}
            });
        }

        // ================== LÓGICA CENTRAL UNIFICADA ==================
        const tokenQuery = await wixData.query('CsrfTokens')
            .eq('transactionId', transactionId)
            .find();

        const tokenRecord = tokenQuery.items[0];

        if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
            await logEvent('ERROR', 'Token CSRF no encontrado o expirado', {
                transactionId,
                exists: !!tokenRecord,
                expired: tokenRecord ? new Date(tokenRecord.expiresAt) < new Date() : 'N/A'
            });
            return response({
                status: 302,
                headers: {
                    'Location': 'https://www.hellenaraya.com/pago-fallido',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {}
            });
        }
        
        // Obtenemos el ambiente ('staging' o 'production') que guardamos al iniciar la transacción
        const environment = tokenRecord.environment || 'production'; 
        await logEvent('DEBUG', 'Verificando ambiente ANTES de llamar a completePayment', {
             ambienteLeido: environment,
             transactionId: transactionId
        });

        let transaction = await wixData.query('Transactions')
            .eq('powertranzTransactionId', transactionId)
            .find()
            .then(results => results.items[0]);

        if (!transaction) {
            transaction = await wixData.insert('Transactions', {
                userId: tokenRecord.userId,
                powertranzTransactionId: transactionId,
                orderId: tokenRecord.orderId,
                amount: Number(tokenRecord.amount),
                status: 'Pending',
                spiToken: spiToken,
                threeDsStatus: powertranzResponse?.ThreeDSecure?.AuthenticationStatus || 'N/A',
                conceptopago: tokenRecord.concept,
                environment: environment, // Guardamos el ambiente para futuras referencias
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        const paymentResult = await completePayment(
            spiToken,
            transactionId,
            tokenRecord.userId,
            tokenRecord.csrfToken,
            tokenRecord.sessionId,
            //environment, // Pasamos el ambiente a la función de backend
            powertranzResponse 
        );
        
        const finalTransactionData = {
            ...transaction,
            status: paymentResult.success ? 'Completed' : 'Failed',
            responseData: JSON.stringify(paymentResult),
            updatedAt: new Date()
        };
        
        await wixData.update('Transactions', finalTransactionData);

        if (paymentResult.success) {
            await logEvent('INFO', 'Pago completado exitosamente', {
                transactionId,
                amount: tokenRecord.amount,
                userId: tokenRecord.userId
            });
            
            const redirectUrl = `https://www.hellenaraya.com/payment-success?orderId=${tokenRecord.orderId}`;
            
            try {
                const options = { "suppressAuth": true };
                const userProfile = await wixData.get("User", tokenRecord.userId, options);
                if (!userProfile) {
                    throw new Error(`No se encontró el perfil del usuario con ID: ${tokenRecord.userId}`);
                }
                userProfile.status = "Activo";
                await wixData.update("User", userProfile, options);
                await logEvent('INFO', 'Estado del usuario actualizado a "Activo" (Método Seguro)', { 
                    userId: tokenRecord.userId 
                });
            } catch (err) {
                await logEvent('ERROR', 'Fallo al actualizar el estado del usuario a "Activo"', {
                    userId: tokenRecord.userId,
                    error: err.message
                });
            }
            
            return response({
                status: 302,
                headers: {
                    'Location': redirectUrl,
                    'Access-Control-Allow-Origin': '*'
                },
                body: {}
            });
        } else {
            await logEvent('ERROR', 'Pago no aprobado por PowerTranz', {
                transactionId,
                error: paymentResult.message,
                details: JSON.stringify(paymentResult.details, null, 2)
            });

            // ================== INICIO DEL CAMBIO ==================
            // 1. Preparamos el mensaje de error para que viaje seguro en la URL
            const errorMessage = encodeURIComponent(paymentResult.message);
            
            // 2. Construimos la nueva URL de redirección con el error como parámetro
            const redirectUrl = `https://www.hellenaraya.com/pago-fallido?reason=${errorMessage}`;

            // 3. Usamos la nueva URL en la respuesta

            return response({
                status: 302,
                headers: {
                    'Location': redirectUrl,
                    'Access-Control-Allow-Origin': '*'
                },
                body: {}
            });
        }
    } catch (error) {
        await logEvent('ERROR', 'Error crítico en post_payment', {
            error: error.message,
            stack: error.stack,
            requestBody: requestBody ? Object.keys(requestBody) : 'N/A',
            rawBody: text ? text.substring(0, 500) : 'N/A'
        });

        return response({
            status: 302,
            headers: {
                'Location': 'https://www.hellenaraya.com/pago-fallido',
                'Access-Control-Allow-Origin': '*'
            },
            body: {}
        });
    }
}

// Las siguientes funciones se mantienen intactas
export async function get_payment_status(request) {
    try {
        const { transactionId } = request.query;
        const transaction = await wixData.query('CsrfTokens')
            .eq('transactionId', transactionId)
            .find();

        return ok({
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: transaction.items[0] || { error: 'No encontrado' }
        });
    } catch (error) {
        await logEvent('ERROR', 'Error en get_payment_status', { error: error.message });
        return serverError({
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { error: 'Error interno' }
        });
    }
}

export async function get_payment(request) {
    try {
        const query = request.query || {};
        await logEvent('DEBUG', 'Solicitud GET recibida', { query });

        return ok({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: true,
                message: 'Endpoint de pago activo',
                method: 'GET',
                query
            }
        });
    } catch (error) {
        await logEvent('ERROR', 'Error en get_payment', { error: error.message });
        return serverError({
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { error: 'Error interno' }
        });
    }
}

export async function post_test_process_payment(request) {
    try {
        console.log('DEBUG: post_test_process_payment ejecutada', JSON.stringify(request, null, 2));
        return ok({
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { success: true, message: 'Endpoint de prueba alcanzado' }
        });
    } catch (error) {
        await logEvent('ERROR', 'Error en post_test_process_payment', { error: error.message });
        return serverError({
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { success: false, message: 'Error en el endpoint' }
        });
    }
}
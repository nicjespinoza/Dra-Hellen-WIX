 
import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import wixSecretsBackend from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';
import { v4 as uuidv4 } from 'uuid';
import { currentMember } from 'wix-members-backend';


// 2. FUNCIONES INTERNAS
 

async function getCredentials() {
    const secretName = 'powertranzCredentials';
    try {
        const secrets = await wixSecretsBackend.getSecret(secretName);
        const { powertranzId, powertranzPassword, PowertranzPageSet, PowertranzPageName, powertranzSecret } = JSON.parse(secrets);
        
        if (!powertranzId || !powertranzPassword) {
            throw new Error('Credenciales incompletas');
        }
        
        return {
            powertranzId,
            powertranzPassword,
            PowertranzPageSet: PowertranzPageSet || 'PTZ/HellenAraya',
            PowertranzPageName: PowertranzPageName || 'PaginaPago',
            powertranzSecret
        };
    } catch (error) {
        await logEvent('ERROR', 'Error al obtener credenciales', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

async function retryFetch(url, options, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            const responseText = await response.text();
            if (!responseText.trim()) {
                throw new Error(`Respuesta vacía recibida (HTTP ${response.status})`);
            }
            
            try {
                JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Respuesta no es JSON válido: ${responseText.substring(0, 100)}`);
            }
            
            return {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                text: () => Promise.resolve(responseText),
                json: () => Promise.resolve(JSON.parse(responseText))
            };
            
        } catch (error) {
            if (attempt === retries) {
                await logEvent('ERROR', `Intento ${attempt} fallido para ${url}`, {
                    error: error.message,
                    stack: error.stack,
                    responseText: error.message.includes('Respuesta vacía') ? '' : undefined
                });
                throw error;
            }
            
            await logEvent('WARN', `Reintentando solicitud (${attempt}/${retries})`, {
                url,
                error: error.message,
                nextAttemptIn: `${delay * attempt}ms`
            });
            
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}

async function logEvent(level, message, context = {}) {
    try {
        const logEntry = {
            timestamp: new Date(),
            level,
            message,
            context: JSON.stringify(context, null, 2)
        };
        await wixData.insert('logs', logEntry);
    } catch (error) {
        console.error('Error al registrar log:', error);
    }
}

function cleanString(str) {
    return str ? str.replace(/[^a-zA-Z0-9\s-_]/g, '') : '';
}


// 3. MÉTODOS WEB (FUNCIONES LLAMADAS DESDE EL FRONTEND)
// Se usa 'webMethod' para exponer estas funciones de forma segura al frontend.
// Permissions.SiteMember asegura que solo usuarios logueados pueden llamarlas.

export const initTransaction = webMethod(Permissions.SiteMember, async (userId, orderId, amount, billingAddress, sessionId, bypass3DS = false, concept) => {
    try {
        await logEvent('DEBUG', 'Iniciando transacción', {
            userId,
            orderId,
            amount,
            sessionId: sessionId || 'N/A'
        });

        if (!userId || !orderId || isNaN(amount) || !billingAddress) {
            throw new Error('Parámetros requeridos faltantes o inválidos');
        }

        const transactionId = uuidv4();
        const csrfToken = uuidv4();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await wixData.insert('CsrfTokens', {
            userId,
            csrfToken,
            transactionId,
            sessionId,
            amount,
            orderId,
            expiresAt,
            concept
        });

        const { powertranzId, powertranzPassword, PowertranzPageSet, PowertranzPageName } = await getCredentials();

        const payload = {
            TransactionIdentifier: transactionId,
            TotalAmount: Number(amount).toFixed(2),
            CurrencyCode: '558',
            ThreeDSecure: !bypass3DS,
            Tokenize: true,
            FraudCheck: false,
            OrderIdentifier: orderId,
            BillingAddress: {
                FirstName: cleanString(billingAddress.FirstName) || 'Cliente',
                LastName: cleanString(billingAddress.LastName) || 'Desconocido',
                Line1: cleanString(billingAddress.Line1) || 'Sin direccion',
                City: cleanString(billingAddress.City) || 'Desconocido',
                CountryCode: '558',
                EmailAddress: billingAddress.EmailAddress || 'noemail@example.com',
                PhoneNumber: cleanString(billingAddress.PhoneNumber) || '89776879'
            },
            AddressMatch: false,
            ExtendedData: {
                ThreeDSecure: bypass3DS ? {} : {
                    ChallengeWindowSize: '05',
                    ChallengeIndicator: bypass3DS ? '04' : '01',
                    AuthenticationIndicator: '01',
                    MessageCategory: '01'
                },
                MerchantResponseUrl: 'https://www.hellenaraya.com/_functions/payment',
                HostedPage: {
                    PageSet: PowertranzPageSet,
                    PageName: PowertranzPageName
                }
            }
        };

        const response = await retryFetch('https://staging.ptranz.com/api/spi/sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Powertranz-PowertranzId': powertranzId,
                'Powertranz-PowertranzPassword': powertranzPassword,
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            const errorDetails = result?.Errors || [{
                Code: 'HTTP_' + response.status,
                Message: result.ResponseMessage || `Error ${response.status}: ${response.statusText}`
            }];
            throw new Error(errorDetails[0].Message);
        }

        if (result.IsoResponseCode === 'SP4' && result.RedirectData && result.SpiToken) {
            return {
                success: true,
                redirectData: result.RedirectData,
                transactionId: result.TransactionIdentifier,
                spiToken: result.SpiToken,
                orderId,
                csrfToken,
                sessionId,
                amount
            };
        } else {
            throw new Error(result.ResponseMessage || 'Respuesta inválida de PowerTranz');
        }
    } catch (error) {
        await logEvent('ERROR', 'Error en initTransaction', {
            error: error.message,
            stack: error.stack,
            userId,
            orderId
        });
        throw error;
    }
});
// ... (código anterior)

export const reverseTransaction = webMethod(Permissions.SiteMember, async (powertranzTransactionId) => {
    if (!powertranzTransactionId) {
        throw new Error('El ID de la transacción es requerido.');
    }

    try {
        const { powertranzId, powertranzPassword } = await getCredentials();
        
     // ================== INICIO DEL CAMBIO ==================

        // 1. Buscamos la transacción original para obtener el monto.
        const transactionQuery = await wixData.query("Transactions")
            .eq("powertranzTransactionId", powertranzTransactionId)
            .find();

        if (transactionQuery.items.length === 0) {
            throw new Error("No se encontró la transacción original para revertir.");
        }
        const originalTransaction = transactionQuery.items[0];
        const amountToReverse = originalTransaction.amount;

        // 2. Apuntamos a la URL correcta: 'refund' en lugar de 'void'.
        const response = await retryFetch('https://staging.ptranz.com/api/spi/refund', { // <-- CAMBIO DE URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Powertranz-PowertranzId': powertranzId,
                'Powertranz-PowertranzPassword': powertranzPassword
            },
            // 3. Enviamos el cuerpo requerido para un reembolso.
            body: JSON.stringify({
                TransactionIdentifier: powertranzTransactionId,
                TotalAmount: amountToReverse // La API de refund requiere el monto.
            })
        });

        // =================== FIN DEL CAMBIO ====================

        const result = await response.json();
        
        // 2. Si la anulación es exitosa, actualizamos nuestra base de datos
        if (result.IsoResponseCode === '00') {
            // Buscamos la transacción en nuestra colección
            const transactionQuery = await wixData.query("Transactions")
                .eq("powertranzTransactionId", powertranzTransactionId)
                .find();

            if (transactionQuery.items.length > 0) {
                const transactionToUpdate = transactionQuery.items[0];
                transactionToUpdate.status = "Revertido"; // Cambiamos el estado

                // Guardamos el registro actualizado
                await wixData.update("Transactions", transactionToUpdate);
                await logEvent('INFO', 'Transacción revertida y actualizada en BD', { powertranzTransactionId });
            }
            
            return { success: true, message: 'Reversión procesada con éxito' };
        } else {
            // Si PowerTrans devuelve un error, lo lanzamos
            throw new Error(result.ResponseMessage || 'No se pudo reversar la transacción');
        }

    } catch (error) {
        await logEvent('ERROR', 'Error en reverseTransaction', {
            error: error.message,
            transactionId: powertranzTransactionId
        });
        throw error; // Re-lanzamos el error para que el frontend lo capture
    }
});

 


// 4. FUNCIONES EXPORTADAS PARA USO INTERNO DEL BACKEND
// Esta función es llamada por 'http-functions.js', por lo tanto, no es un 'webMethod'.
// Se exporta de manera normal para que otros archivos del backend puedan importarla.

export async function completePayment(spiToken, transactionId, userId, csrfToken, sessionId, powertranzResponse = {}) {
    try {
        if (!spiToken || spiToken.length < 20) {
            throw new Error('SpiToken inválido');
        }

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transactionId)) {
            throw new Error('TransactionIdentifier inválido');
        }

        const tokenRecord = await wixData.query('CsrfTokens')
            .eq('userId', userId)
            .eq('csrfToken', csrfToken)
            .eq('transactionId', transactionId)
            .eq('sessionId', sessionId)
            .ge('expiresAt', new Date())
            .find()
            .then(results => results.items[0]);

        if (!tokenRecord) {
            throw new Error('Token CSRF inválido o expirado');
        }

        const { powertranzId, powertranzPassword } = await getCredentials();

        await logEvent('DEBUG', 'Enviando solicitud a /api/spi/payment', {
            transactionId,
            spiToken: spiToken.substring(0, 5) + '...',
        });

        const response = await retryFetch('https://staging.ptranz.com/api/spi/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Powertranz-PowertranzId': powertranzId,
                'Powertranz-PowertranzPassword': powertranzPassword,
                'Accept': 'application/json',
                'User-Agent': 'Wix-Velo/1.0'
            },
            body: JSON.stringify(spiToken) 
        });

        const result = await response.json();

        await logEvent('INFO', 'Respuesta recibida de /api/spi/payment', {
            transactionId,
            status: response.status,
            response: JSON.stringify(result, null, 2)
        });

        if (!response.ok) {
            const errorDetails = result?.Errors || [{
                Code: 'HTTP_' + response.status,
                Message: result?.ResponseMessage || `Error ${response.status}: ${response.statusText}`
            }];
            throw new Error(errorDetails[0].Message);
        }

        if (result.IsoResponseCode === '00' && result.Approved === true) {
            await logEvent('INFO', 'Pago aprobado por PowerTranz', {
                transactionId,
                responseCode: result.IsoResponseCode,
                result: JSON.stringify(result, null, 2)
            });
            return { success: true, result };
        } else {
            throw new Error(result.ResponseMessage || `Pago no aprobado (Código: ${result.IsoResponseCode})`);
        }
    } catch (error) {
        await logEvent('ERROR', 'Error en completePayment', {
            error: error.message,
            stack: error.stack,
            spiToken: spiToken ? spiToken.substring(0, 5) + '...' : 'N/A',
            transactionId
        });
        
        return {
            success: false,
            message: error.message,
            details: [{
                Code: error.code || 'UNKNOWN',
                Message: error.message || 'Error desconocido'
            }]
        };
    }
}

 

export const getMyTransactions = webMethod(Permissions.SiteMember, async () => {
    try {
        const member = await currentMember.getMember();
        if (!member) {
            return [];
        }
        const memberId = member._id;

        // 1. AÑADIMOS EL FILTRO PARA 'status'.
        // Ahora solo buscará transacciones exitosas.
          const results = await wixData.query("Transactions")
            .eq("userId", memberId)
            .hasSome("status", ["Completed", "Revertido"]) // <-- CAMBIO CLAVE AQUÍ
            .descending("_createdDate")
            .find();

        if (results.items.length === 0) {
            return []; // No hay transacciones completadas para mostrar.
        }
        
        // 2. AÑADIMOS LA LÓGICA DE LOS 3 DÍAS.
        const threeDaysInMillis = 5 * 24 * 60 * 60 * 1000;
        const now = new Date();
        
        const processedTransactions = results.items.map(transaction => {
            const timeDifference = now.getTime() - transaction._createdDate.getTime();
            
            // Creamos la propiedad 'isReversible' que el frontend leerá.
        transaction.isReversible = transaction.status === "Completed" && timeDifference < threeDaysInMillis;

            return transaction;
        });

        return processedTransactions;

    } catch (error) {
        console.error("Error al buscar transacciones:", error);
        return [];
    }
});
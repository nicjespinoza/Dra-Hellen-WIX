import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import wixSecretsBackend from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';
import { v4 as uuidv4 } from 'uuid';
import { currentMember } from 'wix-members-backend';

// ===============================================================
// FUNCIONES INTERNAS
// ===============================================================

async function getCredentials(environment = 'staging') {
    const secretName = 'powertranzCredentials2';
    try {
        const secretsText = await wixSecretsBackend.getSecret(secretName);
        const config = JSON.parse(secretsText);
        const envConfig = config[environment];

        if (!envConfig || !envConfig.id || !envConfig.password) {
            throw new Error(`Credenciales incompletas para el ambiente: ${environment}`);
        }

        return {
            powertranzId: envConfig.id,
            powertranzPassword: envConfig.password,
            apiUrl: envConfig.apiUrl,
            PowertranzPageSet: config.pageSet || 'PTZ/HellenAraya',
            PowertranzPageName: config.pageName || 'PaginaPago',
        };
    } catch (error) {
        await logEvent('ERROR', 'Error al obtener credenciales', { error: error.message, stack: error.stack });
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


// ===============================================================
// MÉTODOS WEB (FUNCIONES LLAMADAS DESDE EL FRONTEND)
// ===============================================================

export const initTransaction = webMethod(Permissions.SiteMember, async (userId, orderId, amount, billingAddress, sessionId, environment = 'staging', concept) => {
    try {
        await logEvent('DEBUG', 'Iniciando transacción', { userId, orderId, amount, sessionId: sessionId || 'N/A', environment });

        if (!userId || !orderId || isNaN(amount) || !billingAddress) {
            throw new Error('Parámetros requeridos faltantes o inválidos');
        }

        const { powertranzId, powertranzPassword, PowertranzPageSet, PowertranzPageName, apiUrl } = await getCredentials(environment);

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
            concept,
            environment: environment
        });

        const payload = {
            TransactionIdentifier: transactionId,
            TotalAmount: Number(amount).toFixed(2),
            CurrencyCode: '558',
            ThreeDSecure: true,
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
                ThreeDSecure: {
                    ChallengeWindowSize: '05',
                    ChallengeIndicator: '01',
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

        const response = await retryFetch(`${apiUrl}/sale`, {
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
            const errorDetails = result?.Errors || [{ Code: 'HTTP_' + response.status, Message: result.ResponseMessage || `Error ${response.status}: ${response.statusText}` }];
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
                amount,
                apiUrl: apiUrl,
                concept: concept 
            };
        } else {
            throw new Error(result.ResponseMessage || 'Respuesta inválida de PowerTranz');
        }
    } catch (error) {
        await logEvent('ERROR', 'Error en initTransaction', { error: error.message, stack: error.stack, userId, orderId });
        throw error;
    }
});


export const reverseTransaction = webMethod(Permissions.SiteMember, async (powertranzTransactionId) => {
    if (!powertranzTransactionId) {
        throw new Error('El ID de la transacción es requerido.');
    }

    try {
        const transactionQuery = await wixData.query("Transactions").eq("powertranzTransactionId", powertranzTransactionId).find();

        if (transactionQuery.items.length === 0) {
            throw new Error("No se encontró la transacción original para revertir.");
        }
        const originalTransaction = transactionQuery.items[0];
        const amountToReverse = originalTransaction.amount;
        const environment = originalTransaction.environment || 'production';

        const { powertranzId, powertranzPassword, apiUrl } = await getCredentials(environment);

        const response = await retryFetch(`${apiUrl}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Powertranz-PowertranzId': powertranzId,
                'Powertranz-PowertranzPassword': powertranzPassword
            },
            body: JSON.stringify({
                TransactionIdentifier: powertranzTransactionId,
                TotalAmount: amountToReverse
            })
        });

        const result = await response.json();
        
        if (result.IsoResponseCode === '00') {
            originalTransaction.status = "Revertido";
            await wixData.update("Transactions", originalTransaction);
            await logEvent('INFO', 'Transacción revertida y actualizada en BD', { powertranzTransactionId });
            return { success: true, message: 'Reversión procesada con éxito' };
        } else {
            throw new Error(result.ResponseMessage || 'No se pudo reversar la transacción');
        }
    } catch (error) {
        await logEvent('ERROR', 'Error en reverseTransaction', { error: error.message, transactionId: powertranzTransactionId });
        throw error;
    }
});

export async function completePayment(spiToken, transactionId, userId, csrfToken, sessionId, powertranzResponse = {}) {
    try {
        // ================== INICIO DEL CAMBIO ==================
        // La función ahora busca su propio 'environment' para ser más robusta.
        const tokenRecord = await wixData.query('CsrfTokens')
            .eq('transactionId', transactionId)
            .find()
            .then(results => results.items[0]);

        if (!tokenRecord) {
            throw new Error(`No se encontró el registro CsrfToken para la transacción: ${transactionId}`);
        }
        
        const environment = tokenRecord.environment || 'production';
        // =================== FIN DEL CAMBIO ====================

        // Ahora el resto de la función usa el 'environment' que encontró
        const { powertranzId, powertranzPassword, apiUrl } = await getCredentials(environment);

        await logEvent('DEBUG', `Enviando solicitud a ${apiUrl}/payment`, { transactionId, spiToken: spiToken.substring(0, 5) + '...', ambiente: environment });

        const response = await retryFetch(`${apiUrl}/payment`, {
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

        await logEvent('INFO', 'Respuesta recibida de /api/spi/payment', { transactionId, status: response.status, response: JSON.stringify(result, null, 2) });

        if (!response.ok) {
            const errorDetails = result?.Errors || [{ Code: 'HTTP_' + response.status, Message: result?.ResponseMessage || `Error ${response.status}: ${response.statusText}` }];
            throw new Error(errorDetails[0].Message);
        }

        if (result.IsoResponseCode === '00' && result.Approved === true) {
            await logEvent('INFO', 'Pago aprobado por PowerTranz', { transactionId, responseCode: result.IsoResponseCode, result: JSON.stringify(result, null, 2) });
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
            details: [{ Code: error.code || 'UNKNOWN', Message: error.message || 'Error desconocido' }]
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

        const results = await wixData.query("Transactions")
            .eq("userId", memberId)
            .hasSome("status", ["Completed", "Revertido"])
            .descending("_createdDate")
            .find();

        if (results.items.length === 0) {
            return [];
        }

        const threeDaysInMillis = 5 * 24 * 60 * 60 * 1000;
        const now = new Date();

        const processedTransactions = results.items.map(transaction => {
            const timeDifference = now.getTime() - new Date(transaction._createdDate).getTime();
            transaction.isReversible = transaction.status === "Completed" && timeDifference < threeDaysInMillis;
            return transaction;
        });

        return processedTransactions;

    } catch (error) {
        console.error("Error al buscar transacciones:", error);
        return [];
    }
});


export const getAllTransactions = webMethod(Permissions.SiteMember, async () => {
    try {
        // 1. Obtener todas las transacciones
        const transactionsResult = await wixData.query("Transactions")
            .descending("_createdDate")
            .find();
        
        const transactions = transactionsResult.items;

        if (transactions.length === 0) {
            return [];
        }

        // 2. Extraer todos los userId únicos de las transacciones encontradas
        // Filtramos para que no haya nulos y usamos Set para eliminar duplicados
        const userIds = [...new Set(transactions.map(t => t.userId).filter(id => id))];

        // 3. Buscar la información de estos usuarios en la base de datos "User"
        // NOTA: Si usas la base de datos de Miembros de Wix, cambia "User" por "Members/PrivateMembersData"
        // y asegúrate de usar los campos correctos (ej. 'firstName' y 'lastName').
        const usersResult = await wixData.query("User") 
            .hasSome("_id", userIds)
            .find();
        
        const users = usersResult.items;

        // 4. Crear un "mapa" para encontrar usuarios rápidamente por su ID
        const userMap = {};
        users.forEach(user => {
            // Asumiendo que tu colección User tiene campos 'nombre' y 'apellido' o similar.
            // Ajusta 'nombre' y 'apellido' a como se llamen realmente tus columnas en "User".
            const nombreCompleto = `${user.firstName || ''} ${user.lastName || ''}`.trim(); 
            userMap[user._id] = nombreCompleto || "Usuario sin nombre";
        });

        // 5. Combinar la transacción con el nombre del usuario
        const mergedTransactions = transactions.map(transaction => {
            return {
                ...transaction, // Mantiene todos los datos originales de la transacción
                nombreUsuario: userMap[transaction.userId] || "Usuario no encontrado" // Agrega el nombre
            };
        });

        return mergedTransactions;

    } catch (error) {
        console.error("Error al buscar todas las transacciones y usuarios:", error);
        return [];
    }
});
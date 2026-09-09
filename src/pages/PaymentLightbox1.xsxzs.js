import { lightbox } from 'wix-window-frontend';
import wixData from 'wix-data';

$w.onReady(function () {
    $w('#htmlEmbed1').hide();
    $w('#statusText').text = 'Preparando formulario de pago...';
    $w('#btnCancel').show();

    const receivedData = lightbox.getContext();
    
    if (!receivedData || !receivedData.redirectData) {
        showError('Datos incompletos recibidos');
        return;
    }

    // Configurar el HTML Embed
    $w('#htmlEmbed1').onMessage(async (event) => {
        try {
            if (event.data.type === 'htmlReady') {
                await initializePaymentForm(receivedData);
            } 
            else if (event.data.type === 'formSubmitted') {
                handleFormSubmission(event.data);
            }
            else if (event.data.type === 'error') {
                handlePaymentError(event.data);
            }
            else if (event.data.type === 'powertranzResponse') {
                handlePowertranzResponse(event.data);
            }
        } catch (error) {
            showError(`Error inesperado: ${error.message}`);
        }
    });

    // Configurar timeout
    const PAYMENT_TIMEOUT = 10 * 60 * 1000; // 10 minutos
    const timeoutId = setTimeout(() => {
        showError('Tiempo de espera agotado. Por favor, intente nuevamente.');
    }, PAYMENT_TIMEOUT);

    // Configurar botón de cancelar
    $w('#btnCancel').onClick(() => {
        clearTimeout(timeoutId);
        lightbox.close({ 
            success: false, 
            error: 'Pago cancelado por el usuario' 
        });
    });
});

async function initializePaymentForm(data) {
    try {
        await logEvent('INFO', 'Inicializando formulario de pago', {
            transactionId: data.transactionId,
            userId: data.userId
        });

        $w('#htmlEmbed1').postMessage({
            type: 'paymentData',
            spiToken: data.spiToken,
            transactionId: data.transactionId,
            userId: data.userId,
            orderId: data.orderId,
            amount: data.amount,
            sessionId: data.sessionId,
            csrfToken: data.csrfToken,
            redirectData: data.redirectData
        });

        $w('#htmlEmbed1').show();
        $w('#statusText').text = 'Complete los datos de pago...';
        
    } catch (error) {
        showError(`Error al inicializar el pago: ${error.message}`);
    }
}

function handleFormSubmission(data) {
    $w('#statusText').text = 'Procesando pago...';
    $w('#btnCancel').disable();
    
    logEvent('INFO', 'Formulario enviado a Powertranz', {
        transactionId: data.transactionId,
        userId: data.userId,
        timestamp: new Date().toISOString()
    });
}

function handlePaymentError(data) {
    let userMessage = 'Error en el proceso de pago';
    
    if (data.message.includes('token')) {
        userMessage = 'Error en la configuración del pago. Recargue la página.';
    } else if (data.message.includes('datos')) {
        userMessage = 'Complete todos los datos requeridos.';
    }
    
    showError(userMessage);
}

function handlePowertranzResponse(data) {
    if (data.success) {
        $w('#statusText').text = 'Pago completado con éxito!';
        lightbox.close({
            success: true,
            transactionId: data.transactionId,
            message: 'Pago completado'
        });
    } else {
        let errorMessage = data.message || 'Error en el pago';
        if (data.details && data.details[0]?.Message) {
            errorMessage = data.details[0].Message;
        }
        showError(errorMessage);
    }
}

function showError(message) {
    $w('#statusText').text = `Error: ${message}`;
    $w('#btnCancel').show();
    $w('#htmlEmbed1').hide();
    
    logEvent('ERROR', 'Error en PaymentLightbox', {
        message,
        timestamp: new Date().toISOString()
    });
}

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
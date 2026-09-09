import { lightbox } from 'wix-window-frontend';

$w.onReady(function () {
    // Ocultar htmlComponent inicialmente
    $w('#htmlComponent').hide();

    // Obtener datos enviados desde la página
    const receivedData = lightbox.getContext();

    // Validar datos recibidos
    if (receivedData && receivedData.redirectData) {
        // Retrasar postMessage para asegurar que el componente HTML esté listo
        setTimeout(() => {
            $w('#htmlComponent').postMessage(receivedData.redirectData);
            $w('#htmlComponent').show();
            $w('#statusText').text = 'Ingresa los datos de tu tarjeta en el formulario seguro.';
        }, 100);

        // Registrar en logs
        console.log('Formulario de pago cargado en Lightbox', {
            transactionId: receivedData.transactionId,
            orderId: receivedData.orderId || 'N/A',
            userId: receivedData.userId
        });
    } else {
        console.error('No se recibieron datos válidos en el Lightbox');
        $w('#statusText').text = 'Error: No se pudo cargar el formulario de pago.';
        $w('#statusText').show();
        $w('#btnClose').show();
    }

    // Botón para cerrar el Lightbox
    $w('#btnClose').onClick(() => {
        lightbox.close({ message: 'Formulario cerrado por el usuario' });
    });
});
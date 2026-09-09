import wixLocation from 'wix-location';

$w.onReady(function () {
    // 1. Obtenemos los parámetros de la URL.
    const query = wixLocation.query;

    // 2. Verificamos si el parámetro 'orderId' existe.
    if (query.orderId) {
        // Si existe, mostramos el mensaje de éxito personalizado.
        $w('#statusText').text = `¡Pago completado exitosamente! Tu transaccion es: ${query.orderId}`;
    } else {
        // Si no, mostramos el mensaje de éxito genérico.
        $w('#statusText').text = '¡Pago completado exitosamente!';
    }

    // 3. Configuramos el evento de clic para el botón.
    $w('#dashboardButton').onClick(() => {
        wixLocation.to('/dashboard');
    });
});
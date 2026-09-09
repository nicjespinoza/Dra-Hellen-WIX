import wixLocation from 'wix-location';

$w.onReady(function () {
    // 1. Obtenemos todos los parámetros de la URL.
    // Ejemplo: si la URL es /pago-fallido?reason=Fondos%20Insuficientes
    // query será { reason: "Fondos Insuficientes" }
    const query = wixLocation.query;

    // 2. Verificamos si el parámetro 'reason' existe en la URL.
    if (query.reason) {
        // Si existe, mostramos el mensaje de error específico.
        $w('#statusText').text = `La entidad emisora de tu tarjeta rechazo el pago. 
        Por lo general, los rechazos se deben a que no hay fondos suficientes o al estado de la tarjeta. 
        Verifica la tarjeta o selecciona otra forma de pago: 
        ${query.reason}.`;
    } else {
        // Si no, mostramos un mensaje genérico como antes.
        $w('#statusText').text = 'Error en el procesamiento del pago. Por favor, intenta de nuevo.';
    }

    // Mantenemos la funcionalidad de clic para volver al dashboard.
    $w('#button1').onClick(() => {
        wixLocation.to('/dashboard');
    });
});
import { lightbox } from 'wix-window-frontend';
import { reverseTransaction } from 'backend/powertranz.web.js';

let transaccionActual; // Para guardar los datos recibidos

$w.onReady(function () {
    // 1. Recibimos los datos de la transacción desde la página del dashboard
    transaccionActual = lightbox.getContext();

    if (transaccionActual && transaccionActual.powertranzTransactionId) {
        // 2. Mostramos el mensaje de confirmación al usuario
        $w('#textMensaje').text = `¿Estás seguro de que deseas cancelar el plan y revertir el pago por $${transaccionActual.amount.toFixed(2)}? (ID: ${transaccionActual.powertranzTransactionId})`;
        $w('#btnConfirmarCancelacion').onClick(handleConfirmarCancelacion);
    } else {
        // Si no se reciben datos, mostramos un error y cerramos
        $w('#textMensaje').text = "Error: No se pudo cargar la información de la transacción.";
        $w('#btnConfirmarCancelacion').disable();
    }
});

async function handleConfirmarCancelacion() {
    // Deshabilitamos el botón para evitar múltiples clics
    $w('#btnConfirmarCancelacion').disable();
    $w('#btnConfirmarCancelacion').label = "Procesando...";
    $w('#textEstado').text = ""; // Limpiamos el estado anterior

    try {
        // 3. Llamamos a la función del backend con el ID de la transacción
        const resultado = await reverseTransaction(transaccionActual.powertranzTransactionId);

        if (resultado.success) {
            $w('#textEstado').text = "¡Cancelación exitosa!";
            // Cerramos el lightbox y enviamos una señal de éxito a la página principal
            setTimeout(() => {
                lightbox.close({ reversionExitosa: true });
            }, 1500); // Esperamos un poco para que el usuario vea el mensaje
        }

    } catch (error) {
        // 4. Si hay un error, se lo mostramos al usuario
        $w('#textEstado').text = `Error: ${error.message}`;
        $w('#btnConfirmarCancelacion').enable();
        $w('#btnConfirmarCancelacion').label = "Confirmar Cancelación";
    }
}
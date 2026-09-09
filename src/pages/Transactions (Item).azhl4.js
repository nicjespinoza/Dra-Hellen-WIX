import { openLightbox } from 'wix-window-frontend';
import { getAllTransactions } from 'backend/powertranz3.web.js';


// Referencia de la API de Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	configurarRepeater()
	cargarHistorialDePagos()

});

function configurarRepeater() {
    $w("#repeater1").onItemReady(($item, itemData, index) => {
        $item("#textIdpaciente").text = itemData.nombreUsuario;
        $item("#textIdTransaccion").text = itemData.orderId;
        $item("#textConceptoPago").text = itemData.conceptopago;
        $item("#textMontoPagado").text = `$${itemData.amount.toFixed(2)}`;
        if (itemData._createdDate) {
            const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
            $item("#textfecha").text = new Date(itemData._createdDate).toLocaleDateString('es-NI', opcionesFecha);
        } else {
            $item("#textfecha").text = "Fecha no disponible";
        }
        if (itemData.isReversible) {
            $item("#btnRevertir").label = "Cancelar Plan";
            $item("#btnRevertir").show();
            $item("#btnRevertir").onClick(async () => {
                const result = await openLightbox("reversiones", itemData);
                if (result && result.reversionExitosa) {
                    await cargarHistorialDePagos();
                }
            });
        } else if (itemData.status === 'Revertido') {
            $item("#btnRevertir").label = "Revertido";
            $item("#btnRevertir").show();
            $item("#btnRevertir").disable();
        } else {
            //$item("#btnRevertir").hide();
        }
    });
}

async function cargarHistorialDePagos() {
    try {
        const transactions = await getAllTransactions();
        if (transactions.length > 0) {
            $w("#repeater1").data = transactions;
            $w("#boxHistorialPagos").expand();
        } else {
            $w("#boxHistorialPagos").collapse();
        }
    } catch (error) {
        console.error("Error al cargar y mostrar el historial de pagos:", error);
    }
}
import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(function () {

});

export function btnactiva_click(event) {

const pacienteId = $w('#lightBoxReceive2').text;

    wixData.query("User")
        .eq("pacienteid", pacienteId)
        .limit(1)
        .find()
        .then((results) => {
            const item = results.items[0];
            if (item.emailVerified === "Yes") {
                guardarPaciente(item, { status: "Activo" });
            } else {
                guardarPaciente(item, {
                    status: "Activo",
                    emailVerified: "Yes",
                    nivelcurso: "caja1",
                    porcentajecurso: "0%"
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function guardarPaciente(item, updates) {
    Object.assign(item, updates);

    wixData.update("User", item)
        .then(() => {
            $w('#btnactiva').disable();
            $w('#txtnotif').show();
            $w('#txtnotif').text = `Paciente ${$w('#lightBoxReceive2').text} se ha activado con éxito, puede cerrar la pestaña.`;
            console.log("Se guardó el paciente");
        })
        .catch((err) => {
            console.log(err);
        });
}


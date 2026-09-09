import wixData from "wix-data";
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members';
import {getTotal} from 'backend/pacientes'
import {pacientes1} from 'public/dashboard'
import wixWindowFrontend from 'wix-window-frontend';


$w.onReady(async () => {
    if(wixWindowFrontend.formFactor === "Mobile"){
        $w('#caja').changeState("consola");
}

    const isLoggedIn = authentication.loggedIn();

    if (isLoggedIn) {
    const loggedInMember = await currentMember.getMember()
    console.log('Dra is logged');
    const fullName = `${loggedInMember.contactDetails.emails}`;

     wixData.query("autorizado")
         .eq("correo", fullName)
         .limit(1)
         .find()
         .then((results) => {

             console.log('Dra active');

             if (results.items.length > 0) {

                 $w('#caja').changeState("consola")
                
             } 
         })

 } else {

        $w('#caja').changeState("bloqueo")
			   wixWindow.openLightbox("accesodra");
			   $w('#btncerrar').disable()
			   $w('#button46').disable()

			   console.error("No login Dra")
			   

             }


})

$w.onReady(async function () {

   try { 

    // Obtener y mostrar total de pacientes
    const totalPacientes = await getTotal('User');
    $w('#1').text = "Total registro:" +"  " + totalPacientes.toLocaleString();
    console.log('Total paciente:', totalPacientes);

	   // Crear instancia de pacientes1
    const pacientesInstance = await pacientes1.create();
    console.log('Total Base public:', pacientesInstance);

    // Obtener y mostrar tipo de pacientes
    const tipoPaciente = await pacientesInstance.gettipopaciente();
    $w('#txttiporegistro').text = tipoPaciente;
    console.log('Tipo paciente:', tipoPaciente);

		const totalsexo = await pacientesInstance.getsexo();
    $w('#tsexo').text = "Sexo:" +"  " + totalsexo.toLocaleString();
    console.log('Total sexo:', totalsexo);

	  const datosGraficos1 = await pacientesInstance.getregistrografico();
    $w('#html1').postMessage(datosGraficos1);
    console.log('Grafico pastel 2', datosGraficos1);

	} catch (error) {
    console.error('Error en la ejecución:', error);
  }

    
    });


export function button48_click(event) {
	$w('#caja').changeState("state1")
}

$w.onReady(() => {
 
    $w('#text418').onClick(() => {
    $w('#dataset1').refresh()
    $w('#dropdown1').value = undefined;
    $w('#tagss').value = undefined;
    $w('#text418').hide();

 
    });
});

export function btncerrar_click(event) {
	authentication.logout();
    wixLocation.to("/");
}
 

function search() {
    const searchValue = String($w('#tagss').value);

    // Consulta para la columna "userName"
    const queryUserName = wixData.query("User")
        .contains("userName", searchValue)
        .find();

    // Consulta para la columna "pacienteid"
    const queryPacienteId = wixData.query("User")
        .contains("pacienteid", searchValue)
        .find();

    Promise.all([queryUserName, queryPacienteId])
        .then(results => {
            const combinedResults = results.reduce((acc, curr) => acc.concat(curr.items), []);
            $w('#repeater2').data = combinedResults;
        })
        .catch(error => {
            console.error(error);
        });

    $w('#text418').show();
}


export function dropdown1_change(event) {
	 $w('#text418').show();
}

 
export function tagss_input(event) {
	$w('#text418').show();
    search();

}


 
export function button50_click(event) {
	$w('#caja').changeState("consola")
}
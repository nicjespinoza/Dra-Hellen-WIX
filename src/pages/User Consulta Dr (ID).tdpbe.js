import wixData from 'wix-data';
import wixUsers from "wix-users";
import wixLocation from 'wix-location';

var currentItem;
$w.onReady(function () {
	$w('#dynamicDataset').onReady(() => {

        currentItem = $w('#dynamicDataset').getCurrentItem();
        $w('#txtName').text =  currentItem.nombreCompleto
		$w('#txtd').text =  currentItem.peopleId
      
        $w('#txtemail').text =  currentItem.emailAddress
        $w('#txtsex').text =  currentItem.sexo
        
        

    
    });
});
 

export function button3_click(event) {

    let peso = parseFloat ($w('#sapeso').value)
	let altura = parseFloat ($w('#saaltura').value)
    let formula = peso / altura
    let imc = parseFloat((Number(formula) / altura) * 10000).toFixed(1);
    $w('#imc').value =  String(imc);
    
    
generateText(imc);

function generateText(imc) {

  if (Number(imc) <= 18.5) {
        $w("#bmiText").text = 'Paciente tiene bajo peso!';
         $w("#bmiText").show()
    } else if (Number(imc) > 18.5 && Number(imc) <= 24.9) {
        $w("#bmiText").text = 'IMC del paciente es normal.';
        $w("#bmiText").show()
    } else if (Number(imc) >= 25 && Number(imc) <= 29.9) {
        $w("#bmiText").text = 'Paciente tiene sobrepeso!';
        $w("#bmiText").show()
    } else if (Number(imc) > 29.9) {
        $w("#bmiText").text = '¡Advertencia, paciente con obesidad!';
        $w("#bmiText").show()
    }
}

}


 
export function button21_click(event) {

     let randVar = Math.floor(Math.random() * 89999) + 10000;        
    let rand =   String("C" + String(randVar));       
    let quote = rand

   
	$w('#dataset1').setFieldValue("idpaciente" , currentItem._id);
    $w('#dataset1').setFieldValue("sexo" , $w('#txtsex').text);
    $w('#dataset1').setFieldValue("iDpaciente" , $w('#txtd').text);
    $w('#dataset1').setFieldValue("email" , $w('#txtemail').text);
    $w('#dataset1').setFieldValue("imc" , $w('#imc').value);
    $w('#dataset1').setFieldValue("bmiText" , $w('#bmiText').text);
    $w('#dataset1').setFieldValue("fc" , $w('#fc').value);
    $w('#dataset1').setFieldValue("fr" , $w('#fr').value);
    $w('#dataset1').setFieldValue("ta" , $w('#ta').value);
    $w('#dataset1').setFieldValue("t" , $w('#t').value);
    $w('#dataset1').setFieldValue("pesoKg" , $w('#sapeso').value);
    $w('#dataset1').setFieldValue("alturaMt" , $w('#saaltura').value);
    $w('#dataset1').setFieldValue("observacionYAnalisis" , $w('#observacionYAnalisis').value)
    $w('#dataset1').setFieldValue("diagnosticoYProblema" , $w('#diagnosticoYProblema').value)
    $w('#dataset1').setFieldValue("examenes" , $w('#examenes').value)
    $w('#dataset1').setFieldValue("medicamento" , $w('#medicamento').value)
    $w('#dataset1').setFieldValue("title" , $w('#Motivoconsulta').value)
    $w('#dataset1').setFieldValue("codeunico" , quote);
     $w('#dataset1').setFieldValue("historia" , "activa");
    $w('#dynamicDataset').save()
    $w('#dataset1').save()
	.then(() => {

        $w("#txtMessage01").text = "Tu contenido se ha guardado correctamente ... cierra la página";
        $w("#txtMessage01").show();
         $w("#bmiText").hide()
         
        $w('#button21').disable();
    })
    
    .catch((err) => {
        
        console.log(err);
        $w("#txtMessage02").text =  "Ocurrió un error. ¡revisa los campos!";		   
        $w("#txtMessage02").show();
    });
}
 

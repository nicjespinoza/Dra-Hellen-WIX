import wixWindow from "wix-window";
import wixData from "wix-data";

$w.onReady(function () {

let received = wixWindow.lightbox.getContext();
$w('#txtMessage').text = received.codeunico;

$w('#txtMessage').show() 

letras()


});

function letras() {


wixData.query("consultas")
        .eq("codeunico", $w('#txtMessage').text)
        .limit(1)
        .find()
        .then((results) => {    

        if(results.items.length > 0) {

            $w("#fc").text =  results.items[0].fc;
            $w("#fr").text =  results.items[0].fr;
            $w("#ta").text =  results.items[0].ta;
            $w("#t").text =  results.items[0].t;
            $w("#pesoKg").text =  results.items[0].pesoKg;
            $w("#altura").text =  results.items[0].altura;
            $w("#imc").text =  results.items[0].imc;
            $w("#bmiText").text =  results.items[0].bmiText;
            $w('#mc').text =  results.items[0].title;
              $w('#hea').text =  results.items[0].observacionYAnalisis;
              $w('#exFx').text =  results.items[0].diagnosticoYProblema;
              
              $w('#medicamento').text =  results.items[0].medicamento;
              $w('#dosistomar').text =  results.items[0].examenes;
              $w('#txtidpaciente').text =  results.items[0].iDpaciente;
              
			   $w('#mc').text =  results.items[0].title;
			   
			
		}
		
	
    
  } )
  .catch( (error) => {

    console.log(error)

  } );


}


 

$w.onReady(function () {

	    $w('#sexo').onChange(() => {
        $w('#Altura').enable();
        $w('#cintura').enable();
        calculateResult();
    });

    $w('#Altura').onInput(() => calculateResult());
    $w('#cintura').onInput(() => calculateResult());

    function calculateResult() {
        let sexo = $w('#sexo').value;
        let altura = Number($w('#Altura').value);
        let cintura = Number($w('#cintura').value);
        let result = 0;
        let status = '';

        if (altura > 0 && cintura > 0 && sexo) {
            if (sexo === 'Masculino') {
                result = 64 - (20 * (altura / cintura));
                status = result >= 22.8 ? 'Obesidad' : 'Normal';
            } else if (sexo === 'Femenino') {
                result = 76 - (20 * (altura / cintura));
                status = result >= 33.9 ? 'Obesidad' : 'Normal';
            }
			$w('#resultados').show()
            $w('#resultados').text = `Porcentaje %: ${result.toFixed(2)} Rango: ${status}`;
        } else {
            $w('#resultados').text = '';
        }
    }

});
 


$w('#image57').onClick((event) => {
let phone = +50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola" + " " + "quiero mas información acerca de como invertir en el futuro de mis hijos"
let text2 = text1.replace(/\s/g, "%20");
let link = "https://wa.me/" + phone + "?text=" + text2;

$w("#what1").link = link;
$w('#box3').show()

})
 


export function image147_click(event) {
	let phone = +50588440460 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola" + " " + "quiero mas información acerca KIWI T-Shirts"
let text2 = text1.replace(/\s/g, "%20");
let link = "https://wa.me/" + phone + "?text=" + text2;

$w("#what3").link = link;
$w('#what3').show()
}
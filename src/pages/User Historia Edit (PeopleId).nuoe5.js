// Referencia de la API de Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	// Escribe tu código de Javascript aquí usando la API de marco de Velo 

	// Escribe hola mundo:
	// console.log("¡Hola mundo!");

	// Llama las funciones en los elementos de la página, por ejemplo:
	// $w("#button1").label = "¡Haz clic aquí!";

	// Haz clic en "Ejecutar", o ve a la vista previa de tu sitio, para ejecutar el código

});
 
export function nextButton1_click(event) {
	$w('#jobMultiStateBox').changeState("historia2")
}

export function nextButton2_click(event) {
	$w('#jobMultiStateBox').changeState("historia3") 
}
 
export function nextButton3_click(event) {
	$w('#jobMultiStateBox').changeState("historia5")  
}

export function nextButton5_click(event) {
	$w('#jobMultiStateBox').changeState("historia6")  
}


export function btnguardar_click(event) {

	$w("#dataset1").save()
    .then(() => {
			$w('#textnotiimagen3').show()
 

.catch((err) => {

    console.log(err);
	$w('#txtmens6').show()
 });

    })

	
}
 
export function button45_click(event) {
	$w('#jobMultiStateBox').changeState("historia5")   
}

export function button46_click(event) {
	$w('#jobMultiStateBox').changeState("historia3")  
}
 
export function button47_click(event) {
	$w('#jobMultiStateBox').changeState("historia2")  
}

export function button48_click(event) {
	$w('#jobMultiStateBox').changeState("historia1")  
}
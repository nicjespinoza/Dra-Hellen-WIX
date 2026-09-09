// Referencia de la API de Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	// Escribe tu código de Javascript aquí usando la API de marco de Velo 

	// Escribe hola mundo:
	// console.log("¡Hola mundo!");

	// Llama las funciones en los elementos de la página, por ejemplo:
	// $w("#button1").label = "¡Haz clic aquí!";

	// Haz clic en "Ejecutar", o ve a la vista previa de tu sitio, para ejecutar el código
})
 
export function btnclinica_click(event) {
	$w('#statebox10').changeState("state7")
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnrecordatorio_click(event) {
	$w('#statebox10').changeState("state8")
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnhistoria1_click(event) {
	$w('#statebox10').changeState("state9")
}




/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function btnhabitos1_click(event) {
	$w('#statebox10').changeState("state10")
}

export function btnalimentos_click(event) {
	$w('#statebox10').changeState("state11") 
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function button51_click(event) {
	$w('#statebox10').changeState("state8") 
}
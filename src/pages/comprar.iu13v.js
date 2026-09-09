import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';


 
let monto = wixWindow.lightbox.getContext();
let idpago = $w('#text62').text
let user = wixUsers.currentUser;

$w.onReady( function () {

  let received = wixWindow.lightbox.getContext();

  $w('#lightBoxReceive2').text = received.pageSend1;
  $w('#lightBoxReceive1').text = received.pageSend2;
  numero()

   $w("#copyButton").onClick(()=>{

        let textMessage = $w("#lightBoxReceive2").text;
        
        wixWindow.copyToClipboard(textMessage)
        .then(()=>{
            $w("#copyButton").disable();
            $w("#copyButton").label = 'ID copiado!';
        })
    })

} );

function numero() {
  
if ( monto.pageSend3 === "ID150P") {

$w('#text62').text = monto.pageSend3
$w('#text2').text ="Plan nutricional individual en línea"
$w('#btn100').show()
$w('#btn150').hide()
$w('#btn170').hide()
$w('#btn160').hide()
$w('#btn50').hide()
$w('#btn15').hide()
$w('#btn30').hide()
$w('#btn20').hide()

$w('#btn100').onClick((event) => {

let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso:" + "" +  "Plan individual en línea con rutina" + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn100').label = "Dar clic icono >"
  $w('#btn100').disable()

  })

}



if ( monto.pageSend8 === "ID300P") {

$w('#text62').text = monto.pageSend8
$w('#text2').text ="Plan nutricional 3 personas:"
  $w('#btn150').show()
  $w('#btn100').hide()
  $w('#btn170').hide()
  $w('#btn160').hide()
  $w('#btn50').hide()
  $w('#btn15').hide()
  $w('#btn30').hide()
  $w('#btn20').hide()
    
  $w('#btn150').onClick( (event) => {
    

let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso:" + " " + "Plan Nutricional para 3 personas" + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn150').label = "Dar clic icono >"
  $w('#btn150').disable()

  })

}

if ( monto.pageSend5 === "ID250P") {

$w('#text62').text = monto.pageSend5
$w('#text2').text ="Plan nutricional 2 personas:"
  $w('#btn170').show()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn160').hide()
  $w('#btn50').hide()
  $w('#btn15').hide()
  $w('#btn30').hide()
  $w('#btn20').hide()
    
  $w('#btn170').onClick( (event) => {
    
let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso:" + " " + "Plan Nutricional para 2 personas con rutina" + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn170').label = "Dar clic icono >"
  $w('#btn170').disable()

  })

}

if ( monto.pageSend15 === "ID50P") {

$w('#text62').text = monto.pageSend15
$w('#text2').text ="Consulta de seguimiento"
  $w('#btn15').show()
  $w('#btn160').hide()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn170').hide()
  $w('#btn50').hide()
  $w('#btn30').hide()
$w('#btn20').hide()
   
  $w('#btn15').onClick( (event) => {
    
 let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso:" + " " + "$50.00 " + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn15').label = "Dar clic icono >"
  $w('#btn15').disable()

  })

}

if ( monto.pageSend7 === "ID190P") {

$w('#text62').text = monto.pageSend7
$w('#text2').text ="Plan nutricional individual presencial:"
  $w('#btn50').show()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn160').hide()
  $w('#btn170').hide()
  $w('#btn15').hide()
  $w('#btn30').hide()
  $w('#btn20').hide()
  
    
  $w('#btn50').onClick( (event) => {

let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso:" + " " + "$190.00 " + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn50').label = "Dar clic icono >"
  $w('#btn50').disable()

  })

}


if ( monto.pageSend16 === "ID8P") {

$w('#text62').text = monto.pageSend16
$w('#text2').text ="Libro de recetas digital"
  $w('#btn160').show()
  $w('#btn50').hide()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn15').hide()
  $w('#btn170').hide()
  $w('#btn30').hide()
  $w('#btn20').hide()
    
  $w('#btn160').onClick( (event) => {
    
    let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el libro de receta:" + " " + "$8.99 " + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn160').label = "Dar clic icono >"
  $w('#btn160').disable()

  })

}


if ( monto.pageSend17 === "ID30P") {

$w('#text62').text = monto.pageSend17
$w('#text2').text ="Rutina de entrenamiento"
  $w('#btn30').show()
  $w('#btn50').hide()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn160').hide()
  $w('#btn170').hide()
  $w('#btn15').hide()
  $w('#btn20').hide()
  
    
  $w('#btn30').onClick( (event) => {
    
   let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar la rutina de entrenamientoentrenamiento:" + " " + "$30.00 " + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn30').label = "Dar clic icono >"
  $w('#btn30').disable()

  })

}

if ( monto.pageSend18 === "ID19P") {

$w('#text62').text = monto.pageSend18
$w('#text2').text ="Curso de nutriciòn"
  $w('#btn20').show()
  $w('#btn30').hide()
  $w('#btn50').hide()
  $w('#btn100').hide()
  $w('#btn150').hide()
  $w('#btn160').hide()
  $w('#btn170').hide()
  $w('#btn15').hide()
  
  
    
  $w('#btn20').onClick( (event) => {
    
  let phone = 50586728580 ; // Your Phone Number: Country Code + Number //
let text1 = "Hola Dra. Hellen Arana quiero comprar el curso de nutrición:" + " " + "$19.99 " + " " + "mi ID es:" + " " + $w('#lightBoxReceive2').text
let text2 = encodeURIComponent(text1); // Codificar la URL correctamente
let link = "https://wa.me/" + phone + "?text=" + text2;

  $w("#w150").link = link;
    console.log(link);
  $w("#w150").show()
  $w('#btn20').label = "Dar clic icono >"
  $w('#btn20').disable()

  })

}

}
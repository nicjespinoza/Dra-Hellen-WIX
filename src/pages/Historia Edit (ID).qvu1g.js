import wixWindow from "wix-window";
import wixUsers from "wix-users";
import {fetch} from "wix-fetch";
import wixData from "wix-data";
import {memory} from "wix-storage";

$w.onReady(function () {
	
  
    loginCheck();
  
    

function loginCheck(){

    if(wixUsers.currentUser.loggedIn){
                
        let user = wixUsers.currentUser;

        wixData.query("User")
        .eq("_id", user.id)
        .limit(1)
        .find()
        .then((results) => {    

            $w("#btnlogin2").show()
            $w("#btnlogin1").hide()
            
           

        });

    } else {

        $w("#btnlogin1").show()
        
        $w("#btnlogin2").hide()
        


        setTimeout(checkingLoop, 3000);
        
    }

}

function checkingLoop(){

    if(wixUsers.currentUser.loggedIn){
        loginCheck();
    } else {
        setTimeout(checkingLoop, 3000);
    }

}
});// Referencia de la API de Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	// Escribe tu código de Javascript aquí usando la API de marco de Velo 

	// Escribe hola mundo:
	// console.log("¡Hola mundo!");

	// Llama las funciones en los elementos de la página, por ejemplo:
	// $w("#button1").label = "¡Haz clic aquí!";

	// Haz clic en "Ejecutar", o ve a la vista previa de tu sitio, para ejecutar el código

});
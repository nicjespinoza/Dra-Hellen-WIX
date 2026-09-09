import wixWindow from "wix-window";
import wixUsers from "wix-users";
import { fetch } from "wix-fetch";
import wixData from "wix-data";
import wixLocation from 'wix-location';

$w.onReady(function () {


});

function completeSignup2() {

wixData.query("autorizado")
        .eq("correo", $w("#iptemaillogin").value)
        .limit(1)
        .find()
        .then((results) => {

            if (results.items.length > 0) {
               $w('#button45').enable()
            } else {
             $w('#button45').disable()
			  $w("#txtMessage2").text = "Usuario no autorizado para ingresar.";
            $w("#txtMessage2").show();
              
            }

        })

}

export function iptemaillogin_change(event) {
	completeSignup2()
}
 
export function button45_click(event) {
		$w("#txtMessage1").show();
    $w("#txtMessage1").text = "Un momento su información está siendo procesada...";

    completeSignup3();
}

function completeSignup3() {

    wixUsers.login($w("#iptemaillogin").value, $w("#iptpasslogin").value)
        .then(() => {

            $w("#txtMessage1").text = "¡Acceso exitoso! Esta ventana se cerrará automáticamente.";
            $w("#txtMessage1").show();
            wixLocation.to("/user/dashboard");
            //setTimeout(btnCloseWindow_click, 2000);

        })
        .catch((err) => {

            $w("#txtMessage2").text = "Su contraseña es incorrecta, inténtelo de nuevo.";
            $w("#txtMessage2").show();
            $w("#forgotPassword").show();
            $w("#txtMessage1").hide()

        });

}


export function iptpasslogin_keyPress(event) {
	$w("#txtMessage2").hide();
}
 
export function iptemaillogin_keyPress(event) {
	$w("#txtMessage2").hide();
}
import wixWindow from "wix-window";
import wixUsers from "wix-users";
import { fetch } from "wix-fetch";
import wixData from "wix-data";
import wixLocation from 'wix-location';

let ipAddress;
let ipCountry;
let ipCity;
let ipLatitud;
let ipLongitud;
let ipISPName;
let ipResolvedIPName;
let debounceTimer;

let interes = wixWindow.lightbox.getContext();

$w.onReady(function () {


getUserIP();
 getUserIP1()


       
});


function getUserIP1() {

$w('#txtniveles').text = interes.pageSend1
$w('#txtniveles').text = interes.pageSend2
$w('#txtniveles').text = interes.pageSend3
$w('#txtniveles').text = interes.pageSend4
$w('#txtniveles').text = interes.pageSend5

}

function getUserIP() {
    fetch('https://extreme-ip-lookup.com/json/?key=lcoizLRx0miRcWGfEKRn', {
            method: 'get'
        })
        .then((httpResponse) => {
            if (httpResponse.ok) {
                return httpResponse.json();
            }
        })
        .then((json) => {
            ipAddress = json.query;
            ipCountry = json.country;
            ipCity = json.city;
            ipLatitud = json.lat;
            ipLongitud = json.lon;
            ipISPName = json.isp;
            ipResolvedIPName = json.ipName;

        })
}

export function btnsignup_click(event) {
    $w('#registro').changeState("state2")
}

export function btnlogin_click(event) {
    $w("#txtMessage1").show();
    $w("#txtMessage1").text = "Un momento su información está siendo procesada...";

    completeSignup1();

}

function completeSignup1() {

    wixUsers.login($w("#iptemaillogin").value, $w("#iptpasslogin").value)
        .then(() => {

            $w("#txtMessage1").text = "¡Acceso exitoso! Esta ventana se cerrará automáticamente.";
            $w("#txtMessage1").show();
            wixLocation.to("/consola");
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
    $w("#txtMessage2").hide()
    $w("#txtMessage1").hide()
}


export function btnaccs_click(event) {
    $w('#registro').changeState("state1")
}

export function button22_click(event) {
    $w('#registro').changeState("state2")
}




export function iptemaillogin_keyPress(event) {
	completeSignup2()
    $w('#btnlogin').show()

}

function completeSignup2() {

wixData.query("autorizado")
        .eq("correo", $w("#iptemaillogin").value)
        .limit(1)
        .find()
        .then((results) => {

            if (results.items.length > 0) {
                $w("#txtMessage1").text = "Bienvenida Dra. Hellen Araya Parrales";
                $w("#txtMessage1").show();
                $w('#btnadmin').show();
                $w('#btnlogin').hide();
            } else {
              $w('#btnadmin').hide(); 
              $w("#txtMessage1").hide();
              $w('#btnlogin').show();
              
            }

        })

}

export function iptemaillogin_change(event) {
	completeSignup2()
}

export function btnadmin_click(event) {

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

 
export function forgotPassword_click(event) {
    
 wixWindow.lightbox.close()
        wixUsers.promptForgotPassword()
            .then(() => {
                console.log("Password reset submitted");
            })
            .catch((err) => {
                let errorMsg = err; //"The user closed the forgot password dialog"   
            });

    }
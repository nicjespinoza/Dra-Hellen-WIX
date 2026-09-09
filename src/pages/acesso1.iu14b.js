import wixWindow from "wix-window";
import wixUsers from "wix-users";
import { authentication } from 'wix-members';
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


$w.onReady(function () {


getUserIP();


       
});

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

	if(wixWindow.formFactor === "Mobile"){
  $w('#registro').changeState("stateregistro")
} 
   $w('#registro').changeState("stateregistro")

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

export function forgotPassword_click(event) {
 wixWindow.lightbox.close()
        authentication.promptForgotPassword()
            .then(() => {
                console.log("Password reset submitted");
            })
            .catch((err) => {
                let errorMsg = err; //"The user closed the forgot password dialog"   
            });

    }

	
export function iptpasslogin_keyPress(event) {
    $w("#txtMessage2").hide()
    $w("#txtMessage1").hide()
}

export function iptfirstname_keyPress(event) {
    $w('#txtMessage4').hide()
    $w("#txtMessage").hide();
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
    }
    debounceTimer = setTimeout(doChecks, 2000);
}

export function iptlastname_keyPress(event) {
    $w('#txtMessage4').hide()
    $w("#txtMessage").hide();
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
    }
    debounceTimer = setTimeout(doChecks, 2000);
}

export function iptemailregister_keyPress(event) {
    $w('#txtMessage4').hide()
    $w("#txtMessage").hide();
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
    }
    debounceTimer = setTimeout(doChecks, 2000);
}

export function iptphone_keyPress(event) {

    $w('#txtMessage4').hide()
    $w("#txtMessage").hide();
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
    }
    debounceTimer = setTimeout(doChecks, 2000);
}

export function iptpasswordregister_keyPress(event) {

    $w('#txtMessage4').hide()
    $w("#txtMessage").hide();
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = undefined;
    }
    debounceTimer = setTimeout(doChecks, 2000);
}

export function btnaccs_click(event) {
    $w('#registro').changeState("statelogin")
}

export function button22_click(event) {
    $w('#registro').changeState("stateregistro")
}


export function btnregistro_click(event) {
	
    $w("#txtMessage").show();

    if ($w("#checkbox1").checked === false) {

        $w("#txtMessage").text = "Por favor acepte las políticas de privacidad para el registro";

    } else {
        $w("#txtMessage").text = "Un momento su información está siendo procesada...";
        completeSignup();
    }

}

function completeSignup() {

    $w("#btnregistro").disable();

    wixData.query("User")
        .count()
        .then((number) => {

            var countNumber = "HA-" + number;

            let emails = [];
            emails.push($w('#iptemailregister').value);
            // register as member using form data    
            wixUsers.register($w('#iptemailregister').value, $w('#iptpasswordregister').value, {
                    "contactInfo": {
                        "firstName": $w('#iptfirstname').value,
                        "lastName": $w('#iptlastName').value,
                        "phone": $w('#iptphone').value,
                        "emails": emails,
                       
                    }

                })
                .then(() => {

                    $w('#iptfirstname').disable();
                    $w('#iptlastName').disable();
                    $w('#iptphone').disable();
                    $w('#iptpasswordregister').disable();
                    $w('#iptemailregister').disable();

                    let randVar = Math.floor(Math.random() * 8999) + 1000;
                    let rand = "HA" + randVar
                    let generatedId = rand.toString()

                    const toInsert = {

                        "_id": wixUsers.currentUser.id,
                        "emailAddress": $w('#iptemailregister').value,
                        "firstName": $w('#iptfirstname').value,
                        "lastName": $w('#iptlastName').value,
                        "nombreCompleto": $w('#iptfirstname').value + " " + $w('#iptlastName').value,
                        "userName": $w('#iptfirstname').value + " " + $w('#iptlastName').value,
                        "telefono": $w('#iptphone').value,
                        "politica": true,
                        "verified": "Pending",
                        "status": "Inicio",
                        "randomNumber": randVar,
                        "peopleId": countNumber,
                        "pacienteid" : generatedId,
                        "registrarCliente": "Pendiente",
                        "nivel": "principio",
                        "country": ipCountry,
                        "emailVerified": "Pendiente",
                        "ipAddress": ipAddress,
                        "city": ipCity,
                        "latitud": ipLatitud,
                        "longitud": ipLongitud,
                        "resolvedIpName": ipISPName,
                        "ispName": ipResolvedIPName,
                        "profilePicture": 'https://static.wixstatic.com/media/3743a7_23d06bc673a54c6198fa211d6bb0ec4b~mv2.png'
                    }
                    wixData.insert("User", toInsert)
                        .then(() => {
                            $w("#txtMessage").text = "¡Registro exitoso! Espera unos segundos serás redirigido a tu perfil.";
                            $w("#txtMessage").show();

                            //wixLocation.to("/acceso");   

                            wixLocation.to("/consola") // air/data * usercreate/client/ 
                            //setTimeout(button2_click,2000)

                        });

                })
                .catch((err) => {
                    console.log(err);
                    $w("#txtMessage").text = "Se presentó un error inesperado y tu información no fue procesada";
                    $w("#txtMessage").show();
                    $w("#btnregistro").enable();

                });
        })
}

function doChecks() {

    wixData.query("User")
        .eq("emailAddress", $w("#iptemailregister").value)
        .limit(1)
        .find()
        .then((results) => {

            if (results.items.length > 0) {
                $w("#txtMessage4").text = "Este email ya está registrado, inicia sesión 👉";
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').expand();
            } else if ($w("#iptfirstname").value.length < 2 || $w("#iptlastName").value.length < 2) {
                $w("#txtMessage4").text = "Introduzca nombres y apellidos válidos.";
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').collapse();
            } else if ($w("#iptemailregister").value.length < 4) {
                $w("#txtMessage4").text = "Por favor ingrese un correo electrónico";
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').collapse();
            } else if ($w("#iptemailregister").value.includes("@") === false) {
                $w("#txtMessage4").text = "Por favor introduzca una dirección de correo electrónico válida";
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').collapse();

            } else if ($w("#iptpasswordregister").value.length < 6) {
                $w("#txtMessage4").text = "Por favor ingrese una contraseña con al menos 6 caracteres";
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').collapse();
            } else if ($w("#iptphone").value.length < 8) {
                $w("#txtMessage4").text = "Por favor ingrese su teléfono 8 digitos"; 
                $w("#txtMessage4").show();
                $w("#btnregistro").disable();
                $w('#btnaccs').collapse();
            } else {
                $w("#btnregistro").enable();
                $w("#txtMessage4").hide();
                $w('#btnaccs').collapse();
            }

        })

}

export function checkbox1_change(event) {

    $w('#txtMessage').hide()

    $w('#txtMessage4').hide()
}


export function text53_click(event) {
	$w('#registro').changeState("statecondiciones")
}


export function button26_click(event) {
$w('#registro').changeState("stateregistro")
}

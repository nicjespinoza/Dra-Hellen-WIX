import wixData from "wix-data";
import wixUsers from "wix-users";
import {memory} from "wix-storage";
import {sendCode} from 'backend/Functions';
import {verifyCode} from 'backend/Functions';

let seed;
$w.onReady(async function () { 

	seed = Math.floor(Math.random() * 899999) + 100000;

})
	
 export async function btnSendCode_click(event) {
	let user = wixUsers.currentUser;

  if ($w("#btnSendCode").label === "Enviar código") {
    try {
      let results = await wixData.query("User").eq("_id", user.id).limit(1).find();
      let item = results.items[0];
      let userName = item.userName;
      let email = item.emailAddress;

      await sendCode(user.id, userName, seed);

      console.log(seed);
      $w("#btnSendCode").label = "Confirmar código";
      $w("#iptCode").label = "Ingresa tu código";
      $w("#txtemail").text = email;
      $w("#txtemail").show();
      $w("#txtMessage").show();
      $w("#iptCode").enable();
      $w("#iptCode").show();
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    $w("#btnSendCode").disable();
    $w("#txtMessage").text = "Espere por favor ...";
    $w("#txtMessage").show();

    try {
      let result = await verifyCode(seed, $w("#iptCode").value);

      if (result.test === true) {
        let results = await wixData.query("User").eq("_id", user.id).limit(1).find();
        let item = results.items[0];
        item.emailVerified = "Yes";
        item.status = "Activo";

        await wixData.update("User", item);

        $w("#txtMessage").text = "Su correo electrónico ha sido verificado con éxito. Puedes cerrar esta ventana.";
        $w("#button6").show();
        memory.setItem("emailVerified", "Yes");
      } else {
        $w("#txtMessage").text = "Su código de verificación no concuerda... Vuelva a intentarlo.";
        $w("#btnSendCode").enable();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
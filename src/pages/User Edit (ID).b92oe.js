
import wixData from "wix-data";
import wixLocation from 'wix-location';

let profilePictureURL;
let currentUsersName;

$w.onReady(function() {

setupDatePicker("#datePickerID", "#iptedad");

    $w("#dbPeople").onReady(() => {

         
        let currentItem = $w("#dbPeople").getCurrentItem();

	   if(currentItem.status === "Activo"){
            $w("#btnactualizar").show();
			$w('#btnUpdateProfile').hide()
            
        } else if (currentItem.status === "Paciente")  {

            $w("#btnactualizar").show();
			$w('#btnUpdateProfile').hide()
        }
      
    })

function setupDatePicker(datePickerId, targetInputId) {
    $w(datePickerId).onChange(() => {
        const todaysDate = new Date().getFullYear();
        const inputDate = $w(datePickerId).value;
        
        if (inputDate) {
            const inputDateYear = inputDate.getFullYear();
            const edad = String(todaysDate - Number(inputDateYear));
            $w(targetInputId).value = edad;
        }
    });
}

	  })
 
export function btnUpdateProfile_click(event) {

	 var telefono = $w('#iptphone').value

	$w("#dbPeople").setFieldValue("firstName", $w("#iptFirstName").value);
    $w("#dbPeople").setFieldValue("lastName", $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("addressLine1", $w("#direccion").value);
    $w("#dbPeople").setFieldValue("gender", $w("#iptGender").value);
    $w("#dbPeople").setFieldValue("edad", $w("#iptedad").value);
    $w("#dbPeople").setFieldValue("birthYear", $w("#datePickerID").value);
    $w("#dbPeople").setFieldValue("telefono",  telefono);
    $w("#dbPeople").setFieldValue("userName", $w("#iptFirstName").value +" " + $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("status", "Medio");
    $w("#dbPeople").setFieldValue("countryCode", "558");

    $w("#dbPeople").save()
    .then(() => {
        $w("#txtMessage").text = "¡Tu perfil ha sido actualizado!"; $w("#txtMessage").show();
        $w('#btnactualizar').show()
        $w("#iptFirstName").disable()
        $w("#iptLastName").disable()
        $w("#direccion").disable()
        $w("#iptGender").disable()
        $w("#iptedad").disable()
        $w("#datePickerID").disable()
        $w("#iptphone").disable()
        $w("#btnUpdateProfile").disable()
        $w("#button46").show()
         wixLocation.to("/dashboard")
    

		//$w('#botonverde').show();
    })
    .catch((err) => {
        $w("#txtMessage1").text = "¡Algo salió mal. Por favor, vuelva a intentarlo!"; $w("#txtMessage1").show();
    });

}


export function btnactualizar_click(event) {

	var telefono = $w('#iptphone').value
 $w("#dbPeople").setFieldValue("firstName", $w("#iptFirstName").value);
    $w("#dbPeople").setFieldValue("lastName", $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("addressLine1", $w("#direccion").value);
    $w("#dbPeople").setFieldValue("gender", $w("#iptGender").value);
    $w("#dbPeople").setFieldValue("edad", $w("#iptedad").value);
    $w("#dbPeople").setFieldValue("birthYear", $w("#datePickerID").value);
    $w("#dbPeople").setFieldValue("telefono", telefono);
    $w("#dbPeople").setFieldValue("userName", $w("#iptFirstName").value +" " + $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("countryCode", "558");
     $w("#dbPeople").save()
    .then(() => {
        $w("#txtMessage").text = "¡Tu perfil ha sido actualizado!"; $w("#txtMessage").show();
         $w("#button46").show()
          wixLocation.to("/dashboard")
    })
    .catch((err) => {
        $w("#txtMessage1").text = "¡Algo salió mal. Por favor, vuelva a intentarlo!"; $w("#txtMessage1").show();
    });

}

 


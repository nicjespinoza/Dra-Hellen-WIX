import wixWindow from "wix-window";
import wixUsers from "wix-users";
import wixData from "wix-data";
import wixLocation from 'wix-location';

let profilePictureURL;
let currentUsersName;

$w.onReady(function() {



    $w("#dbPeople").onReady(() => {

         
        let currentItem = $w("#dbPeople").getCurrentItem();

	   if(currentItem.status === "Medio"){
            $w("#btnactualizar").show();
			$w('#btnUpdateProfile').hide()
            
        }   
      
    })


$w("#datePickerID").onChange(()=>{

var todaysDate = new Date().getFullYear();
let inputDate = $w('#datePickerID').value

var inputDateYear = inputDate.getFullYear();
var edad = String(todaysDate - Number(inputDateYear))

$w('#iptedad').value = edad


 })
 


	  })
 
export function btnUpdateProfile_click(event) {

	 var telefono = $w('#iptphone').value

	$w("#dbPeople").setFieldValue("firstName", $w("#iptFirstName").value);
    $w("#dbPeople").setFieldValue("lastName", $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("direccion", $w("#direccion").value);
    $w("#dbPeople").setFieldValue("gender", $w("#iptGender").value);
    $w("#dbPeople").setFieldValue("edad", $w("#iptedad").value);
    $w("#dbPeople").setFieldValue("birthYear", $w("#datePickerID").value);
    $w("#dbPeople").setFieldValue("telefono",  telefono);
    $w("#dbPeople").setFieldValue("userName", $w("#iptFirstName").value +" " + $w("#iptLastName").value);
    $w("#dbPeople").setFieldValue("status", "Medio");

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
         wixLocation.to("/consola");

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
    $w("#dbPeople").setFieldValue("direccion", $w("#direccion").value);
    $w("#dbPeople").setFieldValue("gender", $w("#iptGender").value);
    $w("#dbPeople").setFieldValue("edad", $w("#iptedad").value);
    $w("#dbPeople").setFieldValue("birthYear", $w("#datePickerID").value);
    $w("#dbPeople").setFieldValue("telefono", telefono);
    $w("#dbPeople").setFieldValue("userName", $w("#iptFirstName").value +" " + $w("#iptLastName").value);
     $w("#dbPeople").save()
    .then(() => {
        $w("#txtMessage").text = "¡Tu perfil ha sido actualizado!"; $w("#txtMessage").show();
        wixLocation.to("/consola");
    })
    .catch((err) => {
        $w("#txtMessage1").text = "¡Algo salió mal. Por favor, vuelva a intentarlo!"; $w("#txtMessage1").show();
    });

}

 


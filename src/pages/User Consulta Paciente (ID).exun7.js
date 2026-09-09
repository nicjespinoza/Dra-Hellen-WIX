import wixWindow from "wix-window";
var currentItem

$w.onReady(function () {

setInterval($w("#dynamicDataset").refresh, 1000);

updateData()

$w('#dataset2').onReady( () => {

   	$w("#repJobs").forEachItem( ($item, itemData, index) => {

		 
            	$w('#btneyes').onClick((event, $w) =>{

                  let clickedItemData = $item("#dataset2").getCurrentItem().codeunico;
                     console.log(clickedItemData);
  
 
 let lightboxdata = {

 "codeunico": $w('#txtcode').text

 

 
    }
 
     wixWindow.openLightbox('historia', lightboxdata);

    })

                
           /* 
			let minutes = Math.round((Date.now() - itemData._createdDate)/1000/60);
       	    let hours = Math.round((Date.now() - itemData._createdDate)/1000/60/60);

        
        if(hours <= 1){
            $w("#txtPostedByAndTime").text = "Creador" + " " + itemData.userName + " hace " + minutes + " minutos";

        } else if(hours <= 24){
            $w("#txtPostedByAndTime").text = "Creador" + " " + itemData.userName + " hace " + hours + " horas";

        } else {
            let options = { minute: "numeric", hour: "numeric", day: "numeric", month: "short", year: "numeric"}
            $w("#txtPostedByAndTime").text = "Creado" + " " + itemData.userName + "  " + itemData._createdDate.toLocaleDateString("en-GB" , options);

        }

	$w('#btnDislike').onClick((event, $w) =>{

                      if(wixUsers.currentUser.loggedIn){

                if(memory.getItem("emailVerified") === "Yes"){

                    $w('#btnLiked').show("fade", {"duration": 500, "delay": 0})
                     $w('#btnDislike').hide("fade", {"duration": 500, "delay": 0})

                             doLike();

                         } else {

                            let msgObj = { textValue: "Por favor verifique su dirección de correo electrónico" };
                            wixWindow.openLightbox("Popup", msgObj);

        }

    } else {

        let msgObj = { textValue: "Por favor ingresa o regístrate" };
        wixWindow.openLightbox("Popup", msgObj);

    }
        function doLike(){

        
        
        // update post like counter in real time
        let likes_calc = Number($w("#txtLikes").text) + 1;
        $w("#txtLikes").text = likes_calc.toString();

        let data = $w("#repJobs").data;
        let clickedItemData = data.find(item => item._id === event.context.itemId);

        wixData.query("dbuser")
        .eq("_id", clickedItemData._id)
        .limit(1)
        .find()
        .then((results) => {

            let item = results.items[0];
            item.likes = item.likes + 1;
             item.favorito = "S";
            wixData.update("dbuser", item)
            .then(() => {

                console.log ("update database")

            })

        });

    }

})*/

			
			
		});

	});

});
function updateData() {

    $w('#dynamicDataset').onReady(() => {
        const currentItem = $w('#dynamicDataset').getCurrentItem();

        // Oculta el botón si el correo electrónico está verificado
        if (currentItem.emailVerified === "Yes") {
            $w('#button45').hide();
        }

        // Maneja el estado del paciente
        switch (currentItem.status) {
            case "Inicio":
                $w('#statebox9').changeState("state4");
                $w('#boxconsulta').changeState("state5");
                $w('#txttexto').text = "Paciente no ha completado su registro";
                break;

            case "Medio":
                $w('#statebox9').changeState("state2");
                $w('#boxconsulta').changeState("state5");
                break;

            case "Activo":
                $w('#statebox9').changeState("state2");
                $w('#boxconsulta').changeState("state5");
                $w('#txtnotif').show();
                $w('#btnactivar').hide();
                $w('#txtactivar').hide();
                $w('#btnwhatsapp').show();
                break;

            case "Paciente":
                $w('#statebox9').changeState("state2");
                $w('#boxconsulta').changeState("state3");
                $w('#btnactivar').hide();
                $w('#txtactivar').hide();
                $w('#btnhistoria1').show();
                $w('#btnagregarconsulta').show();
                break;
        }
    });
}




export function btnwhatsapp_click(event) {
let phone = "505"+ $w('#txttelefono').text; // Your Phone Number: Country Code + Number //
let text1 = " Hola: " + " " + $w('#iptnombre').text + " " + "recuerda completar tu historia clinica y habitos alimenticios en tu perfil www.helenarya.com para iniciar el plan contratado"
let text2 = text1.replace(/\s/g, "%20");
let link = "https://wa.me/" + phone + "?text=" + text2;

$w("#btnwhatsapp").link = link;
}

export function statebox9_mouseIn(event) {
    
    $w("#dynamicDataset").refresh()
  .then( () => {
      updateData()
    console.log("Done refreshing the dataset");
  } );

}
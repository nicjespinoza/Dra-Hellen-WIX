import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';


 
let monto = wixWindow.lightbox.getContext();
 
 

$w.onReady( function () {

  let received = wixWindow.lightbox.getContext();

 
  $w('#lightBoxReceive1').text = received.pageSend1;
   $w('#lightBoxReceive2').text = received.pageSend2;
    $w('#lightBoxReceive3').text = received.pageSend3;
   

   
} );

 
export function btnactiva_click(event) {

	let clickedItemData = "Activo"
      

        wixData.query("User")
        .eq("pacienteid", $w('#lightBoxReceive2').text)
        .limit(1)
        .find()
        .then((results) => {
   
          let item = results.items[0];
          
          item.status = clickedItemData
           
     
            wixData.update("User", item)
            .then(() => {

              $w('#btnactiva').disable()
              $w('#txtnotif').show()
              $w('#txtnotif').text = "Paciente" + " " + $w('#lightBoxReceive2').text + " " + "se ha activado con exito puede cerrar pestaña"
              console.log(item);

        
              
            })
.catch((err) => {
    console.log(err);
 });
        });

}
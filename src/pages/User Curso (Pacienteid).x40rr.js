import wixData from 'wix-data';

$w.onReady(function () {


});

export function btncurso_click(event) {
	
let clickedItemData = "Yes"
let nivel = "caja1"   
let porce = "0%"   

        wixData.query("User")
        .eq("pacienteid", $w('#lightBoxReceive2').text)
        .limit(1)
        .find()
        .then((results) => {
   
          let item = results.items[0];
          
          item.emailVerified = clickedItemData
          item.nivelcurso = nivel
          item.porcentajecurso = porce
     
            wixData.update("User", item)
            .then(() => {
              $w('#btncurso').disable()
              $w('#txtnotif').show()
              $w('#txtnotif').text = "Paciente" + " " + $w('#lightBoxReceive2').text + " " + "se ha activado el curso con exito puede cerrar pestaña"
              console.log(item);

        
              
            })
.catch((err) => {
    console.log(err);
 });
        });

}
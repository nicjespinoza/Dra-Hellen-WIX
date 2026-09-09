import wixWindow from "wix-window";
import wixUsers from "wix-users"; ""
import wixData from "wix-data";
import { memory } from "wix-storage";
import wixLocation from 'wix-location';
import { authentication } from 'wix-members';
 

 


let profilePictureURL;
let UsersName;
let currentItem;

$w.onReady(function () {

    usecomplete();
   
      
   // userDefinedFields1()

})



function usecomplete() {
    if (wixUsers.currentUser.loggedIn) {
        $w("#dbPeople").onReady(() => {
            let currentItem = $w("#dbPeople").getCurrentItem();
            
            $w('#vidunico').text = currentItem.pacienteid;
            $w('#txtcertificado').text = currentItem.userName;
            $w('#txtdia').text = currentItem.dia;
            $w('#txtmes').text = currentItem.mes;
            $w('#txtano').text = currentItem.ao;
            $w('#vusername').text = `Hola ${currentItem.userName}, has completado ${currentItem.porcentajecurso} del curso.`;
            
           // updateProgressBar(currentItem.nivelcurso);
            
            $w("#dbPeople").refresh().then(() => {
                console.log("Done refreshing the dataset");
            });
        });
    }
}


$w('#bx1').onClick((event) => {
        $w('#statebox8').changeState("State1")
})

$w('#box11').onClick((event) => {
            $w('#statebox8').changeState("State2")
})
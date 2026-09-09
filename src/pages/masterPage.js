import wixWindow from "wix-window";
import wixUsers from "wix-users";
import wixData from "wix-data";
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members';


/*$w.onReady(function () {
	
    

    loginCheck();
  loginCheck1()
    
})


function loginCheck(){

    if(wixUsers.currentUser.loggedIn){
                
        let user = wixUsers.currentUser;

        wixData.query("User")
        .eq("_id", user.id)
        .limit(1)
        .find()
        .then((results) => {    
            
            $w("#btnlogin2").show()
            $w("#btnlogin1").hide()
            
           

        });

    } else {

        $w("#btnlogin1").show()
        
        $w("#btnlogin2").hide()
        


        setTimeout(checkingLoop, 3000);
        
    }

}

function checkingLoop(){

    if(wixUsers.currentUser.loggedIn){
        loginCheck();
    } else {
        setTimeout(checkingLoop, 3000);
    }

}


export function nullDAC143DAC150_click(event) {
	   let dataObj = {

        "pageSend90": "politica",
        
       
    }

    wixWindow.openLightbox("login", dataObj);

}

function loginCheck1(){

    if(wixUsers.currentUser.loggedIn){

currentMember.getMember()
  .then((member) => {
    const id = member._id;
    const fullName = `${member.contactDetails.emails}`;
 

	wixData.query("autorizado")
        .eq("correo", fullName)
        .limit(1)
        .find()
        .then((results) => {  

            
			$w('#btnconsola11').show()
            $w("#btnlogin1").hide()
            $w("#btnlogin2").hide()
        

		})

    return member;



  })


  .catch((error) => {
    console.error(error);
  });


	}

}*/



$w.onReady(async () => {

    const isLoggedIn = authentication.loggedIn();
    const isLoggedIn1 = authentication.loggedIn();

    if (isLoggedIn) {
     const loggedInMember = await currentMember.getMember()
     console.log('Member is logged');
     const memberId = loggedInMember._id;
     const contactId = loggedInMember.contactId;

     wixData.query("User")
         .eq("_id", memberId)
         .limit(1)
         .find()
         .then((results) => {

             console.log('Member active');

             if (results.items.length > 0) {

                 $w('#btnconsola11').hide()
                 $w("#btnlogin1").hide()
                 $w("#btnlogin2").show()

             } else {

                 $w('#btnconsola11').hide()
                 $w("#btnlogin1").show()
                 $w("#btnlogin2").hide()

             }

         })

 }  if (isLoggedIn1) {
     const loggedInMember1 = await currentMember.getMember()
     console.log('Dra is logged');
     const fullName = `${loggedInMember1.contactDetails.emails}`;

     wixData.query("autorizado")
         .eq("correo", fullName)
         .limit(1)
         .find()
         .then((results) => {

             console.log('Dra active dashboard');

             if (results.items.length > 0) {

                 $w('#btnconsola11').show()
                 $w("#btnlogin1").hide()
                 $w("#btnlogin2").hide()

             } else {

                 $w('#btnconsola11').show()
                 $w("#btnlogin1").hide()
                 $w("#btnlogin2").hide()
             }

         })

 } else {

     console.error("Member not login");
 }

 })

		
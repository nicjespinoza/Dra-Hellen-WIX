import wixUsers from "wix-users";
import wixWindow from "wix-window";
import wixLocation from 'wix-location';
import wixData from 'wix-data';
import {fetch} from 'wix-fetch'; 
import { authentication } from 'wix-members';
 
let debounceTimer;


$w.onReady( () => {
     setInterval(() => {

        let numberOfCuisines = $w("#dbPeople").getTotalCount();

        $w("#text591").text = `${numberOfCuisines} usuarios${numberOfCuisines === 1 ? '' : ''}`

    }, 200);

}); 


 

 
// CLEAR SEARCH CODE
$w.onReady(() => {
 
    $w('#text418').onClick(() => {
 $w('#dbPeople').refresh()
    $w('#dropdown1').value = undefined;
    $w('#tagss').value = undefined;
    $w('#radioGroup1').value = undefined;
    $w('#text418').hide();

 
    });
});

export function btncerrar_click(event) {
	authentication.logout();
    wixLocation.to("/");
}
 


function search() {

    wixData.query("User")
        .contains("userName", String($w('#tagss').value))
        .contains("pacienteid", String($w('#tagss').value))
        .find()
        .then(results => {
            $w('#repeater1').data = results.items;
        });

        $w('#text418').show();
        
        

}

export function dropdown1_change(event) {
	 $w('#text418').show();
}
 
export function radioGroup1_change(event) {
$w('#text418').show();
}
 
export function tagss_input(event) {
	$w('#text418').show();
    search();

}
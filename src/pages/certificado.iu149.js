import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';


 

$w.onReady(function () {
 
	
let monto = wixWindow.lightbox.getContext();

$w('#txtname').text = monto.pageSend1
$w('#txtdia').text = monto.Dia
$w('#txtmes').text = monto.Mes
$w('#txtano').text = monto.Ano

});
 
 

export function button45_click(event) {
	  $w('#html1').postMessage("print"); 
    $w('#button45').hide()

	  



}


 
export function lightbox1_mouseIn(event) {
	$w('#button45').show()
}
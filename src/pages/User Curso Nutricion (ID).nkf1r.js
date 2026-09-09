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
            
            updateProgressBar(currentItem.nivelcurso);
            
            $w("#dbPeople").refresh().then(() => {
                console.log("Done refreshing the dataset");
            });
        });
    }
}

function updateProgressBar(nivelCurso) {
    const progressLevels = {
        "caja1": { state: "State1", value: 1, boxesToShow: [], boxesToHide: [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 15] },
        "caja2": { state: "State2", value: 10, boxesToShow: [1, 2], boxesToHide: [3, 4, 5, 6, 7, 8, 9, 10, 15] },
        "caja3": { state: "State3", value: 20, boxesToShow: [1, 2, 3], boxesToHide: [4, 5, 6, 7, 8, 9, 10, 15] },
        "caja4": { state: "State4", value: 30, boxesToShow: [1, 2, 3, 4], boxesToHide: [5, 6, 7, 8, 9, 10, 15] },
        "caja5": { state: "State5", value: 40, boxesToShow: [1, 2, 3, 4, 5], boxesToHide: [6, 7, 8, 9, 10, 15] },
        "caja6": { state: "State6", value: 50, boxesToShow: [1, 2, 3, 4, 5, 6], boxesToHide: [7, 8, 9, 10, 15] },
        "caja7": { state: "State7", value: 60, boxesToShow: [1, 2, 3, 4, 5, 6, 7], boxesToHide: [8, 9, 10, 15] },
        "caja8": { state: "State8", value: 70, boxesToShow: [1, 2, 3, 4, 5, 6, 7, 8], boxesToHide: [9, 10, 15] },
        "caja9": { state: "State9", value: 80, boxesToShow: [1, 2, 3, 4, 5, 6, 7, 8, 9], boxesToHide: [10, 15] },
        "caja10": { state: "State10", value: 90, boxesToShow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], boxesToHide: [15] },
        "caja15": { state: "State15", value: 100, boxesToShow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15], boxesToHide: [] }
    };

    const progress = progressLevels[nivelCurso];

    if (progress) {
        $w('#statebox8').changeState(progress.state);
        $w('#progressBar1').value = progress.value;

        progress.boxesToShow.forEach(box => {
            $w(`#bx${box}`).show();
            $w(`#bxbloq${box}`).hide();
        });

        progress.boxesToHide.forEach(box => {
            $w(`#bx${box}`).hide();
            $w(`#bxbloq${box}`).show();
        });

        // Collapsing and showing groups based on level
        for (let i = 1; i <= progress.boxesToShow.length; i++) {
            $w(`#grupo${i}`).collapse();
            $w(`#txt${i}`).show();
        }
    }
}


function actualizarBaseDatos(nivel, porce, state) {
    wixData.query("User")
        .eq("pacienteid", $w("#vidunico").text)
        .limit(1)
        .find()
        .then((results) => {
            let item = results.items[0];
            item.nivelcurso = nivel;
            item.porcentajecurso = porce;
            
            wixData.update("User", item)
                .then(() => {
                    $w(`#statebox8`).changeState(state);
                    $w('#anchor1').scrollTo();
                    usecomplete();
                    $w("#dbPeople").refresh()
                        .then(() => {
                            usecomplete();
                            console.log("Done refreshing the dataset");
                        });
                    console.log(item);
                })
                .catch((err) => {
                    console.log(err);
                });
        });

}




export function bx1_click(event) {
	$w('#statebox8').changeState("State1")
	$w('#anchor1').scrollTo()
}

export function bx2_click(event) {
	$w('#statebox8').changeState("State2")
	$w('#anchor1').scrollTo()
}

export function bx3_click(event) {
	$w('#statebox8').changeState("State3")
	$w('#anchor1').scrollTo()
}

export function bx4_click(event) {
	$w('#statebox8').changeState("State4")
	$w('#anchor1').scrollTo()
}

export function bx5_click(event) {
	$w('#statebox8').changeState("State5")
	$w('#anchor1').scrollTo()
}


export function bx6_click(event) {
	$w('#statebox8').changeState("State6")
	$w('#anchor1').scrollTo()
}

export function bx7_click(event) {
	$w('#statebox8').changeState("State7")
	$w('#anchor1').scrollTo()
}

export function bx8_click(event) {
	$w('#statebox8').changeState("State8")
	$w('#anchor1').scrollTo()
}

export function bx9_click(event) {
	$w('#statebox8').changeState("State9")
	$w('#anchor1').scrollTo() 
}

export function btn1_click(event) {
	  $w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 10;
    actualizarBaseDatos("caja2", "10 %", "State2");


}
	
export function checkbox1_click(event) {
	$w('#btn1').enable()
}


export function checkbox2_click(event) {
	$w('#btn2').enable()
}

export function btn2_click(event) {
	$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 25;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    actualizarBaseDatos("caja3", "25 %", "State3");

}

export function checkbox3_click(event) {
	$w('#btn3').enable()
}


export function btn3_click(event) {
$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 40;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    actualizarBaseDatos("caja4", "40 %", "State4");
}

export function checkbox4_click(event) {
	$w('#btn4').enable() 
}
 
export function btn4_click(event) {
$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 50;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    actualizarBaseDatos("caja5", "50 %", "State5");
}

export function checkbox5_click(event) {
	$w('#btn5').enable() 
}

export function btn5_click(event) {
	
	$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 60;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    actualizarBaseDatos("caja6", "60 %", "State6");
}


export function checkbox6_click(event) {
	$w('#btn6').enable() 
}

export function btn6_click(event) {

	$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 80;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    $w('#bxbloq6').hide();
    $w('#bx7').show();
    actualizarBaseDatos("caja7", "80 %", "State7");
}
 
export function btn7_click(event) {
	  $w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 90;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    $w('#bxbloq6').hide();
    $w('#bx7').show();
    $w('#bxbloq7').hide();
    $w('#bx8').show();
    actualizarBaseDatos("caja8", "90 %", "State8");
}

export function checkbox7_click(event) {
	$w('#btn7').enable()
}

export function checkbox8_click(event) {
	$w('#btn8').enable() 
}

export function btn8_click(event) {
$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 90;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    $w('#bxbloq6').hide();
    $w('#bx7').show();
    $w('#bxbloq7').hide();
    $w('#bx8').show();
    $w('#bxbloq8').hide();
    $w('#bx9').show();
    actualizarBaseDatos("caja9", "90 %", "State9");
}

export function image22_click(event) {
	 let dataObj = {

        "pageSend1": $w('#txtcertificado').text,
		"Dia" : $w('#txtdia').text,
        "Mes" : $w('#txtmes').text,   
        "Ano" : $w('#txtano').text  
	   
        
    }

    wixWindow.openLightbox("certificado", dataObj);

} 



export function checkbox9_click(event) {
	$w('#btn9').enable()  
}


export function btn9_click(event) {
$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 90;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    $w('#bxbloq6').hide();
    $w('#bx7').show();
    $w('#bxbloq7').hide();
    $w('#bx8').show();
    $w('#bxbloq8').hide();
    $w('#bx9').show();
    $w('#bx10').show();
    actualizarBaseDatos("caja10", "90 %", "State9");
}

export function btn10_click(event) {
		$w('#bx2').show();
    $w('#bxbloq1').hide();
    $w('#bx1').show();
    $w('#progressBar1').value = 100;
    $w('#bxbloq2').hide();
    $w('#bx3').show();
    $w('#bxbloq3').hide();
    $w('#bx4').show();
    $w('#bxbloq4').hide();
    $w('#bx5').show();
    $w('#bxbloq5').hide();
    $w('#bx6').show();
    $w('#bxbloq6').hide();
    $w('#bx7').show();
    $w('#bxbloq7').hide();
    $w('#bx8').show();
    $w('#bxbloq8').hide();
    $w('#bx9').show();
    $w('#bxbloq9').hide();
    $w('#bx10').show();
    $w('#bx15').show();
    $w('#bxbloq15').hide();
    
    let nivel = "caja15";   
    let porce = "100 %";   
    let today = new Date();
    let month = today.toLocaleString('default', { month: 'long' });
    
    wixData.query("User")
        .eq("pacienteid", $w("#vidunico").text)
        .limit(1)
        .find()
        .then((results) => {
            let item = results.items[0];
            let dd = today.getDate();
            let mm = today.getMonth();
            let yyyy = today.getFullYear();
            
            item.nivelcurso = nivel;
            item.porcentajecurso = porce;
            item.dia = dd;
            item.mes = month;
            item.ao = yyyy;
            item.date = today;
            item.fechafinal = `${dd}/${mm + 1}/${yyyy}`;
            
            wixData.update("User", item)
                .then(() => {
                    $w('#statebox8').changeState("State15");
                    $w('#anchor1').scrollTo();
                    usecomplete();
                    $w("#dbPeople").refresh()
                        .then(() => {
                            usecomplete();
                            console.log("Done refreshing the dataset");
                        });
                    console.log(item);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
}

export function bx10_click(event) {
	$w('#statebox8').changeState("State10")
	$w('#anchor1').scrollTo() 
}

export function checkbox10_click(event) {
	$w('#btn10').enable()
}
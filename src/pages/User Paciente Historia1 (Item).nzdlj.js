import wixWindow from "wix-window";
import { authentication, currentMember } from 'wix-members';
import wixUsers from "wix-users";
import { memory } from "wix-storage";
import wixData from "wix-data";
import wixLocation from 'wix-location';

let profilePictureURL;
let imagen1;
let imagen2;
let imagen3;
let imagen4;
let imagen5;
let imagen6;
let imagen7;
let imagen8;
let currentUsersName;
let workImages = [];
let userCountry;
let departamento;
let tagsArrayGlobal = [];
let linkURL;
let memberId

$w.onReady(function () {

    profilePictureURL //= $w("#imageprincipal").src;
    imagen1 = //$w("#image01").src;
        imagen2 = //$w("#image02").src;
        imagen3 = //$w("#image03").src;
        imagen4 = //$w("#image04").src;

        $w('#txtidcliente').text = "Cargando informacion"
    $w("#userName").text = "Cargando informacion"
member()
    botoncontinuar();
    validarInput();
     
    subidaimagenes()

})
// Validar usuario 

async function member() {
    const isLoggedIn = authentication.loggedIn();

    if (!isLoggedIn) return;

    try {
        const loggedInMember = await currentMember.getMember();
        const memberId = loggedInMember._id;
        console.log(memberId);

        const results = await wixData.query("User").eq("_id", memberId).limit(1).find();
        if (results.items.length === 0) return console.log("Member not Active");

        const user = results.items[0];
        const sexo = user.gender;

        if (sexo === "Masculino") {
            disableFields();
        } else if (sexo === "Femenino") {
            enableFields();
        }

        $w('#nextButton1').show();

        $w("#dataset1").onReady(() => {
            let currentItem = $w("#dataset1").getCurrentItem();

            if (!currentItem || !currentItem.status) {
                $w("#jobMultiStateBox").changeState("state1");
                $w('#btninicio').show();
                $w('#text590').text = "Puedes iniciar tu historia clínica";
                return;
            }

            $w('#vidunico').text = currentItem.status;
            switch (currentItem.status) {
                case "historia2":
                    showAndUpdateProgress(16, "historia2", "#bt1");
                    break;
                case "historia3":
                    showAndUpdateProgress(33, "historia3", "#bt2");
                    break;
                case "historia4":
                    showAndUpdateProgress(49, "historia4", "#bt3");
                    break;
                case "historia5":
                    showAndUpdateProgress(66, "historia5", "#bt4");
                    break;
                case "historia6":
                    showAndUpdateProgress(90, "historia6", "#bt5");
                    break;
                case "historia7":
                    showAndUpdateProgress(100, "historia7", "#bt6");
                    break;
            }
            console.log(currentItem);
        });
    } catch (error) {
        console.error(error);
    }
}

function disableFields() {
    $w('#iptedadregla').disable();
    $w('#iptfechaultimaregla').disable();
    $w('#iptplanificaregla').disable();
}

function enableFields() {
    $w('#iptedadregla').enable();
    $w('#iptfechaultimaregla').enable();
    $w('#iptplanificaregla').enable();
}

function showAndUpdateProgress(value, state, buttonId) {
    $w("#jobMultiStateBox").changeState(state);
    $w("#barraprogreso").value = value;
    $w(buttonId).show();
}


// botones de continuar a imagenes
function botoncontinuar() {

     $w("#btninicio").onClick(() => $w('#jobMultiStateBox').changeState("historia1"));
    $w("#nextButton1").onClick(guardar1);
    $w("#nextButton2").onClick(guardar2);
    $w("#nextButton3").onClick(guardar3);
    $w("#nextButton4").onClick(guardar4);
    $w("#nextButton5").onClick(guardar5);
}

function validarCampos(campos, boton, mensaje) {
    if (campos.every(field => field.value)) {
        boton.enable();
        mensaje.hide();
    } else {
        boton.disable();
        mensaje.show();
    }
}
function validarInput() {
    $w("#ipt1, #ipt3, #ipt4, #ipt5, #ipt6, #ipt7, #ipt8, #ipt9, #ipt10, #ipt11, #iptfrijoles, #ipt12, #ipt13, #ipt14, #ipt15, #ipt16").onChange(function () {
        validarCampos(
            [
                $w("#ipt1"), $w("#ipt3"), $w("#ipt4"), $w("#ipt5"), $w("#ipt6"),
                $w("#ipt7"), $w("#ipt8"), $w("#ipt9"), $w("#ipt10"), $w("#ipt11"),
                $w("#iptfrijoles"), $w("#ipt12"), $w("#ipt13"), $w("#ipt14"),
                $w("#ipt15"), $w("#ipt16")
            ],
            $w("#nextButton1"),
            $w("#txtmens1")
        );
    });

    $w("#txthora1, #txtalimento1, #txtcantidad1, #txtmerienda1, #txtmeriendaalime1, #txtmeriendacantida1, #txthora2, #txtalimento2, #txtcantidad2, #txtmerienda2, #txtmeriendaalime2, #txtmeriendacantida2, #txthora3, #txtalimento3, #txtcantidad3, #txtmerienda3, #txtmeriendaalime3, #txtmeriendacantida3").onChange(function () {
        validarCampos(
            [
                $w("#txthora1"), $w("#txtalimento1"), $w("#txtcantidad1"), $w("#txtmerienda1"),
                $w("#txtmeriendaalime1"), $w("#txtmeriendacantida1"), $w("#txthora2"), $w("#txtalimento2"),
                $w("#txtcantidad2"), $w("#txtmerienda2"), $w("#txtmeriendaalime2"), $w("#txtmeriendacantida2"),
                $w("#txthora3"), $w("#txtalimento3"), $w("#txtcantidad3"), $w("#txtmerienda3"), $w("#txtmeriendaalime3"),
                $w("#txtmeriendacantida3")
            ],
            $w("#nextButton2"),
            $w("#txtmens2")
        );
    });

    $w("#ipt17, #ipt18, #ipt19, #ipt20, #ipt21, #ipt22, #ipt23, #ipt24, #ipt25, #ipt26, #ipt27, #ipt28, #ipt29, #ipt30, #ipt31, #ipt32, #ipt33, #ipt34").onChange(function () {
        validarCampos(
            [
                $w("#ipt17"), $w("#ipt18"), $w("#ipt19"), $w("#ipt20"), $w("#ipt21"), $w("#ipt22"), $w("#ipt23"),
                $w("#ipt24"), $w("#ipt26"), $w("#ipt27"), $w("#ipt28"), $w("#ipt29"), $w("#ipt30"), $w("#ipt31"),
                $w("#ipt32"), $w("#ipt33"), $w("#ipt34")
            ],
            $w("#nextButton3"),
            $w("#txtmens3")
        );
    });

    $w("#ipthabit1, #ipthabit2, #ipthabit3, #ipthabit4, #ipthabit5, #ipthabit6, #ipthabit7, #ipthabit8, #ipthabit9, #ipthabit10, #ipthabit11, #ipthabit12, #ipthabit13, #ipthabit14, #ipthabit15, #ipthabit16, #ipthabit17, #ipthabit18, #ipthabit19, #ipthabit20, #ipthabit21, #ipthabit22, #ipthabit23, #ipthabit24, #ipthabit25").onChange(function () {
        validarCampos(
            [
                $w("#ipthabit1"), $w("#ipthabit2"), $w("#ipthabit3"), $w("#ipthabit4"), $w("#ipthabit5"), $w("#ipthabit6"),
                $w("#ipthabit7"), $w("#ipthabit8"), $w("#ipthabit9"), $w("#ipthabit10"), $w("#ipthabit11"), $w("#ipthabit12"),
                $w("#ipthabit13"), $w("#ipthabit14"), $w("#ipthabit15"), $w("#ipthabit16"), $w("#ipthabit17"), $w("#ipthabit18"),
                $w("#ipthabit19"), $w("#ipthabit20"), $w("#ipthabit21"), $w("#ipthabit22"), $w("#ipthabit23"), $w("#ipthabit24"),
                $w("#ipthabit25")
            ],
            $w("#nextButton4"),
            $w("#txtmens4")
        );
    });

    $w("#iptfre1, #iptfre2, #iptfre3, #iptfre4, #iptfre5, #iptfre6, #iptfre7, #iptfre8, #iptfre9, #iptfre10, #iptfre11, #iptfre12, #iptfre13, #iptfre14, #iptfre15, #iptfre16, #iptfre17, #iptfre18, #iptfre19, #iptfre20, #iptfre21, #iptfre22, #iptfre23, #iptfre24, #iptfre25, #iptfre26").onChange(function () {
        validarCampos(
            [
                $w("#iptfre1"), $w("#iptfre2"), $w("#iptfre3"), $w("#iptfre4"), $w("#iptfre5"), $w("#iptfre6"),
                $w("#iptfre7"), $w("#iptfre8"), $w("#iptfre9"), $w("#iptfre10"), $w("#iptfre11"), $w("#iptfre12"),
                $w("#iptfre13"), $w("#iptfre14"), $w("#iptfre15"), $w("#iptfre16"), $w("#iptfre17"), $w("#iptfre18"),
                $w("#iptfre19"), $w("#iptfre20"), $w("#iptfre21"), $w("#iptfre22"), $w("#iptfre23"), $w("#iptfre24"),
                $w("#iptfre25"), $w("#iptfre26")
            ],
            $w("#nextButton4"),
            $w("#txtmens4")
        );
    });

    $w("#ipthabit26, #ipthabit27, #ipthabit28, #iptfre26, #iptfre27, #iptfre28").onChange(function () {
        validarCampos(
            [
                $w("#ipthabit26"), $w("#ipthabit27"), $w("#ipthabit28"),
                $w("#iptfre26"), $w("#iptfre27"), $w("#iptfre28")
            ],
            $w("#nextButton4"),
            $w("#txtmens4")
        );
    });

    $w("#checkboxGroup1, #checkboxGroup2, #checkboxGroup3, #checkboxGroup4, #checkboxGroup5, #checkboxGroup6").onChange(function () {
        validarCampos(
            [
                $w("#checkboxGroup1"), $w("#checkboxGroup2"), $w("#checkboxGroup3"),
                $w("#checkboxGroup4"), $w("#checkboxGroup5"), 
            ],
            $w("#nextButton5"),
            $w("#txtmens5")
        );
    });

    $w("#ipt35, #ipt36, #ipt37, #ipt38, #ipt39, #ipt40, #ipt42, #ipt43").onChange(function () {
        validarCampos(
            [
                $w("#ipt35"), $w("#ipt36"), $w("#ipt37"), $w("#ipt38"), $w("#ipt39"),
                $w("#ipt40"),  $w("#ipt42"), 
            ],
            $w("#btnguardar"),
            $w("#txtmens6")
        );
    });

    $w("#iptimagenprincipal, #iptimagen1, #iptimagen2").onChange(function () {
        validarCampos(
            [
                $w("#iptimagenprincipal"), $w("#iptimagen1"), $w("#iptimagen2")
            ],
            $w("#btnguardar"),
            $w("#txtmens6")
        );
    });
}


export function btnguardar_click(event) {

    if ($w("#checkbox1").checked === false) {

        $w("#txtmens6").text = "Favor confirme que la informacion es real para guardar";
        $w('#txtmens6').show()

    } else {

        $w("#txtmens6").text = "Un momento tu información se está procesando...";
        $w("#btnguardar").disable();
        guardar6()

    }

}

 
function subidaimagenes() {

    $w('#iptimagenprincipal').onChange((event) => {
        if ($w("#iptimagenprincipal").value.length > 0) {
            $w("#textnotiimagen1").text = "Subiendo imagen:>>>" + " " + $w("#iptimagenprincipal").value[0].name;

            $w("#iptimagenprincipal").uploadFiles()
                .then((uploadedFiles) => {
                    profilePictureURL = uploadedFiles[0].fileUrl;
                    $w("#textnotiimagen1").text = "Sube otra imagen para continuar";
                    $w("#profilePictureURL").src = profilePictureURL
                    $w('#profilePictureURL').expand()
                    $w("#btnguardar").enable();
                })
                .catch((uploadError) => {
                    $w("#textnotiimagen1").text = "Error de carga de archivo";
                    $w('#profilePictureURL').collapse()
                    console.log("Error de carga de archivo " + uploadError.errorCode);
                    console.log(uploadError.errorDescription);
                });
        } else {
            $w("#textnotiimagen1").text = "Elija un archivo para cargar.";
            $w('#profilePictureURL').collapse()
            
            // $w('#iptimagen1').hide()
        }
    })

    $w('#iptimagen1').onChange((event) => {

        if ($w("#iptimagen1").value.length > 0) {
            $w("#textnotiimagen1").text = "Subiendo imagen:>>>" + $w("#iptimagen1").value[0].name;

            $w("#iptimagen1").uploadFiles()
                .then((uploadedFiles) => {
                    imagen1 = uploadedFiles[0].fileUrl;
                    $w("#textnotiimagen1").text = "Sube otra imagen para continuar";
                    $w("#image1").src = imagen1
                    $w('#image1').expand()
                    $w("#btnguardar").enable();
                })
                .catch((uploadError) => {
                    $w("#textnotiimagen1").text = "Error de carga de archivo";

                    $w('#image1').collapse()
                    console.log("File upload error: " + uploadError.errorCode);
                    console.log(uploadError.errorDescription);
                });
        } else {
            $w("#textnotiimagen1").text = "Elija un archivo para cargar.";
            $w('#image1').collapse()
            //$w('#iptimagen2').hide()
        }

    })

    $w('#iptimagen2').onChange((event) => {

        if ($w("#iptimagen2").value.length > 0) {
            $w("#textnotiimagen1").text = "Subiendo imagen:>>>" + " " + $w("#iptimagen2").value[0].name;

            $w("#iptimagen2").uploadFiles()
                .then((uploadedFiles) => {
                    imagen2 = uploadedFiles[0].fileUrl;
                    $w("#textnotiimagen1").text = "Imagenes completada";
                    $w("#image2").src = imagen2
                    $w('#image2').expand()
                    $w("#btnguardar").enable();
                })
                .catch((uploadError) => {
                    $w("#textnotiimagen1").text = "Error de carga de archivo";
                    $w('#image2').collapse()
                    console.log("File upload error: " + uploadError.errorCode);
                    console.log(uploadError.errorDescription);
                });
        } else {
            $w("#textnotiimagen1").text = "Elija un archivo para cargar.";
            $w('#image2').collapse()
            // $w('#iptimagen3').hide()

        }

    })

}

function guardar1() {

    let user = wixUsers.currentUser;

    $w("#dbCreatePost").setFieldValue("idpaciente", user.id);
    $w("#dbCreatePost").setFieldValue("status", "historia2");
    $w("#dbCreatePost").setFieldValue("title", $w("#txtidcliente").text);
    $w("#dbCreatePost").setFieldValue("cualessuobjetivo", $w("#ipt1").value);
    $w("#dbCreatePost").setFieldValue("razonporLasCualesHaSubidoDePeso", $w("#ipt3").value);
    $w("#dbCreatePost").setFieldValue("cambiarMalosHbitosPorBuenosHbitos", $w("#ipt4").value);
    $w("#dbCreatePost").setFieldValue("alergiaAAlgnTipoDeAlimentos", $w("#ipt5").value);
    $w("#dbCreatePost").setFieldValue("alimentosFavoritos", $w("#ipt6").value);
    $w("#dbCreatePost").setFieldValue("alimentosOTiposDeComidaNoLeGustan", $w("#ipt7").value);
    $w("#dbCreatePost").setFieldValue("alimentosLeDanIntolerancia", $w("#ipt8").value);
    $w("#dbCreatePost").setFieldValue("consumeYogurtLecheAgria", $w("#ipt9").value);
    $w("#dbCreatePost").setFieldValue("consumeLecheTodosLosDas", $w("#ipt10").value);
    $w("#dbCreatePost").setFieldValue("enQuMomentoDelDaLosConsumeFrijoles", $w("#iptfrijoles").value);
    $w("#dbCreatePost").setFieldValue("cadaCuntoConsumeFrijoles", $w("#ipt11").value);
    $w("#dbCreatePost").setFieldValue("cuntosLitrosBebeDeAguaPorDa", $w("#ipt12").value);
    $w("#dbCreatePost").setFieldValue("cuntasVecesAlDaSueleComer", $w("#ipt13").value);
    $w("#dbCreatePost").setFieldValue("enSuLugarDeTrabajoPuedeHacerMeriendas", $w("#ipt14").value);
    $w("#dbCreatePost").setFieldValue("visitaAlgnRestauranteOBuffet", $w("#ipt15").value);
    $w("#dbCreatePost").setFieldValue("haHechoDietasAnteriormente", $w("#ipt16").value);

    $w("#dbCreatePost").save()
        .then((newPost) => {

            $w("#jobMultiStateBox").changeState("historia2");
            $w("#barraprogreso").value = 16;
            $w("#anchor1").scrollTo();
            $w("#bt1").show();
        })

        .catch((err) => {

            $w('#txtmens1').text = "Ha ocurrido una error, verifica los campos he intenta de nuevo"
            //let msgObj = { textValue: "An error occured: " + err };
            //wixWindow.openLightbox("Popup", msgObj);

        });

}

function guardar2() {
    let user = $w('#txtidcliente').text

    wixData.query("historia")
        .eq("title", user)
        .limit(1)
        .find()
        .then((results) => {

            let item = results.items[0];

            if (item) {

                item.horadesayuno = $w("#txthora1").value
                item.alimentodesayuno = $w("#txtalimento1").value
                item.cantidaddesayuno = $w("#txtcantidad1").value
                item.meriendahoradesayuno = $w("#txtmerienda1").value
                item.alimentomeriendadesayuno = $w("#txtmeriendaalime1").value
                item.cantidadmeriendadesayuno = $w("#txtmeriendacantida1").value
                item.horaalmuerzo = $w("#txthora2").value
                item.alimentoalmuerzo = $w("#txtalimento2").value
                item.cantidadalmuerzo = $w("#txtcantidad2").value
                item.meriendahoraalmuerzo = $w("#txtmerienda2").value
                item.alimentomeriendaalmuerzo = $w("#txtmeriendaalime2").value
                item.cantidadmeriendaalmuerzo = $w("#txtmeriendacantida2").value
                item.horacena = $w("#txthora3").value
                item.alimentocena = $w("#txtalimento3").value
                item.cantidadcena = $w("#txtcantidad3").value
                item.meriendahoracena = $w("#txtmerienda3").value
                item.alimentomeriendcena = $w("#txtmeriendaalime3").value
                item.cantidadmeriendacena = $w("#txtmeriendacantida3").value
                item.status = "historia3"

                wixData.update("historia", item)
                    .then(() => {
                        $w("#jobMultiStateBox").changeState("historia3");
                        $w("#barraprogreso").value = 33;
                        $w("#anchor1").scrollTo();
                        $w("#bt2").show();
                    })
                    .catch((err) => {
                        console.log(err);
                        $w('#txtmens2').text = "Ha ocurrido un error, verifica los campos e intenta de nuevo";
                    });
            } else {
                console.log("No se encontró ningún elemento en la consulta 'historia'");
            }

        })

}

function guardar3() {
    let user = $w('#txtidcliente').text

    wixData.query("historia")
        .eq("title", user)
        .limit(1)
        .find()
        .then((results) => {

            let item = results.items[0];

            if (item) {

                item.haHechoDietasAnteriormente = $w("#ipt16").value
                item.enfermedadesPadecenSusPadresYHermanos = $w("#ipt17").value
                item.enfermedadesPadeceUsted = $w("#ipt18").value
                item.ltimosExmenesQueSeHizo = $w("#ipt19").value
                item.haTenidoAlgunaCirugaYPorqu = $w("#ipt20").value
                item.tomaAlgnMedicamentoDiario = $w("#ipt21").value
                item.consumeLicor = $w("#ipt22").value
                item.fuma = $w("#ipt23").value
                item.aQuPesoLeGustaraLlegar = $w("#ipt24").value
                item.cuntoPesaActualemente = $w("#ipt26").value
                item.cuntoMide = $w("#ipt27").value
                item.cuello = $w("#ipt28").value
                item.cintura = $w("#ipt29").value
                item.ombligo = $w("#ipt30").value
                item.cadera = $w("#ipt31").value
                item.realizaEjercicios = $w("#ipt32").value
                item.cuntosDiasALaSemanaRealizarEjercicio = $w("#ipt33").value
                item.utlizaSuplementos = $w("#ipt34").value
                item.defecar = $w("#iptdefecar").value
                item.edadregla = $w("#iptedadregla").value
                item.ultimaregla = $w("#iptfechaultimaregla").value
                item.planifica = $w("#iptplanificaregla").value

                item.status = "historia4"

                wixData.update("historia", item)
                    .then(() => {
                        $w("#jobMultiStateBox").changeState("historia4");
                        $w("#barraprogreso").value = 49;
                        $w("#anchor1").scrollTo();
                        $w("#bt3").show();
                    })
                    .catch((err) => {
                        console.log(err);
                        $w('#txtmens3').text = "Ha ocurrido un error, verifica los campos e intenta de nuevo";
                    });
            } else {
                console.log("No se encontró ningún elemento en la consulta 'historia'");
            }

        })

}

function guardar4() {

    let user = wixUsers.currentUser;

    $w("#dbCreatePost1").setFieldValue("idpaciente", user.id);
    $w("#dbCreatePost1").setFieldValue("title", $w("#txtidcliente").text);
    $w("#dbCreatePost1").setFieldValue("agregaCremoraAlCaf", $w("#ipthabit1").value);
    $w("#dbCreatePost1").setFieldValue("agregaSalALaComidaYaCocinada", $w("#ipthabit2").value);
    $w("#dbCreatePost1").setFieldValue("bebeLecheEntera", $w("#ipthabit3").value);
    $w("#dbCreatePost1").setFieldValue("bebeSodas", $w("#ipthabit4").value);
    $w("#dbCreatePost1").setFieldValue("consumeAlimentosIntegrales", $w("#ipthabit5").value);
    $w("#dbCreatePost1").setFieldValue("consumeAlimentosLight", $w("#ipthabit6").value);
    $w("#dbCreatePost1").setFieldValue("comeDemasiadoEnElDaYNoCena", $w("#ipthabit7").value);
    $w("#dbCreatePost1").setFieldValue("comeMientrasHaceAlgoAlMismoTiempo", $w("#ipthabit8").value);
    $w("#dbCreatePost1").setFieldValue("comeEnMenosDe10Minutos", $w("#ipthabit9").value);
    $w("#dbCreatePost1").setFieldValue("comeSiempreLoMismo", $w("#ipthabit10").value);
    $w("#dbCreatePost1").setFieldValue("comeYSeAcuestaInstantneamente", $w("#ipthabit11").value);
    $w("#dbCreatePost1").setFieldValue("consumeAzcar", $w("#ipthabit12").value);
    $w("#dbCreatePost1").setFieldValue("consumeBebidasEnergticas", $w("#ipthabit13").value);
    $w("#dbCreatePost1").setFieldValue("consumeDulcesChocolatesCajetas", $w("#ipthabit14").value);
    $w("#dbCreatePost1").setFieldValue("consumeComidaRpidaYConMuchaGrasa", $w("#ipthabit15").value);
    $w("#dbCreatePost1").setFieldValue("consumeCremanatanatilla", $w("#ipthabit16").value);
    $w("#dbCreatePost1").setFieldValue("consumePostrePosteriorAlAlmuerzoOLaCena", $w("#ipthabit23").value);
    $w("#dbCreatePost1").setFieldValue("consumeRepostera", $w("#ipthabit17").value);
    $w("#dbCreatePost1").setFieldValue("consumeSnacks", $w("#ipthabit18").value);
    $w("#dbCreatePost1").setFieldValue("consumeMuchosRefrescosAunqueSeanNaturales", $w("#ipthabit24").value);
    $w("#dbCreatePost1").setFieldValue("consumeCarnes", $w("#ipthabit25").value);
    $w("#dbCreatePost1").setFieldValue("consumeFrutas", $w("#ipthabit19").value);
    $w("#dbCreatePost1").setFieldValue("consumeVerduras", $w("#ipthabit20").value);
    $w("#dbCreatePost1").setFieldValue("haHechoDietasEnDondeSeEliminanLosCarbohidratos", $w("#ipthabit26").value);
    $w("#dbCreatePost1").setFieldValue("haHechoDietasEnDondeSeEliminanLasGrasa", $w("#ipthabit27").value);
    $w("#dbCreatePost1").setFieldValue("haHechoDietasEnDondeSeEliminanLasProtenascarnes", $w("#ipthabit28").value);
    $w("#dbCreatePost1").setFieldValue("leeLasEtiquetasNutricionales", $w("#ipthabit21").value);
    $w("#dbCreatePost1").setFieldValue("picaEntreHoras", $w("#ipthabit22").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia1", $w("#iptfre1").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia2", $w("#iptfre2").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia3", $w("#iptfre3").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia4", $w("#iptfre4").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia5", $w("#iptfre5").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia6", $w("#iptfre6").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia7", $w("#iptfre7").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia8", $w("#iptfre8").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia9", $w("#iptfre9").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia10", $w("#iptfre10").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia11", $w("#iptfre11").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia12", $w("#iptfre12").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia13", $w("#iptfre13").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia14", $w("#iptfre14").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia15", $w("#iptfre15").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia16", $w("#iptfre16").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia17", $w("#iptfre23").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia18", $w("#iptfre17").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia19", $w("#iptfre18").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia20", $w("#iptfre24").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia21", $w("#iptfre25").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia22", $w("#iptfre19").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia23", $w("#iptfre20").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia24", $w("#iptfre26").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia25", $w("#iptfre27").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia26", $w("#iptfre28").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia27", $w("#iptfre21").value);
    $w("#dbCreatePost1").setFieldValue("frecuencia28", $w("#iptfre22").value);

    $w("#dbCreatePost1").save()
        .then((newPost) => {

            $w("#jobMultiStateBox").changeState("historia5");
            $w("#barraprogreso").value = 66;
            $w("#anchor1").scrollTo();
            $w("#bt4").show();

            let nivel1 = "historia5"

            let user1 = $w('#txtidcliente').text
            wixData.query("historia")
                .eq("title", user1)
                .limit(1)
                .find()
                .then((results) => {

                    let item = results.items[0];

                    item.status = nivel1

                    wixData.update("historia", item)
                        .then(() => {
                            console.log(item);

                        })

                        .catch((err) => {
                            console.log(err);
                        });

                })

        })

        .catch((err) => {

            $w('#txtmens4').text = "Ha ocurrido una error, verifica los campos he intenta de nuevo"
            //let msgObj = { textValue: "An error occured: " + err };
            //wixWindow.openLightbox("Popup", msgObj);

        });

}

function guardar5() {
    let user = $w('#txtidcliente').text

    wixData.query("historia")
        .eq("title", user)
        .limit(1)
        .find()
        .then((results) => {

            let item = results.items[0];

            if (item) {

                item.msDe4Frutas = $w("#checkboxGroup1").value
                item.msDe4Vegetales = $w("#checkboxGroup2").value
                item.msDe4TiposDeProtenas = $w("#checkboxGroup3").value
                item.msDe4TiposDeCarbohidratos = $w("#checkboxGroup5").value
                item.msDe4TiposDeGrasas = $w("#checkboxGroup4").value

                item.status = "historia6"

                wixData.update("historia", item)
                    .then(() => {
                        $w("#jobMultiStateBox").changeState("historia6");
                        $w("#barraprogreso").value = 90;
                        $w("#anchor1").scrollTo();
                        $w("#bt5").show();
                    })
                    .catch((err) => {
                        console.log(err);
                        $w('#txtmens5').text = "Ha ocurrido un error, verifica los campos e intenta de nuevo";
                    });
            } else {
                console.log("No se encontró ningún elemento en la consulta 'historia'");
            }

        })

}

function guardar6() {
    let user = $w('#txtidcliente').text;
    wixData.query("historia")
        .eq("title", user)
        .limit(1)
        .find()
        .then((results) => {
            let item = results.items[0];
            if (item) {
                item.imagen1 = profilePictureURL;
                item.imagen2 = imagen1;
                item.imagen3 = imagen2;
                item.enBaseALasPorcionesDeLosAlimentos = $w("#ipt35").value;
                item.nivelDeExigenciaDeseaParaSuPlanDeAimentacin = $w("#ipt36").value;
                item.deseaMeriendasEnSuPlan = $w("#ipt37").value;
                item.describaAlMenos2TiposDeDesayunos = $w("#ipt38").value;
                item.describaAlMenos2TiposDeAlmuerzos = $w("#ipt39").value;
                item.describaAlMenos2TiposDeCenas = $w("#ipt40").value;
                item.estaconciente = $w("#ipt42").value;
                item.conociodra = $w("#checkboxGroup7").value;
                item.status = "historia7";
                wixData.update("historia", item)
                    .then(() => {
                        $w('#jobMultiStateBox').changeState("historia7");
                        $w("#barraprogreso").value = 100;
                        $w("#bt6").show();
                        $w("#bt5").hide();
                        $w("#anchor1").scrollTo();
                        $w('#txtmens6').text = "Su información se guardó con éxito.";
                        $w('#txtmens6').show();
                        $w('#videoPlayer1').play();
                        actualizarUsuario();
                    })
                    .catch((err) => {
                        console.error("Error al actualizar la historia:", err);
                        mostrarMensajeError("Ha ocurrido un error al guardar la información. Por favor, intenta de nuevo.");
                    });
            } else {
                console.log("No se encontró ningún usuario en la consulta 'historia'");
            }
        })
        .catch((err) => {
            console.error("Error al buscar el usuario:", err);
            mostrarMensajeError("Ha ocurrido un error al buscar el usuario. Por favor, intenta de nuevo.");
        });

    function actualizarUsuario() {
        let user = wixUsers.currentUser;
        let clickedItemData = "Paciente";
        let nivel1 = "Nivel1";

        wixData.query("User")
            .eq("_id", user.id)
            .limit(1)
            .find()
            .then((results) => {
                let item = results.items[0];
                item.status = clickedItemData;
                item.niveles = nivel1;
                wixData.update("User", item)
                    .then(() => {
                        console.log("Usuario registrado como paciente.");
                    })
                    .catch((err) => {
                        console.error("Error al actualizar el usuario:", err);
                        mostrarMensajeError("Ha ocurrido un error al actualizar el usuario. Por favor, intenta de nuevo.");
                    });
            })
            .catch((err) => {
                console.error("Error al buscar el usuario:", err);
                mostrarMensajeError("Ha ocurrido un error al buscar el usuario. Por favor, intenta de nuevo.");
            });
    }

    function mostrarMensajeError(mensaje) {
        $w('#txtmens6').text = mensaje;
        $w('#txtmens6').show();
    }
}





/*function loginCheck() {

    if (wixUsers.currentUser.loggedIn) {

        let user = wixUsers.currentUser;

        wixData.query("User")
            .eq("_id", user.id)
            .limit(1)
            .find()
            .then((results) => {

                console.log(results)

                $w('#nextButton1').show()

                $w("#dataset1").onReady(() => {

                    let currentItem = $w("#dataset1").getCurrentItem();

                    if (currentItem && currentItem.status) {
                        $w('#vidunico').text = currentItem.status;

                        if (currentItem.status === "historia2") {
                            $w("#jobMultiStateBox").changeState("historia2");
                            $w('#barraprogreso').value = 16;
                            $w("#bt1").show();
                        }

                        if (currentItem.status === "historia3") {
                            $w("#jobMultiStateBox").changeState("historia3");
                            $w('#barraprogreso').value = 33;
                            $w("#bt2").show();
                        }

                        if (currentItem.status === "historia4") {
                            $w("#jobMultiStateBox").changeState("historia4");
                            $w("#barraprogreso").value = 49;
                            $w("#anchor1").scrollTo();
                            $w("#bt3").show();
                        }

                        if (currentItem.status === "historia5") {

                            $w("#jobMultiStateBox").changeState("historia5");
                            $w("#barraprogreso").value = 66;
                            $w("#anchor1").scrollTo();
                            $w("#bt4").show();
                        }

                        if (currentItem.status === "historia6") {

                            $w("#jobMultiStateBox").changeState("historia6");
                            $w("#barraprogreso").value = 90;
                            $w("#anchor1").scrollTo();
                            $w("#bt5").show();
                        }
                        if (currentItem.status === "historia7") {

                            $w("#jobMultiStateBox").changeState("historia7");
                            $w("#barraprogreso").value = 100;
                            $w("#anchor1").scrollTo();
                            $w("#bt6").show();
                        }
                        console.log(currentItem)
                    } else {

                        $w("#jobMultiStateBox").changeState("state1");
                        $w('#btninicio').show()
                        $w('#text590').text = "Puedes iniciar tu historia clínica"

                    }
                })

            });

    } else {
        // $w("#txtName").text = "Please log in";
        // $w("#imgProfileAlert").show();

        setTimeout(checkingLoop, 3000);
        $w("#txtidcliente").text = "Cargando informacion"
        $w("#userName").text = "Cargando informacion"
    }

}*/

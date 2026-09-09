// --- APIs de Wix ---
import { authentication } from 'wix-members-frontend';
import wixData from "wix-data";
import wixLocation from 'wix-location';
import { fetch } from "wix-fetch";

// --- Variables y Estado de la Página ---
let debounceTimer;
const pageState = {
    ipInfo: {},
    userCount: 0,
    userCountPrefix: "HA-"
};

// --- Configuración Inicial de la Página ---
$w.onReady(function () {
    initializePage();
    setupEventListeners();
});

/**
 * @description Orquesta las tareas de inicialización de la página.
 */
async function initializePage() {
    try {
        await Promise.all([
            checkIfAlreadyLoggedIn(),
            fetchIpData(),
            fetchUserCount()
        ]);
    } catch (error) {
        console.error("Error durante la inicialización de la página:", error);
    }
}

/**
 * @description Configura todos los manejadores de eventos para los elementos de la página.
 */
function setupEventListeners() {
    // Botones de registro y login
    $w('#btnregistro').onClick(handleRegistration);

    // Navegación entre vistas
    $w('#button45, #button46, #what1').onClick(() => $w('#statebox8').changeState("state1"));

    // Validación en tiempo real (Inputs de Texto)
    // ✅ NUEVO: Agregamos '#direccion' a la lista de validación por escritura
    const registrationInputs = [
        '#iptfirstname', 
        '#iptlastName', 
        '#iptemailregister', 
        '#iptpasswordregister', 
        '#iptphone', 
        '#direccion' 
    ];

    registrationInputs.forEach(selector => {
        $w(selector).onInput(() => {
            $w('#txtMessage, #txtMessage4').hide();
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runLiveValidation, 800);
        });
    });

    // ✅ NUEVO: Validación para selectores que no son de texto (Fecha y Radio)
    // Usamos .onChange porque estos no tienen evento .onInput
    $w('#datePickerID').onChange(() => {
        $w('#txtMessage, #txtMessage4').hide();
        runLiveValidation();
    });

    $w('#iptGender').onChange(() => {
        $w('#txtMessage, #txtMessage4').hide();
        runLiveValidation();
    });
}

// --- Lógica Principal (Registro y Login) ---

/**
 * @description Maneja todo el flujo de registro de un nuevo usuario.
 */
async function handleRegistration() {
    $w("#btnregistro").disable();
    $w("#btnregistro").label = "Procesando...";

    try {
        // 1. Validamos el formulario (incluyendo los nuevos campos)
        const { isValid, message } = await validateRegistrationForm();
        
        if (!isValid) {
            $w("#txtMessage4").text = message;
            $w("#txtMessage4").show();
            // Reactivamos el botón si falló la validación local
            $w("#btnregistro").enable();
            $w("#btnregistro").label = "Registrarse";
            return;
        }

        // 2. Registro en Wix Members
        const email = $w('#iptemailregister').value;
        const password = $w('#iptpasswordregister').value;
        const options = {
            contactInfo: {
                firstName: $w('#iptfirstname').value,
                lastName: $w('#iptlastName').value,
                phones: [$w('#iptphone').value],
                // Nota: Wix CRM a veces requiere campos personalizados para dirección, 
                // pero guardaremos la dirección completa en la base de datos "User" abajo.
            }
        };
        
        const registrationResult = await authentication.register(email, password, options);

        // 3. Guardado en base de datos personalizada "User"
        await createUserRecordInDatabase(registrationResult.member._id);

        $w("#txtMessage").text = "¡Registro exitoso! Serás redirigido...";
        $w("#txtMessage").show();
        wixLocation.to("/dashboard");

    } catch (error) {
        console.error("Error en el registro:", error);
        $w("#txtMessage4").text = "Ocurrió un error inesperado durante el registro.";
        $w("#txtMessage4").show();
        $w("#btnregistro").enable();
        $w("#btnregistro").label = "Registrarse";
    }
}

// --- Funciones de Soporte y Utilidades ---

async function runLiveValidation() {
    const validationResult = await validateRegistrationForm();
    if (!validationResult.isValid && validationResult.message) {
        $w("#txtMessage").text = validationResult.message;
        $w("#txtMessage").show();
    }
}

/**
 * @description Valida los campos del formulario, revisando primero si el email ya existe.
 * @returns {Promise<object>} Un objeto con { isValid: boolean, message: string }
 */
async function validateRegistrationForm() {
    const email = $w("#iptemailregister").value;
    const password = $w("#iptpasswordregister").value;

    // 1. Validaciones básicas de texto
    if ($w("#iptfirstname").value.length < 2 || $w("#iptlastName").value.length < 2) {
        return { isValid: false, message: "Introduzca nombres y apellidos válidos." };
    }
    if ($w("#iptphone").value.length < 8) {
        return { isValid: false, message: "Por favor, ingrese un teléfono de 8 dígitos o mas" };
    }


    // ✅ NUEVO: Validar Fecha de Nacimiento
    if (!$w("#datePickerID").value) {
        return { isValid: false, message: "Selecciona tu fecha de nacimiento." };
    }

    // ✅ NUEVO: Validar Género
    if (!$w("#iptGender").value) {
        return { isValid: false, message: "Selecciona tu género." };
    }

     // ✅ NUEVO: Validar Dirección
    if ($w("#direccion").value.length < 5) {
        return { isValid: false, message: "Por favor, ingresa una dirección completa." };
    }
    // 2. Validar Email (Formato)
    if (!email.includes("@") || email.length < 5) {
        return { isValid: false, message: "Por favor, introduzca un correo válido." };
    }

    // 3. Validar Email (Base de Datos)
    if (email.includes("@") && email.length >= 5) {
        const results = await wixData.query("User").eq("emailAddress", email).limit(1).find();
        if (results.items.length > 0) {
            $w('#btnLoginRedirect').show();
            $w("#btnregistro").disable(); 
            return { isValid: false, message: "Este email ya está registrado, inicia sesión 👉" };
       } else {
            // SI NO EXISTE (Corrección): Ocultamos el botón
            $w('#btnLoginRedirect').hide();
        }
    }

    // 4. Validar Contraseña y Teléfono
    if (password.length < 6) {
        return { isValid: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }
    

    // Si todo es correcto:
    $w("#btnregistro").enable();
    return { isValid: true, message: "" };
}

/**
 * @description Inserta el nuevo registro de usuario en la colección "User" con TODOS los campos.
 * @param {string} memberId - El ID del miembro recién creado por Wix.
 */
async function createUserRecordInDatabase(memberId) {
    const randVar = Math.floor(Math.random() * 8999) + 1000;
    const generatedId = "HA" + randVar;
    const fechaSeleccionada = $w('#datePickerID').value;
    const edadCalculada = calcularEdad(fechaSeleccionada);

    const toInsert = {
        _id: memberId,
        emailAddress: $w('#iptemailregister').value,
        firstName: $w('#iptfirstname').value,
        lastName: $w('#iptlastName').value,
        nombreCompleto: `${$w('#iptfirstname').value} ${$w('#iptlastName').value}`,
        userName: `${$w('#iptfirstname').value} ${$w('#iptlastName').value}`,
        telefono: $w('#iptphone').value,
        
        // ✅ NUEVO: Guardando los nuevos campos
        direccion: $w('#direccion').value,
        fechaNacimiento: $w('#datePickerID').value,
        genero: $w('#iptGender').value,
        edad: edadCalculada,

        politica: true,
        countryCode: "558",
        verified: "Pending",
        status: "Medio",
        randomNumber: randVar,
        peopleId: `${pageState.userCountPrefix}${pageState.userCount}`,
        pacienteid: generatedId,
        registrarCliente: "Pendiente",
        nivel: "principio",
        country: pageState.ipInfo.country,
        emailVerified: "Pendiente",
        ipAddress: pageState.ipInfo.query,
        city: pageState.ipInfo.city,
        latitud: pageState.ipInfo.lat,
        longitud: pageState.ipInfo.lon,
        resolvedIpName: pageState.ipInfo.ipName,
        ispName: pageState.ipInfo.isp,
        profilePicture: 'https://static.wixstatic.com/media/3743a7_23d06bc673a54c6198fa211d6bb0ec4b~mv2.png'
    };
    
    return wixData.insert("User", toInsert);
}

/**
 * @description Si el usuario ya tiene sesión, lo redirige.
 */
function checkIfAlreadyLoggedIn() {
    if (authentication.loggedIn()) {
        wixLocation.to("/dashboard");
    }
}

/**
 * @description Obtiene el número total de usuarios para generar un ID.
 */
async function fetchUserCount() {
    const count = await wixData.query("User").count();
    pageState.userCount = count;
}

/**
 * @description Obtiene la información de IP del visitante.
 */
async function fetchIpData() {
    try {
        const response = await fetch('https://extreme-ip-lookup.com/json/?key=CjcqWSRfsljilRIO0u2t', { method: 'get' });
        if (response.ok) {
            pageState.ipInfo = await response.json();
            console.log(pageState.ipInfo)
        }
    } catch(error) {
        console.error("No se pudo obtener la información de la IP:", error);
    }
}

function calcularEdad(fecha) {
    if (!fecha) return null; // Si no hay fecha, no devuelve nada
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
    }
    return edad;
}
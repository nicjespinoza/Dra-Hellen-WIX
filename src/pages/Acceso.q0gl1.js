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
    $w('#btnlogin').onClick(handleLogin);

    // Navegación entre vistas
    $w('#btnsignup').onClick(() => $w('#registro').changeState("stateregistro"));
    $w('#btnLoginRedirect').onClick(() => $w('#registro').changeState("statelogin"));

    // Validación en tiempo real
    const registrationInputs = ['#iptfirstname', '#iptlastName', '#iptemailregister', '#iptpasswordregister', '#iptphone'];
    registrationInputs.forEach(selector => {
        $w(selector).onInput(() => {
            $w('#txtMessage, #txtMessage4').hide();
             if (debounceTimer) clearTimeout(debounceTimer);
            
            // ✅ CAMBIO AQUÍ: Llamamos a la nueva función en lugar de la original.
            debounceTimer = setTimeout(runLiveValidation, 800);
        });
    });
    
    $w('#iptemaillogin, #iptpasslogin').onInput(() => $w('#txtMessage2').hide());
    $w('#iptemaillogin').onChange(validateLoginEmail);
    $w('#forgotPassword').onClick(handleForgotPassword);
}

// --- Lógica Principal (Registro y Login) ---

/**
 * @description Maneja todo el flujo de registro de un nuevo usuario.
 */
async function handleRegistration() {
    $w("#btnregistro").disable();
    $w("#btnregistro").label = "Procesando...";

    try {
        const { isValid, message } = await validateRegistrationForm();
        if (!isValid) {
            $w("#txtMessage4").text = message;
            $w("#txtMessage4").show();
            return;
        }

        if (!$w("#checkbox1").checked) {
            $w("#txtMessage4").text = "Por favor, acepta las políticas de privacidad.";
            $w("#txtMessage4").show();
            return;
        }

        const email = $w('#iptemailregister').value;
        const password = $w('#iptpasswordregister').value;
        const options = {
            contactInfo: {
                firstName: $w('#iptfirstname').value,
                lastName: $w('#iptlastName').value,
                phones: [$w('#iptphone').value]
            }
        };
        const registrationResult = await authentication.register(email, password, options);

        await createUserRecordInDatabase(registrationResult.member._id);

        $w("#txtMessage").text = "¡Registro exitoso! Serás redirigido...";
        $w("#txtMessage").show();
        wixLocation.to("/dashboard");

    } catch (error) {
        console.error("Error en el registro:", error);
        $w("#txtMessage4").text = "Ocurrió un error inesperado durante el registro.";
        $w("#txtMessage4").show();
    } finally {
        $w("#btnregistro").enable();
        $w("#btnregistro").label = "Registrarse";
    }
}

/**
 * @description Maneja el flujo de inicio de sesión.
 */
async function handleLogin() {
      $w("#txtMessage1").text = "Espere un momento su información se esta procesando...";
      $w("#txtMessage1").show();
      
    $w('#btnlogin').disable();
   
    const email = $w('#iptemaillogin').value;
    const password = $w('#iptpasslogin').value;

    try {
        await authentication.login(email, password);
        $w("#txtMessage1").text = "¡Acceso exitoso!";
        $w("#txtMessage1").show();
        wixLocation.to("/dashboard");
    } catch (error) {
        $w("#txtMessage2").text = "Correo o contraseña incorrectos, inténtelo de nuevo.";
        $w("#txtMessage2").show();
        $w("#forgotPassword").show();
        console.error("Error de inicio de sesión:", error);
    } finally {
        $w('#btnlogin').enable();
    }
}

/**
 * @description Inicia el proceso de recuperación de contraseña.
 */
async function handleForgotPassword() {
    try {
        await authentication.promptForgotPassword();
    } catch (error) {
        console.error("Error al mostrar la ventana de recuperación:", error);
    }
}

// --- Funciones de Soporte y Utilidades ---
async function runLiveValidation() {
    // 1. Llama a tu función de validación y espera el resultado.
    const validationResult = await validateRegistrationForm();

    // 2. Si el resultado NO es válido y contiene un mensaje...
    if (!validationResult.isValid && validationResult.message) {
        // ...lo mostramos en el elemento de texto.
        $w("#txtMessage").text = validationResult.message;
        $w("#txtMessage").show();
    }
}

/**
 * @description Valida los campos del formulario de registro.
 * @returns {Promise<object>} Un objeto con { isValid: boolean, message: string }
 */
/**
 * @description Valida los campos del formulario, revisando primero si el email ya existe.
 * @returns {Promise<object>} Un objeto con { isValid: boolean, message: string }
 */
async function validateRegistrationForm() {
    const email = $w("#iptemailregister").value;
    const password = $w("#iptpasswordregister").value;

    // --- LÓGICA REORDENADA ---

    // 1. Primero, verificamos si el campo de email tiene algo que parezca un correo.
   

    // 3. Si el email está disponible, continuamos con las otras validaciones.
    if ($w("#iptfirstname").value.length < 2 || $w("#iptlastName").value.length < 2) {
        return { isValid: false, message: "Introduzca nombres y apellidos válidos." };
    }
    // Se vuelve a validar el formato del email por si el usuario lo dejó mal escrito.
    if (!email.includes("@") || email.length < 5) {
        return { isValid: false, message: "Por favor, introduzca un correo válido." };
    }
     if (email.includes("@") && email.length >= 5) {
        // 2. Si es así, INMEDIATAMENTE consultamos la base de datos.
        const results = await wixData.query("User").eq("emailAddress", email).limit(1).find();
        if (results.items.length > 0) {
            $w('#btnLoginRedirect').show();
            // ✅ AÑADIDO: Deshabilitamos el botón de registro como pediste.
            $w("#btnregistro").disable(); 
            return { isValid: false, message: "Este email ya está registrado, inicia sesión 👉" };
        }
    }

    if (password.length < 6) {
        return { isValid: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }
    if ($w("#iptphone").value.length < 8) {
        return { isValid: false, message: "Por favor, ingrese un teléfono de 8 dígitos o mas" };
    }

    // 4. Si todas las validaciones pasan, el formulario es válido.
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

    // --- ✅ OBJETO COMPLETO CON TODOS TUS CAMPOS ORIGINALES ---
    const toInsert = {
        _id: memberId,
        emailAddress: $w('#iptemailregister').value,
        firstName: $w('#iptfirstname').value,
        lastName: $w('#iptlastName').value,
        nombreCompleto: `${$w('#iptfirstname').value} ${$w('#iptlastName').value}`,
        userName: `${$w('#iptfirstname').value} ${$w('#iptlastName').value}`,
        telefono: $w('#iptphone').value,
        politica: true,
        countryCode: "558",
        verified: "Pending",
        status: "Inicio",
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
        wixLocation.to("/consola");
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
        }
    } catch(error) {
        console.error("No se pudo obtener la información de la IP:", error);
    }
}

/**
 * @description Valida el email de login: revisa únicamente si el usuario existe en la colección "User".
 */
async function validateLoginEmail() {
    const email = $w("#iptemaillogin").value;
    
    // Ocultamos cualquier mensaje de error previo al iniciar la validación.
    $w("#txtMessage2").hide();
    
    // No hacemos nada si el campo está vacío o no parece un email.
    if (!email || !email.includes("@")) {
        $w('#btnlogin').disable(); // Deshabilitamos el botón si el formato no es válido.
        return;
    }

    try {
        // Hacemos la consulta a tu base de datos "User".
        const userResults = await wixData.query("User")
            .eq("emailAddress", email)
            .limit(1)
            .find();

        // Comprobamos el resultado.
        if (userResults.items.length === 0) {
            // Si no se encuentran resultados, el email no está registrado.
            $w("#txtMessage2").text = "Este correo no está registrado. Por favor, regístrate.";
            $w("#txtMessage2").show();
            $w('#btnlogin').disable(); // Mantenemos el botón deshabilitado.
        } else {
            // Si se encuentra el usuario, el email es válido para iniciar sesión.
            $w('#btnlogin').enable(); // Habilitamos el botón.
        }

    } catch (error) {
        console.error("Error durante la validación del email de login:", error);
        $w("#txtMessage2").text = "Ocurrió un error al verificar el correo.";
        $w("#txtMessage2").show();
        $w('#btnlogin').disable(); // Por seguridad, deshabilitamos si hay un error.
    }
}
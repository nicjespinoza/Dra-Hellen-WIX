                    import { authentication, currentMember } from 'wix-members-frontend';
                    import wixData from 'wix-data';
                    import { session } from 'wix-storage-frontend';
                    import wixLocationFrontend from 'wix-location-frontend';
                    import { openLightbox } from 'wix-window-frontend';
                    import { initTransaction, getMyTransactions } from 'backend/powertranz3.web.js';
                    import { v4 as uuidv4 } from 'uuid';

                    let userId;
                    let active;

                    $w.onReady(function() {
                        configurarRepeater();
                        iniciarDashboard();
                          $w('#btnlogout').onClick(async () => {
                                await authentication.logout();
                                wixLocationFrontend.to("/");
                            });
                    });

                    async function iniciarDashboard() {
                        try {
                            const member = await currentMember.getMember({ fieldsets: ['FULL'] });
                            if (!member) {
                                wixLocationFrontend.to('/acceso');
                                return;
                            }
                            userId = member._id;
                            active = member._id;

                            configurarBotonesDePago();

                            // 👇 AQUÍ ESTÁ LA LÍNEA MODIFICADA 👇
                          

                            const userData = await wixData.get("User", userId);
                            if (userData) {
                                updateUIWithUserData(userData);
                                

                               

                                if (userData.status === 'Paciente' || userData.status === 'Activo') {
                                    cargarHistorialDePagos();
                                     await checkUserPurchases();
                                    await checkUserPurchases1();
                                    await checkForSubscriptionPlans();
                                    await checkUserPurchases2() 
                                    await checkUserPurchases3() 
                                    await checkUserPurchases4()
                                   
                                    $w('#button65').show()
                                    $w('#emaillogin').show()
                                 

                                }

                                if (userData.emailVerified === 'Yes') {
                                 $w('#btncursos').enable()
                             }

                              if (userData.verified === 'Activo') {
                                $w('#button70').expand();
                             }


                            } else {
                                console.error('CRÍTICO: No se encontró el item del usuario en la colección "User".');
                            }
                        } catch (error) {
                            console.error("Error al iniciar el dashboard:", error);
                        }
                    }

                    async function checkUserPurchases() {
                    const transactions = await getMyTransactions();
                    const hasNutricionCourse = transactions.some(item => item.conceptopago === 'Curso de nutricion' && item.status === 'Completed'); // Asume que 'Pagado' es el estado de una transacción exitosa
                    updateUIBasedOnPurchases(hasNutricionCourse);

                    }


                    async function checkUserPurchases1() {
                    const transactions = await getMyTransactions();
                    const hasNutricionCourse = transactions.some(item => item.conceptopago === 'Programa de 3 meses Online' && item.status === 'Completed'); // Asume que 'Pagado' es el estado de una transacción exitosa
                    updateUIBasedOnPurchases1(hasNutricionCourse);

                    }
                
                 async function checkUserPurchases2() {
                    const transactions = await getMyTransactions();
                    const hasNutricionCourse = transactions.some(item => item.conceptopago === 'Libro de recetas digital' && item.status === 'Completed'); // Asume que 'Pagado' es el estado de una transacción exitosa
                    updateUIBasedOnPurchases2(hasNutricionCourse);

                    }

                  async function checkUserPurchases3() {
                    const transactions = await getMyTransactions();
                    const hasNutricionCourse = transactions.some(item => item.conceptopago === 'Guia Antiflamatoria' && item.status === 'Completed'); // Asume que 'Pagado' es el estado de una transacción exitosa
                    updateUIBasedOnPurchases3(hasNutricionCourse);

                    }

                    async function checkUserPurchases4() {
                    const transactions = await getMyTransactions();
                    const hasNutricionCourse = transactions.some(item => item.conceptopago === 'Resistencia a la Insulina para Pacientes' && item.status === 'Completed'); // Asume que 'Pagado' es el estado de una transacción exitosa
                    updateUIBasedOnPurchases4(hasNutricionCourse);

                    }

                    function updateUIBasedOnPurchases(hasNutricionCourse) {
                    if (hasNutricionCourse) {
                    $w('#btncursos').enable();
                    $w('#emaillogin').show();
                    //$w('#html1').collapse();
                    //$w('#group1').collapse();
                     //$w('#pdflibro').collapse();
                    }
                    }

                    function updateUIBasedOnPurchases1(hasNutricionCourse) {
                    if (hasNutricionCourse) {
                    $w('#group1').expand();
                   // $w('#html1').collapse();
                   // $w('#pdflibro').collapse();
                    
                    }
                    }

                   

                    function updateUIBasedOnPurchases2(hasNutricionCourse) {
                        if (hasNutricionCourse) {
                            // Muestra el botón y el texto de notificación
                            $w('#pdflibro').expand();
                            $w('#txtnotipdf').show();
                            $w('#txtnotipdf').text = "👈​ Descarga tu Plan de Alimentación para Hígado Graso";

                            console.log("Mensaje de notificación mostrado. Se ocultará en 10 segundos.");
                            const PDF_DOWNLOAD_URL = "https://3743a788-0944-473a-b9b6-b2be33ff8093.usrfiles.com/ugd/3743a7_ab3ff7249252497797fb091ae69fb776.pdf";

                            $w('#pdflibro').onClick(() => {
                                // Redirige a la URL del PDF, lo que inicia la descarga en el navegador.
                                // Para forzar la descarga, usamos wixLocation.to() con la URL del archivo.
                                console.log("Iniciando descarga del PDF...");
                                wixLocationFrontend.to(PDF_DOWNLOAD_URL);
                            });

                            // Ocultar el texto después de 10 segundos (10000 milisegundos)
                            setTimeout(() => {
                                $w('#txtnotipdf').hide();
                                console.log("Mensaje de notificación ocultado.");
                            }, 9000); // 10000 milisegundos = 10 segundos
                        } else {
                            // Opcional: Si el curso NO está comprado, puedes colapsar/ocultar los elementos
                            $w('#pdflibro').collapse();
                            $w('#txtnotipdf').hide();
                        }
                    }


                        function updateUIBasedOnPurchases3(hasNutricionCourse) {
                        if (hasNutricionCourse) {
                            // Muestra el botón y el texto de notificación
                            $w('#pdfguia').expand();
                            $w('#txtnotipdf1').show();
                            $w('#txtnotipdf1').text = "👈​ Descarga tu Guia Antiflamatoria";

                            console.log("Mensaje de notificación mostrado. Se ocultará en 10 segundos.");
                            const PDF_DOWNLOAD_URL = "https://3743a788-0944-473a-b9b6-b2be33ff8093.usrfiles.com/ugd/3743a7_aceecb58e4c14888b88e57b82e04f829.pdf";

                            $w('#pdfguia').onClick(() => {
                                // Redirige a la URL del PDF, lo que inicia la descarga en el navegador.
                                // Para forzar la descarga, usamos wixLocation.to() con la URL del archivo.
                                console.log("Iniciando descarga del PDF...");
                                wixLocationFrontend.to(PDF_DOWNLOAD_URL);
                            });

                            // Ocultar el texto después de 10 segundos (10000 milisegundos)
                            setTimeout(() => {
                                $w('#txtnotipdf1').hide();
                                console.log("Mensaje de notificación ocultado.");
                            }, 9000); // 10000 milisegundos = 10 segundos
                        } else {
                            // Opcional: Si el curso NO está comprado, puedes colapsar/ocultar los elementos
                            $w('#pdfguia').collapse();
                            $w('#txtnotipdf1').hide();
                        }
                    }

                   function updateUIBasedOnPurchases4(hasNutricionCourse) {
    if (hasNutricionCourse || (active && active.verified === 'Activo')) {
        $w('#button70').expand();
    }
}

                    async function checkForSubscriptionPlans() {
                    const transactions = await getMyTransactions();
                    const hasPlan = transactions.some(item => 
                    (item.conceptopago === 'Plan 1 Mes' || item.conceptopago === 'Plan 3 Meses' || item.conceptopago === 'Plan 6 Meses') && item.status === 'Completed'
                    );
                    updateUIForSubscriptions(hasPlan);
                    }

                    function updateUIForSubscriptions(hasPlan) {
                    if (hasPlan) {
                   // $w('#group1').collapse();
                    $w('#html1').expand();
                   // $w('#pdflibro').collapse();
                    }
                    }

                    function updateUIWithUserData(currentItem) {
                        console.log("UserData cargado:", currentItem);
                        
                        try {
                            $w('#vusername').text = currentItem.userName || "Sin usuario";
                        } catch (e) {
                            console.error("No existe #vusername en mobile");
                        }

                        try {
                            $w('#txtedad').text = currentItem.edad || "Edad no registrada";
                        } catch (e) {
                            console.error("No existe #txtedad en mobile");
                        }

                        try {
                            $w('#vemail').text = currentItem.emailAddress || "Sin email";
                        } catch (e) {
                            console.error("No existe #vemail en mobile");
                        }

                        try {
                            $w('#vnombrecompleto').text = currentItem.pacienteid || "Sin nombre";
                        } catch (e) {
                            console.error("No existe #vnombrecompleto en mobile");
                        }

                    

                        handleUserStatus(currentItem);
                    }


                    function handleUserStatus(currentItem) {
                        switch (currentItem.status) {
                            case 'Inicio': displayInicioState(); break;
                            case 'Medio': displayMedioState(); break;
                            case 'Activo': displayActivoState(); break;
                            case 'Paciente': displayPacienteState(); break;
                            default: console.warn('Estado desconocido:', currentItem.status);
                        }
                    }
                    

                    function displayInicioState() {
                        $w('#statebox11').changeState('state7');
                        $w('#imgVerifyinicio').show();
                        $w('#txtedad').collapse();

                        $w('#txtnotificacion1').show();
                    
                    }

                    function displayMedioState() {
                        $w('#statebox11').changeState('state9');
                        $w('#button51').label = 'Editar perfil';
                        $w('#imgVerifyinicio').hide();
                        
                        $w('#box12').expand();
                    }

                    function displayActivoState() {
                        $w('#statebox11').changeState('state10');

                        $w('#button51').label = 'Editar perfil';
                    
                    }

                    function displayPacienteState() {
                        $w('#statebox11').changeState('state11');

                        $w('#button51').label = 'Editar perfil';
                    }

                    async function cargarHistorialDePagos() {
                        try {
                            const transactions = await getMyTransactions();
                            if (transactions.length > 0) {
                                $w("#repeater1").data = transactions;
                                $w("#boxHistorialPagos").expand();
                            } else {
                                $w("#boxHistorialPagos").collapse();
                            }
                        } catch (error) {
                            console.error("Error al cargar y mostrar el historial de pagos:", error);
                        }
                    }

                    function configurarRepeater() {
                        $w("#repeater1").onItemReady(($item, itemData, index) => {
                            $item("#textIdTransaccion").text = itemData.orderId;
                            $item("#textConceptoPago").text = itemData.conceptopago;
                            $item("#textMontoPagado").text = `C$${itemData.amount.toFixed(2)}`;
                            if (itemData._createdDate) {
                                const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
                                $item("#textfecha").text = new Date(itemData._createdDate).toLocaleDateString('es-NI', opcionesFecha);
                            } else {
                                $item("#textfecha").text = "Fecha no disponible";
                            }
                            if (itemData.isReversible) {
                                $item("#btnRevertir").label = "Cancelar Plan";
                                //$item("#btnRevertir").show();
                                $item("#btnRevertir").onClick(async () => {
                                    const result = await openLightbox("reversiones", itemData);
                                    if (result && result.reversionExitosa) {
                                        await cargarHistorialDePagos();
                                    }
                                });
                            } else if (itemData.status === 'Revertido') {
                                $item("#btnRevertir").label = "Revertido";
                              //  $item("#btnRevertir").show();
                                $item("#btnRevertir").disable();
                            } else {
                                $item("#btnRevertir").hide();
                            }
                        });
                    }

                    function configurarBotonesDePago() {
                        const paymentPlans = {
                                '#button52': { amount: 5550,    concept: 'Programa de 3 meses Online',      environment: 'production' },
                                '#button58': { amount: 1480,    concept: 'Curso de nutricion',              environment: 'production' },
                                '#button59': { amount: 221.63,  concept: 'Libro de recetas digital',        environment: 'production' },
                                '#button66': { amount: 366.63,  concept: 'Guia Antiflamatoria',             environment: 'production' },
                                '#button60': { amount: 2220,    concept: 'Plan 1 Mes',                      environment: 'production' },
                                '#button61': { amount: 5180,    concept: 'Plan 3 Meses',                    environment: 'production' },
                                '#button62': { amount: 9990,    concept: 'Plan 6 Meses',                    environment: 'production' },
                                '#button67': { amount: 1656,    concept: 'Desafio Fit',                     environment: 'production' },
                                '#button68': { amount: 1468,    concept: 'Plan personalizado Antiflamatorio', environment: 'production' },
                                '#button69': { amount: 1799,    concept: 'Resistencia a la Insulina para Pacientes', environment: 'production' },
                                '#button63': { amount: 1799,  concept: 'Resistencia a la Insulina para Pacientes',             environment: 'staging' },
                    
                        };

                        Object.entries(paymentPlans).forEach(([buttonId, planDetails]) => {
                            $w(buttonId).onClick(async () => {
                                $w(buttonId).disable();
                                $w('#statusText').text = 'Iniciando pago...';
                                try {
                                    const userDataResult = await wixData.query('User').eq('_id', userId).find();
                                    if (!userDataResult.items.length) { throw new Error('No pudimos encontrar tus datos de usuario.'); }
                                    const userData = userDataResult.items[0];

                                    const billingAddress = {
                                        FirstName: userData.firstName ,
                                        LastName: userData.lastName,
                                        Line1: userData.addressLine1 ,
                                        City: userData.city,
                                        CountryCode: '558',
                                        EmailAddress: userData.emailAddress,
                                        PhoneNumber: userData.telefono
                                    };
                                    
                                    const orderId = `PEDIDO_${Date.now()}`;
                                    const sessionId = session.getItem('sessionId') || uuidv4();
                                    session.setItem('sessionId', sessionId);

                                    const result = await initTransaction(
                                        userId,
                                        orderId,
                                        planDetails.amount,
                                        billingAddress,
                                        sessionId,
                                        planDetails.environment,
                                        planDetails.concept
                                    );

                                    if (result.success) {
                                        session.setItem('transactionId', result.transactionId);
                                        session.setItem('csrfToken', result.csrfToken);
                                        await openLightbox('PaymentLightbox', result);
                                    } else {
                                        throw new Error(result.error || 'No se pudo iniciar el proceso de pago.');
                                    }
                                } catch (error) {
                                    $w('#statusText').text = `Error: ${error.message}`;
                                } finally {
                                    $w(buttonId).enable();
                                }
                            });
                        });
                    }

                    $w('#text826').onClick((event) => {
                            $w('#button63').show();
                    })

                    $w('#text826').onDblClick((event) => {
                            $w('#button63').hide();
                    })

$w('#button65').onClick((event) => {
         $w('#statebox11').changeState('state10');
})

$w('#button64').onClick((event) => {
     $w('#statebox11').changeState('state9');    
})
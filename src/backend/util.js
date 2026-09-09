import wixData from 'wix-data';





export async function cleanupOldCsrfTokens() {
    console.log("Iniciando la tarea de limpieza de CsrfTokens...");

    // 1. Calcular la fecha de corte (hace 3 días)
    const now = new Date();
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(now.getTime() - threeDaysInMillis);

    console.log(`Buscando registros creados antes de: ${cutoffDate.toISOString()}`);

    try {
        // 2. Buscar todos los registros más antiguos que la fecha de corte
        const itemsToDelete = await wixData.query('CsrfTokens')
            .lt('_createdDate', cutoffDate) // .lt significa 'less than' (menor que)
            .limit(1000) // Wix permite borrar hasta 1000 registros por llamada
            .find();

        // 3. Si no hay registros que borrar, terminar la tarea
        if (itemsToDelete.items.length === 0) {
            console.log("No se encontraron registros antiguos para eliminar. Tarea completada.");
            return;
        }

        console.log(`Se encontraron ${itemsToDelete.items.length} registros para eliminar.`);

        // 4. Extraer los IDs de los registros a borrar
        const idsToDelete = itemsToDelete.items.map(item => item._id);

        // 5. Borrar los registros en bloque (es más eficiente)
        const result = await wixData.bulkRemove('CsrfTokens', idsToDelete);
        
        console.log(`Se eliminaron exitosamente ${result.removedItemIds.length} registros. Tarea completada.`);

    } catch (error) {
        console.error("Ocurrió un error durante la limpieza de CsrfTokens:", error);
    }
}
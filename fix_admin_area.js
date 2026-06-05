const pool = require('./backend/db');

async function fixAdminArea() {
    try {
        await pool.query(`
            UPDATE ba_unidad
            SET area_registral = (
                SELECT SUM(area_calculada)
                FROM lc_terreno_construccion
                WHERE lc_terreno_construccion.ba_unidad_id = ba_unidad.id
            )
            WHERE EXISTS (
                SELECT 1
                FROM lc_terreno_construccion
                WHERE lc_terreno_construccion.ba_unidad_id = ba_unidad.id
            );
        `);
        console.log("Área registral actualizada con base en el área calculada de la unidad espacial.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

fixAdminArea();

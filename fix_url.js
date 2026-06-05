const pool = require('./backend/db');

async function fixUrl() {
    try {
        await pool.query("UPDATE cartografia_referencia SET url_recurso = 'https://www.colombiaenmapas.gov.co/' WHERE id = 1");
        console.log("URL de ortofoto corregida exitosamente a Colombia en Mapas.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

fixUrl();

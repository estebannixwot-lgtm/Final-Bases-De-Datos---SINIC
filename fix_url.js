const pool = require('./backend/db');

async function fixData() {
    try {
        await pool.query("DELETE FROM lc_terreno_construccion WHERE id = 1;");
        console.log("Poligono de Africa (Dummy) eliminado.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

fixData();

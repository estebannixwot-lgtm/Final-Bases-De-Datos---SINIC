const pool = require('./backend/db');

async function fixArea() {
    try {
        // Al insertar desde Puente_Aranda, las coordenadas eran WGS84 (Lat/Lon) pero se guardaron en la columna 9377.
        // Para calcular el área real en metros cuadrados, temporalmente tratamos la geometría como 4326 (WGS84) 
        // y la convertimos a tipo Geography para que ST_Area devuelva metros cuadrados precisos.
        await pool.query("UPDATE lc_terreno_construccion SET area_calculada = ROUND(ST_Area(ST_SetSRID(geom, 4326)::geography)::numeric, 2);");
        
        console.log("Áreas recalculadas correctamente basándose en la geometría real (en m²).");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

fixArea();

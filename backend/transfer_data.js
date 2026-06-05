const { Client } = require('pg');

const clientSource = new Client({user: 'postgres', host: 'localhost', password: 'admin', port: 5433, database: 'Puente_Aranda'});
const clientTarget = new Client({user: 'postgres', host: 'localhost', password: 'admin', port: 5433, database: 'catastro_sinic'});

async function transferData() {
    try {
        await clientSource.connect();
        await clientTarget.connect();
        
        // Obtenemos 5 polígonos de Puente_Aranda extrayendo el primer polígono del multipolígono si es necesario.
        const sourceRes = await clientSource.query("SELECT *, ST_AsText(ST_GeometryN(geom, 1)) as geom_wkt FROM \"Puente_Aranda\" WHERE ST_GeometryType(geom) IN ('ST_Polygon', 'ST_MultiPolygon') LIMIT 5;");
        
        for (let i = 0; i < sourceRes.rows.length; i++) {
            const row = sourceRes.rows[i];
            const wkt = row.geom_wkt;
            
            if(!wkt) continue;
            
            // 1. Create a dummy ba_unidad
            const baRes = await clientTarget.query("INSERT INTO ba_unidad (tipo_derecho, area_registral, fecha_registro) VALUES ('Dominio', 150.5, '2023-05-10') RETURNING id;");
            const baId = baRes.rows[0].id;
            
            // 2. Insert into lc_terreno_construccion
            const query = `INSERT INTO lc_terreno_construccion (ba_unidad_id, tipo, area_calculada, geom) VALUES ($1, 'Terreno', 150.5, ST_GeomFromText($2, 9377))`;
            
            try {
               await clientTarget.query(query, [baId, wkt]);
               console.log(`Geometria ${i+1} importada con exito.`);
            } catch (innerErr) {
               console.error(`Error importando geometria ${i+1}: ${innerErr.message}`);
            }
        }
        
    } catch (err) {
        console.error("Error general:", err);
    } finally {
        await clientSource.end();
        await clientTarget.end();
    }
}

transferData();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const credentials = {
    user: 'postgres',
    host: 'localhost',
    password: 'admin',
    port: 5433,
};

async function initDB() {
    // 1. Conectar a postgres (default) para crear la base de datos
    const clientDefault = new Client({ ...credentials, database: 'postgres' });
    
    try {
        await clientDefault.connect();
        const res = await clientDefault.query("SELECT datname FROM pg_database WHERE datname = 'catastro_sinic'");
        if (res.rowCount === 0) {
            console.log("Creando base de datos 'catastro_sinic'...");
            await clientDefault.query('CREATE DATABASE catastro_sinic');
            console.log("Base de datos creada exitosamente.");
        } else {
            console.log("La base de datos 'catastro_sinic' ya existe.");
        }
    } catch (err) {
        console.error("Error creando la base de datos:", err);
    } finally {
        await clientDefault.end();
    }

    // 2. Conectar a catastro_sinic y ejecutar el schema
    const clientCatastro = new Client({ ...credentials, database: 'catastro_sinic' });
    try {
        await clientCatastro.connect();
        const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log("Ejecutando schema SQL...");
        await clientCatastro.query(schemaSql);
        console.log("Esquema creado e inicializado exitosamente.");
    } catch (err) {
        console.error("Error ejecutando el schema:", err);
    } finally {
        await clientCatastro.end();
    }
}

initDB();

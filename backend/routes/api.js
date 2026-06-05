const express = require('express');
const router = express.Router();
const pool = require('../db');

// --- 1. UNIDAD ADMINISTRATIVA (ba_unidad) ---
router.get('/unidad-administrativa', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ba_unidad ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/unidad-administrativa', async (req, res) => {
    const { tipo_derecho, area_registral, fecha_registro } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ba_unidad (tipo_derecho, area_registral, fecha_registro) VALUES ($1, $2, $3) RETURNING *',
            [tipo_derecho, area_registral, fecha_registro]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/unidad-administrativa/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_derecho, area_registral, fecha_registro } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ba_unidad SET tipo_derecho = $1, area_registral = $2, fecha_registro = $3 WHERE id = $4 RETURNING *',
            [tipo_derecho, area_registral, fecha_registro, id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/unidad-administrativa/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM ba_unidad WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 2. UNIDAD ESPACIAL (lc_terreno_construccion) ---
router.get('/unidad-espacial', async (req, res) => {
    try {
        // Obtenemos la geometria como GeoJSON para usarla facil en Leaflet
        const result = await pool.query('SELECT id, ba_unidad_id, tipo, area_calculada, ST_AsGeoJSON(ST_SetSRID(geom, 4326))::json as geom FROM lc_terreno_construccion ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/unidad-espacial', async (req, res) => {
    const { ba_unidad_id, tipo, area_calculada, geom_wkt } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lc_terreno_construccion (ba_unidad_id, tipo, area_calculada, geom) VALUES ($1, $2, $3, ST_GeomFromText($4, 9377)) RETURNING id, ba_unidad_id, tipo, area_calculada, ST_AsGeoJSON(geom)::json as geom',
            [ba_unidad_id, tipo, area_calculada, geom_wkt]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/unidad-espacial/:id', async (req, res) => {
    const { ba_unidad_id, tipo, area_calculada, geom_wkt } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lc_terreno_construccion SET ba_unidad_id = $1, tipo = $2, area_calculada = $3, geom = ST_GeomFromText($4, 9377) WHERE id = $5 RETURNING id, ba_unidad_id, tipo, area_calculada, ST_AsGeoJSON(geom)::json as geom',
            [ba_unidad_id, tipo, area_calculada, geom_wkt, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/unidad-espacial/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM lc_terreno_construccion WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 3. INTERESADOS (lc_interesado) ---
router.get('/interesado', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lc_interesado ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/interesado', async (req, res) => {
    const { ba_unidad_id, tipo_documento, numero_documento, nombre_completo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lc_interesado (ba_unidad_id, tipo_documento, numero_documento, nombre_completo) VALUES ($1, $2, $3, $4) RETURNING *',
            [ba_unidad_id, tipo_documento, numero_documento, nombre_completo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/interesado/:id', async (req, res) => {
    const { ba_unidad_id, tipo_documento, numero_documento, nombre_completo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lc_interesado SET ba_unidad_id = $1, tipo_documento = $2, numero_documento = $3, nombre_completo = $4 WHERE id = $5 RETURNING *',
            [ba_unidad_id, tipo_documento, numero_documento, nombre_completo, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/interesado/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM lc_interesado WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 4. TOPOGRAFÍA Y REPRESENTACIÓN (lc_punto_levantamiento) ---
router.get('/topografia', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, ba_unidad_id, tipo_punto, ST_AsGeoJSON(ST_SetSRID(geom, 4326))::json as geom FROM lc_punto_levantamiento ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/topografia', async (req, res) => {
    const { ba_unidad_id, tipo_punto, geom_wkt } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lc_punto_levantamiento (ba_unidad_id, tipo_punto, geom) VALUES ($1, $2, ST_GeomFromText($3, 9377)) RETURNING id, ba_unidad_id, tipo_punto, ST_AsGeoJSON(geom)::json as geom',
            [ba_unidad_id, tipo_punto, geom_wkt]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/topografia/:id', async (req, res) => {
    const { ba_unidad_id, tipo_punto, geom_wkt } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lc_punto_levantamiento SET ba_unidad_id = $1, tipo_punto = $2, geom = ST_GeomFromText($3, 9377) WHERE id = $4 RETURNING id, ba_unidad_id, tipo_punto, ST_AsGeoJSON(geom)::json as geom',
            [ba_unidad_id, tipo_punto, geom_wkt, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/topografia/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM lc_punto_levantamiento WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 5. CARTOGRAFÍA CATASTRAL (cartografia_referencia) ---
router.get('/cartografia', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cartografia_referencia ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/cartografia', async (req, res) => {
    const { nombre_mapa, fecha_vuelo, url_recurso } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO cartografia_referencia (nombre_mapa, fecha_vuelo, url_recurso) VALUES ($1, $2, $3) RETURNING *',
            [nombre_mapa, fecha_vuelo, url_recurso]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/cartografia/:id', async (req, res) => {
    const { nombre_mapa, fecha_vuelo, url_recurso } = req.body;
    try {
        const result = await pool.query(
            'UPDATE cartografia_referencia SET nombre_mapa = $1, fecha_vuelo = $2, url_recurso = $3 WHERE id = $4 RETURNING *',
            [nombre_mapa, fecha_vuelo, url_recurso, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/cartografia/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM cartografia_referencia WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

-- Script de Creación de Base de Datos Espacial LADM-COL SINIC V1.0 (Simplificado)

-- Habilitar PostGIS (debe ejecutarse en la base de datos 'catastro_sinic')
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. UNIDAD ADMINISTRATIVA (Gestión de Derechos)
CREATE TABLE IF NOT EXISTS ba_unidad (
    id SERIAL PRIMARY KEY,
    tipo_derecho VARCHAR(100) NOT NULL,
    area_registral NUMERIC(10,2),
    fecha_registro DATE
);

-- 2. UNIDAD ESPACIAL (Geometría tipo Polígono)
CREATE TABLE IF NOT EXISTS lc_terreno_construccion (
    id SERIAL PRIMARY KEY,
    ba_unidad_id INTEGER REFERENCES ba_unidad(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Terreno', 'Construccion')),
    area_calculada NUMERIC(10,2),
    geom GEOMETRY(Polygon, 9377) -- SRID 9377: Origen Nacional Colombia
);

-- 3. INTERESADOS (Personas naturales o jurídicas)
CREATE TABLE IF NOT EXISTS lc_interesado (
    id SERIAL PRIMARY KEY,
    ba_unidad_id INTEGER REFERENCES ba_unidad(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL
);

-- 4. TOPOGRAFÍA Y REPRESENTACIÓN (Puntos de levantamiento)
CREATE TABLE IF NOT EXISTS lc_punto_levantamiento (
    id SERIAL PRIMARY KEY,
    ba_unidad_id INTEGER REFERENCES ba_unidad(id) ON DELETE CASCADE,
    tipo_punto VARCHAR(100),
    geom GEOMETRY(Point, 9377)
);

-- 5. CARTOGRAFÍA CATASTRAL
CREATE TABLE IF NOT EXISTS cartografia_referencia (
    id SERIAL PRIMARY KEY,
    nombre_mapa VARCHAR(255) NOT NULL,
    fecha_vuelo DATE,
    url_recurso VARCHAR(500)
);

-- Datos de prueba básicos
INSERT INTO ba_unidad (tipo_derecho, area_registral, fecha_registro) VALUES 
('Dominio', 150.50, '2023-01-15'),
('Posesion', 200.00, '2023-02-20');

INSERT INTO lc_terreno_construccion (ba_unidad_id, tipo, area_calculada, geom) VALUES 
(1, 'Terreno', 150.00, ST_GeomFromText('POLYGON((1000000 1000000, 1000000 1000010, 1000015 1000010, 1000015 1000000, 1000000 1000000))', 9377));

INSERT INTO lc_interesado (ba_unidad_id, tipo_documento, numero_documento, nombre_completo) VALUES 
(1, 'CC', '12345678', 'Juan Perez'),
(2, 'NIT', '900123456-7', 'Empresa Inmobiliaria SAS');

INSERT INTO lc_punto_levantamiento (ba_unidad_id, tipo_punto, geom) VALUES 
(1, 'Lindero Norte', ST_GeomFromText('POINT(1000000 1000010)', 9377));

INSERT INTO cartografia_referencia (nombre_mapa, fecha_vuelo, url_recurso) VALUES 
('Ortofoto Centro', '2022-11-01', 'http://mapas.igac.gov.co/ortofoto1.tif');

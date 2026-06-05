# Proyecto Final - Bases de Datos Espaciales
**Sistema de Gestión Catastral LADM-COL SINIC V1.0**

## Descripción
Este proyecto implementa un caso de aplicación que permite gestionar datos catastrales conforme al **Modelo de Aplicación SINIC V 1.0**. 

Cuenta con una base de datos espacial PostgreSQL + PostGIS estructurada según un modelo LADM simplificado, un backend en Node.js y un frontend interactivo en React (Vite) con una estética premium e integración de mapas con Leaflet.

## Funcionalidades (CRUD Completos)
1. Unidad Administrativa
2. Unidad Espacial (con mapa interactivo)
3. Interesados
4. Topografía y Representación (con mapa interactivo)
5. Cartografía Catastral

## Requisitos Previos
- PostgreSQL 16+ con extensión PostGIS
- Node.js 18+

## Configuración y Ejecución

### 1. Base de Datos
- Cree una base de datos llamada `catastro_sinic` y habilite PostGIS (`CREATE EXTENSION postgis;`).
- Ejecute el script `database_schema.sql` provisto en la raíz.

### 2. Backend
- Navegue a la carpeta `backend/`
- Instale dependencias: `npm install`
- Ejecute el servidor: `node server.js`
- El servidor correrá en `http://localhost:3000`

### 3. Frontend
- Navegue a la carpeta `frontend/`
- Instale dependencias: `npm install`
- Ejecute el servidor de desarrollo: `npm run dev`
- Abra su navegador en la dirección que indique Vite (generalmente `http://localhost:5173`)

## Modelos y Documentación
En la carpeta `documentacion/` encontrará los modelos Conceptuales y Lógicos generados en formato PDF, como fue solicitado. El informe del desarrollo se encuentra en `informe_progreso_proyecto_final.txt`.

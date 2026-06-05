from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import sys

def create_pdf(filename, title, content_lines):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, title)
    
    c.setFont("Helvetica", 10)
    y_position = height - 80
    
    for line in content_lines:
        if line.startswith("## "):
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y_position, line[3:])
            c.setFont("Helvetica", 10)
            y_position -= 20
        elif line.startswith("- "):
            c.drawString(60, y_position, line)
            y_position -= 15
        else:
            c.drawString(50, y_position, line)
            y_position -= 15
            
        if y_position < 50:
            c.showPage()
            c.setFont("Helvetica", 10)
            y_position = height - 50
            
    c.save()

conceptual_content = [
    "## Entidades Principales y Relaciones",
    "",
    "## 1. Unidad Administrativa",
    "- Representa el derecho, restriccion o responsabilidad.",
    "- Atributos: identificador, tipo_derecho, fecha_registro, area_registral",
    "- Se compone de una o mas Unidades Espaciales.",
    "- Tiene uno o mas Interesados asociados.",
    "",
    "## 2. Unidad Espacial",
    "- Representa la geometria (poligono) del terreno o construccion.",
    "- Atributos: identificador, tipo, area_calculada, geometria",
    "- Se delimita con Topografia y Representacion.",
    "- Se referencia en Cartografia Catastral.",
    "",
    "## 3. Interesado",
    "- Persona natural o juridica vinculada a la unidad.",
    "- Atributos: identificador, tipo_documento, numero_documento, nombre_completo",
    "",
    "## 4. Topografia y Representacion",
    "- Puntos de levantamiento que delimitan la unidad.",
    "- Atributos: identificador, tipo_punto, geometria (Punto)",
    "",
    "## 5. Cartografia Catastral",
    "- Metadatos de mapas e imagenes de referencia.",
    "- Atributos: identificador, nombre_mapa, fecha_vuelo, url_recurso",
]

logical_content = [
    "## Esquema Fisico de la Base de Datos (PostgreSQL + PostGIS)",
    "",
    "## 1. ba_unidad",
    "- id (SERIAL, PRIMARY KEY)",
    "- tipo_derecho (VARCHAR)",
    "- area_registral (NUMERIC)",
    "- fecha_registro (DATE)",
    "",
    "## 2. lc_terreno_construccion",
    "- id (SERIAL, PRIMARY KEY)",
    "- ba_unidad_id (INTEGER, FOREIGN KEY REFERENCES ba_unidad(id))",
    "- tipo (VARCHAR)",
    "- area_calculada (NUMERIC)",
    "- geom (GEOMETRY(Polygon, 9377))",
    "",
    "## 3. lc_interesado",
    "- id (SERIAL, PRIMARY KEY)",
    "- ba_unidad_id (INTEGER, FOREIGN KEY REFERENCES ba_unidad(id))",
    "- tipo_documento (VARCHAR)",
    "- numero_documento (VARCHAR)",
    "- nombre_completo (VARCHAR)",
    "",
    "## 4. lc_punto_levantamiento",
    "- id (SERIAL, PRIMARY KEY)",
    "- ba_unidad_id (INTEGER, FOREIGN KEY REFERENCES ba_unidad(id))",
    "- tipo_punto (VARCHAR)",
    "- geom (GEOMETRY(Point, 9377))",
    "",
    "## 5. cartografia_referencia",
    "- id (SERIAL, PRIMARY KEY)",
    "- nombre_mapa (VARCHAR)",
    "- fecha_vuelo (DATE)",
    "- url_recurso (VARCHAR)",
]

create_pdf("modelo_conceptual.pdf", "Modelo Conceptual LADM-COL SINIC V1.0 (Simplificado)", conceptual_content)
create_pdf("modelo_logico.pdf", "Modelo Logico LADM-COL SINIC V1.0 (Simplificado)", logical_content)

print("PDFs generados correctamente.")

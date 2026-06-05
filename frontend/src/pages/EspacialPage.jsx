import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';

const API_URL = 'http://localhost:3000/api/unidad-espacial';

const EspacialPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ba_unidad_id: '', tipo: 'Terreno', area_calculada: '', geom_wkt: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setUnidades(res.data);
    } catch (err) { console.error(err); }
  };

  const openModal = (unidad = null) => {
    if (unidad) {
      setEditingId(unidad.id);
      // Extraer coordenadas de GeoJSON si quisieramos, pero aqui simplificamos asumiendo que el usuario ingresa WKT
      setFormData({
        ba_unidad_id: unidad.ba_unidad_id,
        tipo: unidad.tipo,
        area_calculada: unidad.area_calculada,
        geom_wkt: '' // Se deja en blanco en edicion para no parsear GeoJSON a WKT, a menos que el backend lo devuelva
      });
    } else {
      setEditingId(null);
      setFormData({ ba_unidad_id: '', tipo: 'Terreno', area_calculada: '', geom_wkt: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${API_URL}/${editingId}`, formData);
      else await axios.post(API_URL, formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert('Error guardando. Asegurese de que el WKT sea valido (Ej. POLYGON((x y, x y, ...))) y exista la Unidad Administrativa. \n' + err.message); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este registro?')) {
      try { await axios.delete(`${API_URL}/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  const parseGeoJSONCoords = (geojson) => {
    if(!geojson || !geojson.coordinates) return [];
    return geojson.coordinates[0].map(coord => {
      let lng = coord[0];
      let lat = coord[1];
      if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
          return [lat / 100000, lng / 100000]; // Dummy data
      }
      return [lat, lng]; // WGS84 standard data
    });
  };

  return (
    <div className="glass-panel">
      <div className="flex-between">
        <h1 className="page-title">Unidad Espacial</h1>
        <button className="btn" onClick={() => openModal()}><Plus size={18}/> Nueva Geometría</button>
      </div>

      <div className="map-container" style={{zIndex: 0}}>
        <MapContainer center={[4.63, -74.11]} zoom={13} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {unidades.map(u => (
            u.geom && u.geom.type === 'Polygon' && (
              <Polygon key={u.id} positions={parseGeoJSONCoords(u.geom)} color="#3b82f6" fillColor="#3b82f6" fillOpacity={0.4}>
                <Popup>
                  ID: {u.id} <br/> Tipo: {u.tipo} <br/> Área: {u.area_calculada} m²
                </Popup>
              </Polygon>
            )
          ))}
        </MapContainer>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Unidad Admin (ID)</th>
              <th>Tipo</th>
              <th>Área Calculada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.ba_unidad_id}</td>
                <td>{u.tipo}</td>
                <td>{u.area_calculada}</td>
                <td>
                  <button className="btn btn-secondary" style={{padding: '0.5rem', marginRight: '0.5rem'}} onClick={() => openModal(u)}>
                    <Edit size={16}/>
                  </button>
                  <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(u.id)}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            {unidades.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No hay geometrías.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar' : 'Crear'} Unidad Espacial</h2>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID Unidad Administrativa</label>
                <input type="number" className="form-control" required value={formData.ba_unidad_id} onChange={e => setFormData({...formData, ba_unidad_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select className="form-control" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="Terreno">Terreno</option>
                  <option value="Construccion">Construcción</option>
                </select>
              </div>
              <div className="form-group">
                <label>Área Calculada (m²)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.area_calculada} onChange={e => setFormData({...formData, area_calculada: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Geometría WKT (POLYGON)</label>
                <input type="text" className="form-control" required={!editingId} value={formData.geom_wkt} onChange={e => setFormData({...formData, geom_wkt: e.target.value})} placeholder="POLYGON((1000000 1000000, 1000000 1000010, 1000010 1000010, 1000000 1000000))" />
                <small style={{color: 'var(--text-secondary)'}}>Ej: POLYGON((x y, x y, x y, x y))</small>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspacialPage;

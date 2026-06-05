import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const API_URL = 'http://localhost:3000/api/topografia';

const TopografiaPage = () => {
  const [puntos, setPuntos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ba_unidad_id: '', tipo_punto: '', geom_wkt: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setPuntos(res.data);
    } catch (err) { console.error(err); }
  };

  const openModal = (punto = null) => {
    if (punto) {
      setEditingId(punto.id);
      setFormData({
        ba_unidad_id: punto.ba_unidad_id,
        tipo_punto: punto.tipo_punto,
        geom_wkt: ''
      });
    } else {
      setEditingId(null);
      setFormData({ ba_unidad_id: '', tipo_punto: '', geom_wkt: '' });
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
    } catch (err) { alert('Error guardando. Verifique el WKT (Ej. POINT(x y)).\n' + err.message); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este registro?')) {
      try { await axios.delete(`${API_URL}/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  const parsePoint = (geojson) => {
    if(!geojson || geojson.type !== 'Point') return null;
    let lng = geojson.coordinates[0];
    let lat = geojson.coordinates[1];
    if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
        return [lat / 100000, lng / 100000];
    }
    return [lat, lng];
  };

  return (
    <div className="glass-panel">
      <div className="flex-between">
        <h1 className="page-title">Topografía y Representación</h1>
        <button className="btn" onClick={() => openModal()}><Plus size={18}/> Nuevo Punto</button>
      </div>

      <div className="map-container" style={{zIndex: 0}}>
        <MapContainer center={[4.63, -74.11]} zoom={13} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {puntos.map(p => {
            const coords = parsePoint(p.geom);
            if(coords) {
              return (
                <CircleMarker key={p.id} center={coords} radius={8} color="#ef4444" fillColor="#ef4444" fillOpacity={0.8}>
                  <Popup>ID: {p.id} <br/> Tipo: {p.tipo_punto}</Popup>
                </CircleMarker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Unidad Admin (ID)</th>
              <th>Tipo Punto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {puntos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.ba_unidad_id}</td>
                <td>{p.tipo_punto}</td>
                <td>
                  <button className="btn btn-secondary" style={{padding: '0.5rem', marginRight: '0.5rem'}} onClick={() => openModal(p)}>
                    <Edit size={16}/>
                  </button>
                  <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            {puntos.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center'}}>No hay puntos.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar' : 'Crear'} Punto Topográfico</h2>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID Unidad Administrativa</label>
                <input type="number" className="form-control" required value={formData.ba_unidad_id} onChange={e => setFormData({...formData, ba_unidad_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tipo de Punto</label>
                <input type="text" className="form-control" required value={formData.tipo_punto} onChange={e => setFormData({...formData, tipo_punto: e.target.value})} placeholder="Ej: Lindero, Mojón" />
              </div>
              <div className="form-group">
                <label>Geometría WKT (POINT)</label>
                <input type="text" className="form-control" required={!editingId} value={formData.geom_wkt} onChange={e => setFormData({...formData, geom_wkt: e.target.value})} placeholder="POINT(1000000 1000010)" />
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

export default TopografiaPage;

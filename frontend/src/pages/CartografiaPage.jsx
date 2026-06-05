import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/cartografia';

const CartografiaPage = () => {
  const [cartografias, setCartografias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre_mapa: '', fecha_vuelo: '', url_recurso: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setCartografias(res.data);
    } catch (err) { console.error(err); }
  };

  const openModal = (cartografia = null) => {
    if (cartografia) {
      setEditingId(cartografia.id);
      setFormData({
        nombre_mapa: cartografia.nombre_mapa,
        fecha_vuelo: cartografia.fecha_vuelo ? cartografia.fecha_vuelo.split('T')[0] : '',
        url_recurso: cartografia.url_recurso || ''
      });
    } else {
      setEditingId(null);
      setFormData({ nombre_mapa: '', fecha_vuelo: '', url_recurso: '' });
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
    } catch (err) { alert('Error guardando.\n' + err.message); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este registro?')) {
      try { await axios.delete(`${API_URL}/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex-between">
        <h1 className="page-title">Cartografía Catastral</h1>
        <button className="btn" onClick={() => openModal()}><Plus size={18}/> Nueva Cartografía</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Mapa/Recurso</th>
              <th>Fecha Vuelo</th>
              <th>Enlace/URL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cartografias.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre_mapa}</td>
                <td>{c.fecha_vuelo ? new Date(c.fecha_vuelo).toLocaleDateString() : 'N/A'}</td>
                <td>{c.url_recurso ? <a href={c.url_recurso} target="_blank" rel="noreferrer" style={{color: 'var(--accent-primary)'}}>Ver Recurso</a> : 'N/A'}</td>
                <td>
                  <button className="btn btn-secondary" style={{padding: '0.5rem', marginRight: '0.5rem'}} onClick={() => openModal(c)}>
                    <Edit size={16}/>
                  </button>
                  <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(c.id)}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            {cartografias.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No hay cartografía.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar' : 'Crear'} Cartografía</h2>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Mapa o Recurso</label>
                <input type="text" className="form-control" required value={formData.nombre_mapa} onChange={e => setFormData({...formData, nombre_mapa: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Fecha de Vuelo/Captura</label>
                <input type="date" className="form-control" value={formData.fecha_vuelo} onChange={e => setFormData({...formData, fecha_vuelo: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Enlace / URL</label>
                <input type="url" className="form-control" value={formData.url_recurso} onChange={e => setFormData({...formData, url_recurso: e.target.value})} placeholder="https://..." />
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

export default CartografiaPage;

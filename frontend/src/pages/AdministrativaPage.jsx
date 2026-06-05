import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/unidad-administrativa';

const AdministrativaPage = () => {
  const [unidades, setUnidades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tipo_derecho: '', area_registral: '', fecha_registro: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setUnidades(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (unidad = null) => {
    if (unidad) {
      setEditingId(unidad.id);
      setFormData({
        tipo_derecho: unidad.tipo_derecho,
        area_registral: unidad.area_registral,
        fecha_registro: unidad.fecha_registro ? unidad.fecha_registro.split('T')[0] : ''
      });
    } else {
      setEditingId(null);
      setFormData({ tipo_derecho: '', area_registral: '', fecha_registro: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este registro?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-panel">
      <div className="flex-between">
        <h1 className="page-title">Unidad Administrativa</h1>
        <button className="btn" onClick={() => openModal()}><Plus size={18}/> Nuevo Registro</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo Derecho</th>
              <th>Área Registral</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.tipo_derecho}</td>
                <td>{u.area_registral}</td>
                <td>{new Date(u.fecha_registro).toLocaleDateString()}</td>
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
            {unidades.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>No hay datos registrados.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar' : 'Crear'} Unidad Administrativa</h2>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Derecho</label>
                <input type="text" className="form-control" required value={formData.tipo_derecho} onChange={e => setFormData({...formData, tipo_derecho: e.target.value})} placeholder="Ej: Dominio, Posesion"/>
              </div>
              <div className="form-group">
                <label>Área Registral (m²)</label>
                <input type="number" step="0.01" className="form-control" required value={formData.area_registral} onChange={e => setFormData({...formData, area_registral: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Fecha de Registro</label>
                <input type="date" className="form-control" required value={formData.fecha_registro} onChange={e => setFormData({...formData, fecha_registro: e.target.value})} />
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

export default AdministrativaPage;

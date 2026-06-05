import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/interesado';

const InteresadosPage = () => {
  const [interesados, setInteresados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ba_unidad_id: '', tipo_documento: 'CC', numero_documento: '', nombre_completo: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setInteresados(res.data);
    } catch (err) { console.error(err); }
  };

  const openModal = (interesado = null) => {
    if (interesado) {
      setEditingId(interesado.id);
      setFormData({
        ba_unidad_id: interesado.ba_unidad_id,
        tipo_documento: interesado.tipo_documento,
        numero_documento: interesado.numero_documento,
        nombre_completo: interesado.nombre_completo
      });
    } else {
      setEditingId(null);
      setFormData({ ba_unidad_id: '', tipo_documento: 'CC', numero_documento: '', nombre_completo: '' });
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
    } catch (err) { alert('Error guardando. Asegurese de que exista la Unidad Administrativa.\n' + err.message); }
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
        <h1 className="page-title">Interesados</h1>
        <button className="btn" onClick={() => openModal()}><Plus size={18}/> Nuevo Interesado</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Unidad Admin (ID)</th>
              <th>Tipo Doc.</th>
              <th>Nro Documento</th>
              <th>Nombre Completo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {interesados.map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.ba_unidad_id}</td>
                <td>{i.tipo_documento}</td>
                <td>{i.numero_documento}</td>
                <td>{i.nombre_completo}</td>
                <td>
                  <button className="btn btn-secondary" style={{padding: '0.5rem', marginRight: '0.5rem'}} onClick={() => openModal(i)}>
                    <Edit size={16}/>
                  </button>
                  <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(i.id)}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            {interesados.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center'}}>No hay interesados.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar' : 'Crear'} Interesado</h2>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID Unidad Administrativa</label>
                <input type="number" className="form-control" required value={formData.ba_unidad_id} onChange={e => setFormData({...formData, ba_unidad_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tipo Documento</label>
                <select className="form-control" value={formData.tipo_documento} onChange={e => setFormData({...formData, tipo_documento: e.target.value})}>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
              <div className="form-group">
                <label>Número Documento</label>
                <input type="text" className="form-control" required value={formData.numero_documento} onChange={e => setFormData({...formData, numero_documento: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" className="form-control" required value={formData.nombre_completo} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
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

export default InteresadosPage;

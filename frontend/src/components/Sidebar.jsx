import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Users, FolderTree, Crosshair, Image } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">SINIC V1.0</div>
      <nav>
        <NavLink to="/administrativa" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <FolderTree size={20} /> Unidad Administrativa
        </NavLink>
        <NavLink to="/espacial" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Map size={20} /> Unidad Espacial
        </NavLink>
        <NavLink to="/interesados" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} /> Interesados
        </NavLink>
        <NavLink to="/topografia" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Crosshair size={20} /> Topografía
        </NavLink>
        <NavLink to="/cartografia" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Image size={20} /> Cartografía
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

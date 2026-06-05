import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdministrativaPage from './pages/AdministrativaPage';
import EspacialPage from './pages/EspacialPage';
import InteresadosPage from './pages/InteresadosPage';
import TopografiaPage from './pages/TopografiaPage';
import CartografiaPage from './pages/CartografiaPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/administrativa" replace />} />
            <Route path="/administrativa" element={<AdministrativaPage />} />
            <Route path="/espacial" element={<EspacialPage />} />
            <Route path="/interesados" element={<InteresadosPage />} />
            <Route path="/topografia" element={<TopografiaPage />} />
            <Route path="/cartografia" element={<CartografiaPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

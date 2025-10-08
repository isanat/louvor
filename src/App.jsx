import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout";

// Páginas - Comum
import SelecaoPerfil from "../Pages/SelecaoPerfil";

// Páginas - Músico
import DashboardMusico from "../Pages/DashboardMusico";
import AgendaMusico from "../Pages/AgendaMusico";
import PerfilMusico from "../Pages/PerfilMusico";
import CadastroMusico from "../Pages/CadastroMusico";
import AguardandoAprovacao from "../Pages/AguardandoAprovacao";

// Páginas - Diretor
import DashboardDiretor from "../Pages/DashboardDiretor";
import BuscarMusicos from "../Pages/BuscarMusicos";
import PerfilMusicoView from "../Pages/PerfilMusicoView";
import AprovarMusicos from "../Pages/AprovarMusicos";
import MinhaIgreja from "../Pages/MinhaIgreja";
import PerfilDiretor from "../Pages/PerfilDiretor";

// Páginas - Compartilhadas
import VotacaoDiretor from "../Pages/VotacaoDiretor";
import HistoricoEventos from "../Pages/HistoricoEventos";
import Estatisticas from "../Pages/Estatisticas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Navigate to="/selecao-perfil" replace />} />
        
        {/* Seleção de perfil */}
        <Route path="/selecao-perfil" element={<Layout><SelecaoPerfil /></Layout>} />
        
        {/* Rotas do Músico */}
        <Route path="/musico/dashboard" element={<Layout><DashboardMusico /></Layout>} />
        <Route path="/musico/agenda" element={<Layout><AgendaMusico /></Layout>} />
        <Route path="/musico/perfil" element={<Layout><PerfilMusico /></Layout>} />
        <Route path="/musico/cadastro" element={<Layout><CadastroMusico /></Layout>} />
        <Route path="/musico/aguardando" element={<Layout><AguardandoAprovacao /></Layout>} />
        
        {/* Rotas do Diretor */}
        <Route path="/diretor/dashboard" element={<Layout><DashboardDiretor /></Layout>} />
        <Route path="/diretor/buscar" element={<Layout><BuscarMusicos /></Layout>} />
        <Route path="/diretor/perfil-musico" element={<Layout><PerfilMusicoView /></Layout>} />
        <Route path="/diretor/aprovar" element={<Layout><AprovarMusicos /></Layout>} />
        <Route path="/diretor/igreja" element={<Layout><MinhaIgreja /></Layout>} />
        <Route path="/diretor/perfil" element={<Layout><PerfilDiretor /></Layout>} />
        
        {/* Rotas compartilhadas */}
        <Route path="/votacao" element={<Layout><VotacaoDiretor /></Layout>} />
        <Route path="/historico" element={<Layout><HistoricoEventos /></Layout>} />
        <Route path="/estatisticas" element={<Layout><Estatisticas /></Layout>} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/selecao-perfil" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
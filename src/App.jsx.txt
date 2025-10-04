import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Páginas - Comum
import SelecaoPerfil from "./pages/SelecaoPerfil";

// Páginas - Músico
import DashboardMusico from "./pages/DashboardMusico";
import AgendaMusico from "./pages/AgendaMusico";
import PerfilMusico from "./pages/PerfilMusico";
import CadastroMusico from "./pages/CadastroMusico";
import AguardandoAprovacao from "./pages/AguardandoAprovacao";

// Páginas - Diretor
import DashboardDiretor from "./pages/DashboardDiretor";
import BuscarMusicos from "./pages/BuscarMusicos";
import PerfilMusicoView from "./pages/PerfilMusicoView";
import AprovarMusicos from "./pages/AprovarMusicos";
import MinhaIgreja from "./pages/MinhaIgreja";
import PerfilDiretor from "./pages/PerfilDiretor";

// Páginas - Compartilhadas
import VotacaoDiretor from "./pages/VotacaoDiretor";
import HistoricoEventos from "./pages/HistoricoEventos";
import Estatisticas from "./pages/Estatisticas";

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
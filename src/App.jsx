import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Página de Seleção de Perfil
function SelecaoPerfil() {
  const navegarPara = (perfil) => {
    if (perfil === "musico") {
      window.location.href = "/musico/dashboard";
    } else {
      window.location.href = "/diretor/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bem-vindo ao Louvor Conectado
          </h1>
          <p className="text-lg text-gray-600">
            Como você gostaria de usar o aplicativo?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => navegarPara("musico")}
            className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:scale-105 transition-transform duration-300 border border-gray-200"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Sou Músico/Cantor
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Quero disponibilizar meu talento musical para servir em cultos e eventos
            </p>
          </button>

          <button
            onClick={() => navegarPara("diretor")}
            className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:scale-105 transition-transform duration-300 border border-gray-200"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Sou Diretor de Música
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Preciso agendar músicos e cantores para os cultos da minha igreja
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Páginas básicas
function DashboardMusico() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Músico</h1>
          <p className="text-gray-600 mb-6">Área do músico - em desenvolvimento</p>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ✅ Página do músico funcionando!
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardDiretor() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Diretor</h1>
          <p className="text-gray-600 mb-6">Área do diretor - em desenvolvimento</p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Página do diretor funcionando!
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Navigate to="/selecao-perfil" replace />} />
        
        {/* Seleção de perfil */}
        <Route path="/selecao-perfil" element={<SelecaoPerfil />} />
        
        {/* Páginas do Músico */}
        <Route path="/musico/dashboard" element={<DashboardMusico />} />
        
        {/* Páginas do Diretor */}
        <Route path="/diretor/dashboard" element={<DashboardDiretor />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/selecao-perfil" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
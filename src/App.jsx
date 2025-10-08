import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componente simples para testar
function TestPage({ title, description }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Página funcionando!
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
        <Route path="/" element={<Navigate to="/teste" replace />} />
        
        {/* Página de teste */}
        <Route 
          path="/teste" 
          element={
            <TestPage 
              title="Louvor Conectado" 
              description="Sistema funcionando corretamente!" 
            />
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/teste" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
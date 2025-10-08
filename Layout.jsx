import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, User, Music, Users, Settings } from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const getCurrentUserType = () => {
    // Simulação - substitua pela sua implementação real
    return "musico"; // ou "diretor"
  };

  const userType = getCurrentUserType();

  const getNavigationItems = () => {
    if (userType === "musico") {
      return [
        { path: "/musico/dashboard", icon: Home, label: "Início" },
        { path: "/musico/agenda", icon: Calendar, label: "Agenda" },
        { path: "/musico/perfil", icon: User, label: "Perfil" }
      ];
    } else {
      return [
        { path: "/diretor/dashboard", icon: Home, label: "Início" },
        { path: "/diretor/buscar", icon: Users, label: "Músicos" },
        { path: "/diretor/igreja", icon: Settings, label: "Igreja" }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/selecao-perfil")}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-3">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Louvor Conectado</h1>
                <p className="text-xs text-gray-500">Sistema de Agendamento</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {userType === "musico" ? "Músico" : "Diretor"}
                </p>
                <p className="text-xs text-gray-500">Bem-vindo</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {children || <Outlet />}
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex justify-around py-2">
            {getNavigationItems().map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </footer>
    </div>
  );
}

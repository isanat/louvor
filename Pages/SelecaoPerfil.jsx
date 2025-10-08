import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/Entities/User";
import { createPageUrl } from "../utils/index.js";
import { Music, UserCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function SelecaoPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const user = await User.me();
        if (user.userType === "musico") {
          // New logic: check user status for musico
          if (user.status === "pendente_aprovacao") {
            navigate(createPageUrl("AguardandoAprovacao"));
          } else {
            navigate(createPageUrl("DashboardMusico"));
          }
        } else if (user.userType === "diretor") {
          navigate(createPageUrl("DashboardDiretor"));
        }
      } catch (error) {
        console.error("Erro ao verificar perfil:", error);
      }
      setLoading(false);
    };

    checkUserProfile();
  }, [navigate]);

  const selecionarPerfil = async (tipo) => {
    setLoading(true);
    try {
      // New logic: navigate to CadastroMusico for musico type, update user for diretor
      if (tipo === "musico") {
        navigate(createPageUrl("CadastroMusico"));
      } else {
        await User.updateMyUserData({ userType: tipo });
        navigate(createPageUrl("DashboardDiretor"));
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
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
            onClick={() => selecionarPerfil("musico")}
            className="clay-card p-8 text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Sou Músico/Cantor
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Quero disponibilizar meu talento musical para servir em cultos e eventos
            </p>
          </button>

          <button
            onClick={() => selecionarPerfil("diretor")}
            className="clay-card p-8 text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle className="w-12 h-12 text-pink-600" />
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

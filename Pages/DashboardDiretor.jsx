import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Event } from "@/entities/Event";
import { Church } from "@/entities/Church";
import { Button } from "@/Components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

import EventCard from "../Components/diretor/EventCard";
import StatsCard from "../Components/diretor/StatsCard";

export default function DashboardDiretor() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (!currentUser.userType) {
          navigate(createPageUrl("SelecaoPerfil"));
          return;
        }

        if (currentUser.userType !== "diretor") {
          navigate(createPageUrl("DashboardMusico"));
          return;
        }

        const [eventsData, churchesData] = await Promise.all([
          Event.filter({ directorId: currentUser.id }),
          Church.filter({ directorId: currentUser.id })
        ]);

        setEvents(eventsData);
        setChurches(churchesData);

        // Calcular aprovações pendentes (simulado - você pode adicionar uma entidade separada)
        setApprovalCount(0);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const eventosPendentes = events.filter(e => e.status === "pendente");
  const eventosConfirmados = events.filter(e => e.status === "confirmado");
  const proximosEventos = eventosConfirmados
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            Olá, {user?.full_name}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo dos seus agendamentos
          </p>
        </div>

        {approvalCount > 0 && (
          <Link to={createPageUrl("AprovarMusicos")}>
            <div className="clay-card p-6 mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-yellow-800">
                    {approvalCount} Músico{approvalCount > 1 ? 's' : ''} aguardando aprovação
                  </h3>
                  <p className="text-yellow-600 text-sm">
                    Clique para revisar os cadastros pendentes
                  </p>
                </div>
                <Button className="clay-button bg-yellow-500 text-white">
                  Revisar
                </Button>
              </div>
            </div>
          </Link>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Próximos Eventos"
            value={proximosEventos.length}
            icon={Calendar}
            color="from-purple-100 to-purple-200"
            textColor="text-purple-600"
          />
          <StatsCard
            title="Convites Pendentes"
            value={eventosPendentes.length}
            icon={Clock}
            color="from-yellow-100 to-yellow-200"
            textColor="text-yellow-600"
          />
          <StatsCard
            title="Confirmados"
            value={eventosConfirmados.length}
            icon={CheckCircle}
            color="from-green-100 to-green-200"
            textColor="text-green-600"
          />
        </div>

        {eventosPendentes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Aguardando Resposta
            </h2>
            <div className="space-y-4">
              {eventosPendentes.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  church={churches.find(c => c.id === event.churchId)}
                  onUpdate={() => window.location.reload()}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Próximos Eventos Confirmados
          </h2>
          {proximosEventos.length === 0 ? (
            <div className="clay-card p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Você ainda não tem eventos confirmados
              </p>
              <Link to={createPageUrl("BuscarMusicos")}>
                <Button className="clay-button bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Agendar Primeiro Músico
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proximosEventos.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  church={churches.find(c => c.id === event.churchId)}
                  onUpdate={() => window.location.reload()}
                />
              ))}
            </div>
          )}
        </div>

        <Link to={createPageUrl("BuscarMusicos")}>
          <button className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 clay-button bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </button>
        </Link>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Event } from "@/entities/Event";
import { Church } from "@/entities/Church";
import { MusicianProfile } from "@/entities/MusicianProfile";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

import ConviteCard from "../components/musico/ConviteCard";
import ProximoEventoCard from "../components/musico/ProximoEventoCard";
import StatsCard from "../components/diretor/StatsCard";

export default function DashboardMusico() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [churches, setChurches] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (!currentUser.userType) {
          navigate(createPageUrl("SelecaoPerfil"));
          return;
        }

        if (currentUser.userType !== "musico") {
          navigate(createPageUrl("DashboardDiretor"));
          return;
        }

        const eventsData = await Event.filter({ musicianId: currentUser.id });
        setEvents(eventsData);

        const allChurches = await Church.list();
        const churchMap = {};
        allChurches.forEach(church => {
          churchMap[church.id] = church;
        });
        setChurches(churchMap);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const convitesPendentes = events.filter(e => e.status === "pendente");
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
            Seus convites e compromissos musicais
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Novos Convites"
            value={convitesPendentes.length}
            icon={Clock}
            color="from-yellow-100 to-yellow-200"
            textColor="text-yellow-600"
          />
          <StatsCard
            title="Próximos Eventos"
            value={proximosEventos.length}
            icon={Calendar}
            color="from-purple-100 to-purple-200"
            textColor="text-purple-600"
          />
          <StatsCard
            title="Confirmados"
            value={eventosConfirmados.length}
            icon={CheckCircle}
            color="from-green-100 to-green-200"
            textColor="text-green-600"
          />
        </div>

        {convitesPendentes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Novos Convites
            </h2>
            <div className="space-y-4">
              {convitesPendentes.map((event) => (
                <ConviteCard
                  key={event.id}
                  event={event}
                  church={churches[event.churchId]}
                  onUpdate={() => window.location.reload()}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Meus Próximos Compromissos
          </h2>
          {proximosEventos.length === 0 ? (
            <div className="clay-card p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                Você não tem compromissos confirmados no momento
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {proximosEventos.map((event) => (
                <ProximoEventoCard
                  key={event.id}
                  event={event}
                  church={churches[event.churchId]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
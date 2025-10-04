import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Event } from "@/entities/Event";
import { Church } from "@/entities/Church";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoricoEventos() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [churches, setChurches] = useState({});
  const [filter, setFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      let eventsData;
      if (currentUser.userType === "musico") {
        eventsData = await Event.filter({ musicianId: currentUser.id });
      } else {
        eventsData = await Event.filter({ directorId: currentUser.id });
      }

      const pastEvents = eventsData.filter(e => new Date(e.eventDate) < new Date());
      setEvents(pastEvents);

      const allChurches = await Church.list();
      const churchMap = {};
      allChurches.forEach(c => churchMap[c.id] = c);
      setChurches(churchMap);

    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "confirmado":
      case "concluido":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "recusado":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "cancelado_pelo_musico":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "confirmado":
      case "concluido":
        return "from-green-100 to-green-200 text-green-700";
      case "recusado":
        return "from-red-100 to-red-200 text-red-700";
      case "cancelado_pelo_musico":
        return "from-orange-100 to-orange-200 text-orange-700";
      default:
        return "from-gray-100 to-gray-200 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      confirmado: "Confirmado",
      concluido: "Concluído",
      recusado: "Recusado",
      cancelado_pelo_musico: "Cancelado",
      pendente: "Pendente"
    };
    return labels[status] || status;
  };

  const filteredEvents = events.filter(e => {
    if (filter === "todos") return true;
    return e.status === filter;
  });

  const sortedEvents = filteredEvents.sort((a, b) => 
    new Date(b.eventDate) - new Date(a.eventDate)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Histórico de Eventos
          </h1>
          <p className="text-gray-600">
            Seus eventos passados
          </p>
        </div>

        <div className="clay-card p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-gray-700">Filtrar por:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="confirmado">Confirmados</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
                <SelectItem value="recusado">Recusados</SelectItem>
                <SelectItem value="cancelado_pelo_musico">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 ml-auto">
              {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="clay-card p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">Nenhum Evento Encontrado</h2>
            <p className="text-gray-600">
              Não há eventos passados com esse filtro.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => {
              const church = churches[event.churchId];
              return (
                <div key={event.id} className="clay-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{event.eventType}</h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(event.eventDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        {church && (
                          <p className="text-gray-600">
                            <span className="font-semibold">Igreja:</span> {church.name}
                          </p>
                        )}
                        {user.userType === "diretor" && event.musicianName && (
                          <p className="text-gray-600">
                            <span className="font-semibold">Músico:</span> {event.musicianName}
                          </p>
                        )}
                        {user.userType === "musico" && event.directorName && (
                          <p className="text-gray-600">
                            <span className="font-semibold">Convidado por:</span> {event.directorName}
                          </p>
                        )}
                      </div>

                      {event.directorNotes && (
                        <div className="mt-3 p-3 rounded-xl bg-purple-50">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Observações:</span> {event.directorNotes}
                          </p>
                        </div>
                      )}

                      {event.cancellationReason && (
                        <div className="mt-3 p-3 rounded-xl bg-orange-50">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Motivo do cancelamento:</span> {event.cancellationReason}
                          </p>
                        </div>
                      )}

                      {event.musicianNotes && event.status === "recusado" && (
                        <div className="mt-3 p-3 rounded-xl bg-red-50">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Motivo da recusa:</span> {event.musicianNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
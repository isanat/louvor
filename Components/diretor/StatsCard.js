import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, User, Clock } from "lucide-react";

export default function EventCard({ event, church }) {
  const statusColors = {
    pendente: "from-yellow-100 to-yellow-200 text-yellow-700",
    confirmado: "from-green-100 to-green-200 text-green-700",
    recusado: "from-red-100 to-red-200 text-red-700",
    cancelado_pelo_musico: "from-orange-100 to-orange-200 text-orange-700"
  };

  const statusLabels = {
    pendente: "Aguardando",
    confirmado: "Confirmado",
    recusado: "Recusado",
    cancelado_pelo_musico: "Cancelado"
  };

  return (
    <div className="clay-card p-6 hover:scale-102 transition-transform">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg">{event.musicianName || "Músico"}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${statusColors[event.status]}`}>
              {statusLabels[event.status]}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.eventDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.eventType}</span>
            </div>
            {church && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{church.name}</span>
              </div>
            )}
          </div>
          {event.directorNotes && (
            <div className="mt-3 p-3 rounded-xl bg-purple-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Suas observações:</span> {event.directorNotes}
              </p>
            </div>
          )}
          {event.musicianNotes && event.status === "recusado" && (
            <div className="mt-3 p-3 rounded-xl bg-red-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Motivo:</span> {event.musicianNotes}
              </p>
            </div>
          )}
          {event.cancellationReason && event.status === "cancelado_pelo_musico" && (
            <div className="mt-3 p-3 rounded-xl bg-orange-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Motivo do cancelamento:</span> {event.cancellationReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
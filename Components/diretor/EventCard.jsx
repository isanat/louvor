import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/Components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function EventCard({ event, church, onUpdate }) {
  const handleConfirm = async () => {
    // Implementar confirmação do evento
    console.log("Confirmar evento:", event.id);
  };

  const handleCancel = async () => {
    // Implementar cancelamento do evento
    console.log("Cancelar evento:", event.id);
  };

  return (
    <div className="clay-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">
            {event.eventType}
          </h3>
          {church && (
            <>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <User className="w-4 h-4" />
                <span>{church.name}</span>
              </div>
              {church.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{church.address}</span>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-2 text-purple-600 mt-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {format(new Date(event.eventDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          {event.directorNotes && (
            <div className="mt-3 p-3 rounded-xl bg-purple-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Observações:</span> {event.directorNotes}
              </p>
            </div>
          )}
          {event.status === "pendente" && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleConfirm}
                className="clay-button bg-green-500 text-white text-sm px-4 py-2"
              >
                Confirmar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="clay-button border-red-300 text-red-600 text-sm px-4 py-2"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

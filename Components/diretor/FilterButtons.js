import React, { useState } from "react";
import { Event } from "@/entities/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ConviteCard({ event, church, onUpdate }) {
  const [responding, setResponding] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleAccept = async () => {
    setResponding(true);
    try {
      await Event.update(event.id, { status: "confirmado" });
      onUpdate();
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
    }
    setResponding(false);
  };

  const handleReject = async () => {
    setResponding(true);
    try {
      await Event.update(event.id, { 
        status: "recusado",
        musicianNotes: rejectReason
      });
      onUpdate();
    } catch (error) {
      console.error("Erro ao recusar convite:", error);
    }
    setResponding(false);
  };

  return (
    <div className="clay-card p-6 border-2 border-yellow-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg">Novo Convite!</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700">
              Aguardando
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
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
            {event.directorName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Convidado por: {event.directorName}</span>
              </div>
            )}
          </div>
          {event.directorNotes && (
            <div className="mb-4 p-3 rounded-xl bg-purple-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Observações:</span> {event.directorNotes}
              </p>
            </div>
          )}
          
          {!showRejectForm ? (
            <div className="flex gap-3">
              <Button
                onClick={handleAccept}
                disabled={responding}
                className="clay-button flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aceitar
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                disabled={responding}
                variant="outline"
                className="clay-button flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Recusar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Por favor, informe o motivo da recusa (opcional)"
                className="rounded-2xl"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleReject}
                  disabled={responding}
                  className="clay-button flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white"
                >
                  Confirmar Recusa
                </Button>
                <Button
                  onClick={() => setShowRejectForm(false)}
                  variant="outline"
                  className="clay-button"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
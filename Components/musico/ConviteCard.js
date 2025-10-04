import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProximoEventoCard({ event, church }) {
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [cancellationReason, setCancellationReason] = React.useState("");
  const [cancelling, setCancelling] = React.useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await Event.update(event.id, {
        status: "cancelado_pelo_musico",
        cancellationReason: cancellationReason
      });

      const currentUser = await User.me();
      const newCount = (currentUser.cancellationCount || 0) + 1;
      await User.updateMyUserData({ cancellationCount: newCount });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao cancelar:", error);
    }
    setCancelling(false);
  };

  return (
    <div className="clay-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">{event.eventType}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(event.eventDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-700">
              Confirmado
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {church && (
              <>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{church.name}</span>
                </div>
                {church.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{church.address}</span>
                  </div>
                )}
              </>
            )}
            {event.directorName && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
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

          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="clay-button w-full text-orange-600 hover:bg-orange-50"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Não Poderei Comparecer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar Compromisso?</AlertDialogTitle>
                <AlertDialogDescription>
                  O diretor será notificado imediatamente. Por favor, informe o motivo do cancelamento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Motivo do cancelamento (opcional)"
                className="rounded-2xl"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {cancelling ? "Cancelando..." : "Confirmar Cancelamento"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
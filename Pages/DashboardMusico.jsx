import React, { useState, useEffect } from "react";
import { User } from "@/Entities/User";
import { Event } from "@/Entities/Event";
import { Church } from "@/Entities/Church";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Clock, User as UserIcon } from "lucide-react";

export default function DashboardMusico() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [churches, setChurches] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsOnDate, setEventsOnDate] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        const eventsData = await Event.filter({ 
          musicianId: currentUser.id,
          status: "confirmado"
        });
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
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setEventsOnDate([]);
      return;
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    });

    setEventsOnDate(filtered);
  }, [selectedDate, events]);

  const eventDates = events.map(e => new Date(e.eventDate));

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Minha Agenda
          </h1>
          <p className="text-gray-600">
            Visualize todos os seus compromissos confirmados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="clay-card p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Calendário
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-3xl"
              modifiers={{
                event: eventDates
              }}
              modifiersStyles={{
                event: {
                  backgroundColor: '#E8D5F2',
                  borderRadius: '50%',
                  fontWeight: 'bold'
                }
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            {eventsOnDate.length === 0 ? (
              <div className="clay-card p-8 text-center">
                <p className="text-gray-600">
                  Nenhum evento nesta data
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsOnDate.map((event) => {
                  const church = churches[event.churchId];
                  return (
                    <div key={event.id} className="clay-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            {event.eventType}
                          </h3>
                          {church && (
                            <>
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <UserIcon className="w-4 h-4" />
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
                          <p className="text-sm text-purple-600 mt-2">
                            {format(new Date(event.eventDate), "HH:mm", { locale: ptBR })}
                          </p>
                          {event.directorNotes && (
                            <div className="mt-3 p-3 rounded-xl bg-purple-50">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Observações:</span> {event.directorNotes}
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
      </div>
    </div>
  );
}
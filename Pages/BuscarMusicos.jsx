import React, { useState, useEffect } from "react";
import { User } from "@/Entities/User";
import { Event } from "@/Entities/Event";
import { MusicianProfile } from "@/Entities/MusicianProfile";
import { Church } from "@/Entities/Church";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import MusicianCard from "../Components/diretor/MusicianCard";
import FilterButtons from "../Components/diretor/FilterButtons";

export default function BuscarMusicos() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableMusicians, setAvailableMusicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [currentUser, setCurrentUser] = useState(null);
  const [myChurch, setMyChurch] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const churches = await Church.filter({ directorId: user.id });
      if (churches.length > 0) {
        setMyChurch(churches[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário ou igreja:", error);
    }
  };

  const buscarMusicosDisponiveis = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setSearched(true);

    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const allEvents = await Event.list();
      const eventsOnDate = allEvents.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= startOfDay && 
               eventDate <= endOfDay && 
               (event.status === "confirmado" || event.status === "pendente");
      });

      const busyMusicianIds = eventsOnDate.map(e => e.musicianId);

      const allUsers = await User.list();
      let musicians = allUsers.filter(u => 
        u.userType === "musico" && 
        u.status === "aprovado" &&
        !busyMusicianIds.includes(u.id)
      );

      if (filter === "minha_igreja" && myChurch) {
        musicians = musicians.filter(m => m.homeChurchId === myChurch.id);
      } else if (filter === "minha_cidade" && myChurch) {
        const allChurches = await Church.list();
        const churchIds = allChurches
          .filter(c => c.city === myChurch.city)
          .map(c => c.id);
        musicians = musicians.filter(m => churchIds.includes(m.homeChurchId));
      } else if (filter === "meu_estado" && myChurch) {
        const allChurches = await Church.list();
        const churchIds = allChurches
          .filter(c => c.state === myChurch.state)
          .map(c => c.id);
        musicians = musicians.filter(m => churchIds.includes(m.homeChurchId));
      }

      const profiles = await MusicianProfile.list();
      const musiciansWithProfiles = musicians.map(musician => {
        const profile = profiles.find(p => p.userId === musician.id);
        return { ...musician, profile };
      });

      musiciansWithProfiles.sort((a, b) => 
        (a.cancellationCount || 0) - (b.cancellationCount || 0)
      );

      setAvailableMusicians(musiciansWithProfiles);
    } catch (error) {
      console.error("Erro ao buscar músicos:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("DashboardDiretor")}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Buscar Músicos
            </h1>
            <p className="text-gray-600">
              Selecione uma data para ver os músicos disponíveis
            </p>
          </div>
        </div>

        <div className="clay-card p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Selecione a Data do Evento
          </h2>
          
          <FilterButtons 
            filter={filter} 
            onFilterChange={setFilter}
            myChurch={myChurch}
          />

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-3xl border-none shadow-none"
              disabled={(date) => date < new Date()}
            />
            <div className="flex-1 w-full">
              {selectedDate && (
                <div className="clay-card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  <p className="text-sm text-gray-600 mb-2">Data Selecionada:</p>
                  <p className="text-2xl font-bold text-purple-600 mb-4">
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <Button
                    onClick={buscarMusicosDisponiveis}
                    disabled={loading}
                    className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3"
                  >
                    {loading ? (
                      "Buscando..."
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Buscar Músicos Disponíveis
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {searched && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {availableMusicians.length > 0 
                ? `${availableMusicians.length} Músicos Disponíveis` 
                : "Nenhum Músico Disponível"}
            </h2>
            {availableMusicians.length === 0 ? (
              <div className="clay-card p-8 text-center">
                <p className="text-gray-600">
                  Não há músicos disponíveis para esta data com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMusicians.map((musician) => (
                  <MusicianCard
                    key={musician.id}
                    musician={musician}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
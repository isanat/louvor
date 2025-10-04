
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { MusicianProfile } from "@/entities/MusicianProfile";
import { Event } from "@/entities/Event";
import { Church } from "@/entities/Church";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Music, Video, Award, Send, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PerfilMusicoView() {
  const navigate = useNavigate();
  const [musician, setMusician] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [churches, setChurches] = useState([]);
  const [sending, setSending] = useState(false);
  const [inviteData, setInviteData] = useState({
    churchId: "",
    eventType: "Culto Matinal",
    eventTime: "09:00",
    directorNotes: ""
  });

  const urlParams = new URLSearchParams(window.location.search);
  const musicianId = urlParams.get("musicianId");
  const dateParam = urlParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);

        const allUsers = await User.list();
        const targetMusician = allUsers.find(u => u.id === musicianId);
        setMusician(targetMusician);

        const profiles = await MusicianProfile.filter({ userId: musicianId });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }

        const userChurches = await Church.filter({ directorId: user.id });
        setChurches(userChurches);
        if (userChurches.length > 0) {
          setInviteData(prev => ({ ...prev, churchId: userChurches[0].id }));
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, [musicianId]);

  const handleSendInvite = async () => {
    if (!inviteData.churchId) {
      alert("Por favor, selecione uma igreja");
      return;
    }
    if (!musician || !currentUser) {
      alert("Dados do músico ou diretor não carregados. Tente novamente.");
      return;
    }

    setSending(true);
    try {
      const eventDateTime = new Date(selectedDate);
      const [hours, minutes] = inviteData.eventTime.split(":");
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await Event.create({
        churchId: inviteData.churchId,
        musicianId: musicianId,
        musicianName: musician.full_name,
        musicianEmail: musician.email,
        musicianPhone: musician.phone,
        musicianWhatsapp: musician.whatsappNumber,
        directorId: currentUser.id,
        directorName: currentUser.full_name,
        directorEmail: currentUser.email,
        eventDate: eventDateTime.toISOString(),
        eventType: inviteData.eventType,
        status: "pendente",
        directorNotes: inviteData.directorNotes
      });

      navigate(createPageUrl("DashboardDiretor"));
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro ao enviar convite. Tente novamente.");
    }
    setSending(false);
  };

  const openWhatsApp = () => {
    if (musician?.whatsappNumber) {
      const cleanNumber = musician.whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanNumber}`, '_blank');
    }
  };

  if (!musician) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  const getReputationInfo = () => {
    const count = musician.cancellationCount || 0;
    if (count === 0) return { text: "Nunca cancelou", color: "text-green-600", bg: "bg-green-50" };
    if (count === 1) return { text: "1 cancelamento", color: "text-blue-600", bg: "bg-blue-50" };
    return { text: `${count} cancelamentos`, color: "text-red-600", bg: "bg-red-50" };
  };

  const reputation = getReputationInfo();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("BuscarMusicos")}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Perfil do Músico
            </h1>
          </div>
        </div>

        <div className="clay-card p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              {musician.profileImageUrl ? (
                <img src={musician.profileImageUrl} alt={musician.full_name} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-16 h-16 text-purple-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">{musician.full_name}</h2>
            <p className="text-gray-600">{musician.email}</p>
            
            <div className="flex gap-3 mt-4">
              {musician?.whatsappNumber && (
                <Button
                  onClick={openWhatsApp}
                  className="clay-button bg-gradient-to-r from-green-400 to-green-500 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${reputation.bg} mb-6`}>
            <p className={`text-sm font-semibold ${reputation.color} text-center`}>
              Reputação: {reputation.text}
            </p>
          </div>

          {profile && (
            <div className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Biografia</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {profile.videoUrl && (
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                    <Video className="w-5 h-5" />
                    Vídeo de Apresentação
                  </h3>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <iframe
                      src={profile.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allowFullScreen
                      title="Vídeo de Apresentação do Músico"
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {profile.vocalRange && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Extensão Vocal</h3>
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium">
                      {profile.vocalRange}
                    </span>
                  </div>
                )}

                {profile.yearsExperience > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                      <Award className="w-5 h-5" />
                      Experiência
                    </h3>
                    <p className="text-gray-600">{profile.yearsExperience} anos</p>
                  </div>
                )}
              </div>

              {profile.instruments && profile.instruments.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Instrumentos</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.instruments.map((instrument) => (
                      <span
                        key={instrument}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="clay-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Convidar para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="church-select">Igreja</Label>
              <Select 
                value={inviteData.churchId}
                onValueChange={(value) => setInviteData({ ...inviteData, churchId: value })}
              >
                <SelectTrigger id="church-select" className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Selecione a igreja" />
                </SelectTrigger>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event-type-select">Tipo de Evento</Label>
              <Select 
                value={inviteData.eventType}
                onValueChange={(value) => setInviteData({ ...inviteData, eventType: value })}
              >
                <SelectTrigger id="event-type-select" className="mt-2 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Culto Matinal">Culto Matinal</SelectItem>
                  <SelectItem value="Culto Vespertino">Culto Vespertino</SelectItem>
                  <SelectItem value="Culto de Oração">Culto de Oração</SelectItem>
                  <SelectItem value="Evento Especial">Evento Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event-time-input">Horário</Label>
              <Input
                id="event-time-input"
                type="time"
                value={inviteData.eventTime}
                onChange={(e) => setInviteData({ ...inviteData, eventTime: e.target.value })}
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="director-notes-textarea">Observações ou Repertório Sugerido (Opcional)</Label>
              <Textarea
                id="director-notes-textarea"
                value={inviteData.directorNotes}
                onChange={(e) => setInviteData({ ...inviteData, directorNotes: e.target.value })}
                placeholder="Adicione informações relevantes para o músico..."
                className="mt-2 rounded-2xl min-h-32"
              />
            </div>

            <Button
              onClick={handleSendInvite}
              disabled={sending || !inviteData.churchId}
              className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 text-lg"
            >
              {sending ? (
                "Enviando Convite..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

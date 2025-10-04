import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Church } from "@/entities/Church";
import { Button } from "@/components/ui/button";
import { Music, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AprovarMusicos() {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingMusicians, setPendingMusicians] = useState([]);
  const [churches, setChurches] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const allChurches = await Church.filter({ directorId: user.id });
      const churchMap = {};
      allChurches.forEach(c => churchMap[c.id] = c);
      setChurches(churchMap);

      const churchIds = allChurches.map(c => c.id);
      const allUsers = await User.list();
      
      const pending = allUsers.filter(u => 
        u.userType === "musico" && 
        u.status === "pendente_aprovacao" &&
        churchIds.includes(u.homeChurchId)
      );
      
      setPendingMusicians(pending);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const handleApprove = async (musicianId) => {
    try {
      const musician = pendingMusicians.find(m => m.id === musicianId);
      await User.update(musicianId, { status: "aprovado" });
      alert(`${musician.full_name} foi aprovado com sucesso!`);
      loadData();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
    }
  };

  const handleReject = async (musicianId) => {
    if (!confirm("Tem certeza que deseja rejeitar este músico?")) return;
    
    try {
      await User.delete(musicianId);
      alert("Músico rejeitado");
      loadData();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={createPageUrl("DashboardDiretor")}>
            <Button variant="ghost" className="mb-4">← Voltar</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Aprovar Músicos
          </h1>
          <p className="text-gray-600">
            Músicos aguardando sua aprovação
          </p>
        </div>

        {pendingMusicians.length === 0 ? (
          <div className="clay-card p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Nenhuma aprovação pendente
            </h2>
            <p className="text-gray-600">
              Todos os músicos foram aprovados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMusicians.map((musician) => {
              const church = churches[musician.homeChurchId];
              return (
                <div key={musician.id} className="clay-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0">
                      {musician.profileImageUrl ? (
                        <img src={musician.profileImageUrl} alt={musician.full_name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Music className="w-8 h-8 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{musician.full_name}</h3>
                          <p className="text-sm text-gray-600">{musician.email}</p>
                          {church && (
                            <p className="text-sm text-gray-500 mt-1">
                              Igreja: {church.name}
                            </p>
                          )}
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Aguardando
                        </span>
                      </div>
                      
                      {musician.whatsappNumber && (
                        <p className="text-sm text-gray-600 mb-4">
                          WhatsApp: {musician.whatsappNumber}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(musician.id)}
                          className="clay-button flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          onClick={() => handleReject(musician.id)}
                          variant="outline"
                          className="clay-button flex-1 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
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
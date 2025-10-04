import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Event } from "@/entities/Event";
import { Church } from "@/entities/Church";
import { Calendar, TrendingUp, Award, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function Estatisticas() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    pendentes: 0,
    recusados: 0,
    cancelados: 0,
    concluidos: 0,
    taxaAceitacao: 0,
    taxaCancelamento: 0,
    proximosMes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      let events;
      if (currentUser.userType === "musico") {
        events = await Event.filter({ musicianId: currentUser.id });
      } else {
        events = await Event.filter({ directorId: currentUser.id });
      }

      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const total = events.length;
      const confirmados = events.filter(e => e.status === "confirmado").length;
      const pendentes = events.filter(e => e.status === "pendente").length;
      const recusados = events.filter(e => e.status === "recusado").length;
      const cancelados = events.filter(e => e.status === "cancelado_pelo_musico").length;
      const concluidos = events.filter(e => e.status === "concluido").length;
      const proximosMes = events.filter(e => {
        const eventDate = new Date(e.eventDate);
        return eventDate >= now && eventDate <= nextMonth;
      }).length;

      const totalRespondidos = confirmados + recusados;
      const taxaAceitacao = totalRespondidos > 0 
        ? Math.round((confirmados / totalRespondidos) * 100) 
        : 0;

      const totalOportunidades = confirmados + cancelados;
      const taxaCancelamento = totalOportunidades > 0
        ? Math.round((cancelados / totalOportunidades) * 100)
        : 0;

      setStats({
        total,
        confirmados,
        pendentes,
        recusados,
        cancelados,
        concluidos,
        taxaAceitacao,
        taxaCancelamento,
        proximosMes
      });

    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
    setLoading(false);
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Estatísticas
          </h1>
          <p className="text-gray-600">
            Análise detalhada dos seus eventos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <span className="text-4xl font-bold text-purple-600">{stats.total}</span>
            </div>
            <h3 className="font-bold text-gray-800">Total de Eventos</h3>
            <p className="text-sm text-gray-600">Desde o início</p>
          </div>

          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <span className="text-4xl font-bold text-green-600">{stats.confirmados}</span>
            </div>
            <h3 className="font-bold text-gray-800">Confirmados</h3>
            <p className="text-sm text-gray-600">Eventos aceitos</p>
          </div>

          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <span className="text-4xl font-bold text-blue-600">{stats.proximosMes}</span>
            </div>
            <h3 className="font-bold text-gray-800">Próximo Mês</h3>
            <p className="text-sm text-gray-600">Eventos agendados</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="clay-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Taxa de Aceitação</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold text-purple-600">
                {stats.taxaAceitacao}%
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${stats.taxaAceitacao}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.confirmados} confirmados de {stats.confirmados + stats.recusados} convites
                </p>
              </div>
            </div>
          </div>

          <div className="clay-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">Taxa de Cancelamento</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold text-orange-600">
                {stats.taxaCancelamento}%
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                    style={{ width: `${stats.taxaCancelamento}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.cancelados} cancelamentos de {stats.confirmados + stats.cancelados} eventos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="clay-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumo Geral</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100">
              <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendentes}</p>
              <p className="text-sm font-semibold text-yellow-800">Pendentes</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-3xl font-bold text-green-600 mb-2">{stats.confirmados}</p>
              <p className="text-sm font-semibold text-green-800">Confirmados</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-3xl font-bold text-blue-600 mb-2">{stats.concluidos}</p>
              <p className="text-sm font-semibold text-blue-800">Concluídos</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
              <p className="text-3xl font-bold text-red-600 mb-2">{stats.recusados}</p>
              <p className="text-sm font-semibold text-red-800">Recusados</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100">
              <p className="text-3xl font-bold text-orange-600 mb-2">{stats.cancelados}</p>
              <p className="text-sm font-semibold text-orange-800">Cancelados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
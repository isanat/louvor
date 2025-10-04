import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Church } from "@/entities/Church";
import { DirectorVote } from "@/entities/DirectorVote";
import { Button } from "@/components/ui/button";
import { AlertCircle, ThumbsDown, ThumbsUp, UserX, Users } from "lucide-react";
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

export default function VotacaoDiretor() {
  const [user, setUser] = useState(null);
  const [myChurch, setMyChurch] = useState(null);
  const [currentDirector, setCurrentDirector] = useState(null);
  const [votes, setVotes] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (!currentUser.homeChurchId) {
        setLoading(false);
        return;
      }

      const churches = await Church.filter({ id: currentUser.homeChurchId });
      if (churches.length > 0) {
        const church = churches[0];
        setMyChurch(church);

        if (church.directorId) {
          const allVotes = await DirectorVote.filter({ 
            churchId: church.id,
            candidateId: church.directorId
          });
          setVotes(allVotes);

          const userVote = allVotes.find(v => v.voterId === currentUser.id);
          setMyVote(userVote);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const handleVote = async (voteType) => {
    try {
      if (myVote) {
        await DirectorVote.delete(myVote.id);
      }

      await DirectorVote.create({
        churchId: myChurch.id,
        voterId: user.id,
        candidateId: myChurch.directorId,
        voteType: voteType
      });

      const allVotes = await DirectorVote.filter({ 
        churchId: myChurch.id,
        candidateId: myChurch.directorId
      });

      const revokeVotes = allVotes.filter(v => v.voteType === "revogar");
      if (revokeVotes.length >= 3) {
        await Church.update(myChurch.id, { directorId: "" });
        alert("O diretor foi revogado após 3 votos. A igreja está sem diretor.");
        window.location.reload();
      } else {
        loadData();
      }
    } catch (error) {
      console.error("Erro ao votar:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400 text-xl">Carregando...</div>
      </div>
    );
  }

  if (!myChurch) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Sem Igreja Cadastrada</h2>
            <p className="text-gray-600">
              Você precisa estar vinculado a uma igreja para participar de votações.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!myChurch.directorId) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Votação - {myChurch.name}
            </h1>
          </div>

          <div className="clay-card p-8 text-center">
            <UserX className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-2">Igreja Sem Diretor</h2>
            <p className="text-gray-600 mb-6">
              Esta igreja atualmente não possui um diretor de música.
              Em breve será possível votar para eleger um novo diretor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const revokeVotes = votes.filter(v => v.voteType === "revogar");
  const supportVotes = votes.filter(v => v.voteType === "eleger");

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Gestão Democrática
          </h1>
          <p className="text-gray-600">
            {myChurch.name}
          </p>
        </div>

        <div className="clay-card p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-12 h-12 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold">Diretor de Música Atual</h2>
              <p className="text-gray-600">Gestão democrática e transparente</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
              <div className="flex items-center gap-3 mb-3">
                <ThumbsDown className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-red-800">Votos para Revogar</h3>
              </div>
              <p className="text-4xl font-bold text-red-600 mb-2">{revokeVotes.length}</p>
              <p className="text-sm text-red-700">3 votos necessários para revogar</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-3 mb-3">
                <ThumbsUp className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-green-800">Votos de Apoio</h3>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-2">{supportVotes.length}</p>
              <p className="text-sm text-green-700">Membros satisfeitos</p>
            </div>
          </div>

          {myVote ? (
            <div className={`p-6 rounded-2xl mb-6 ${
              myVote.voteType === "revogar" 
                ? "bg-red-50 border-2 border-red-200" 
                : "bg-green-50 border-2 border-green-200"
            }`}>
              <p className="text-center font-semibold">
                Você votou para {myVote.voteType === "revogar" ? "revogar" : "apoiar"} o diretor atual
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="clay-button w-full bg-red-500 hover:bg-red-600 text-white py-6"
                  disabled={myVote?.voteType === "revogar"}
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  Votar para Revogar Diretor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Voto para Revogar?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Seu voto será registrado. Se 3 ou mais membros da igreja votarem para revogar,
                    o diretor atual será removido do cargo automaticamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleVote("revogar")}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Confirmar Voto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              className="clay-button w-full py-6 bg-green-50 hover:bg-green-100 text-green-700"
              onClick={() => handleVote("eleger")}
              disabled={myVote?.voteType === "eleger"}
            >
              <ThumbsUp className="w-5 h-5 mr-2" />
              Declarar Apoio ao Diretor Atual
            </Button>
          </div>
        </div>

        <div className="clay-card p-6">
          <h3 className="font-bold text-lg mb-3">Como Funciona?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Qualquer membro da igreja pode votar para revogar ou apoiar o diretor</li>
            <li>• São necessários 3 votos de revogação para remover o diretor</li>
            <li>• O processo é transparente e democrático</li>
            <li>• Você pode mudar seu voto a qualquer momento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
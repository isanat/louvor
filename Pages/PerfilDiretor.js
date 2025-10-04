import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Church } from "@/entities/Church";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, AlertCircle } from "lucide-react";

export default function CadastroMusico() {
  const navigate = useNavigate();
  const [churches, setChurches] = useState([]);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    homeChurchId: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChurches();
  }, []);

  const loadChurches = async () => {
    try {
      const allChurches = await Church.list();
      setChurches(allChurches);
    } catch (error) {
      console.error("Erro ao carregar igrejas:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.whatsappNumber || !formData.homeChurchId) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await User.updateMyUserData({
        userType: "musico",
        whatsappNumber: formData.whatsappNumber,
        homeChurchId: formData.homeChurchId,
        status: "pendente_aprovacao",
        cancellationCount: 0
      });
      navigate(createPageUrl("AguardandoAprovacao"));
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="clay-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4">
              <Music className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Complete seu Cadastro
            </h1>
            <p className="text-gray-600 text-center">
              Precisamos de mais algumas informações para você começar
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Número do WhatsApp</Label>
              <Input
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="(00) 00000-0000"
                className="mt-2 rounded-2xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                Os diretores poderão entrar em contato com você por este número
              </p>
            </div>

            <div>
              <Label>Sua Igreja Local</Label>
              <Select
                value={formData.homeChurchId}
                onValueChange={(value) => setFormData({ ...formData, homeChurchId: value })}
              >
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Selecione sua igreja" />
                </SelectTrigger>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name} - {church.city}/{church.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                O diretor da sua igreja precisará aprovar seu cadastro
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Aguarde aprovação</p>
                <p>
                  Após concluir, o diretor de música da sua igreja receberá uma notificação 
                  para aprovar seu cadastro. Você será notificado quando for aprovado.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.whatsappNumber || !formData.homeChurchId}
              className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 text-lg"
            >
              {loading ? "Enviando..." : "Concluir Cadastro"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
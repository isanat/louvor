
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, UserCircle, LogOut, RefreshCw } from "lucide-react";
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
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function PerfilDiretor() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: ""
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || ""
      });
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ profileImageUrl: file_url });
      setUser({ ...user, profileImageUrl: file_url });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(formData);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Para usar o botão de sair, você precisa habilitar a autenticação no Dashboard > Settings do app.");
    }
  };

  const handleTrocarPerfil = async () => {
    try {
      await User.updateMyUserData({ userType: "musico" });
      navigate(createPageUrl("DashboardMusico"));
      window.location.reload();
    } catch (error) {
      console.error("Erro ao trocar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Mantenha suas informações atualizadas
          </p>
        </div>

        <div className="clay-card p-8 mb-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-16 h-16 text-purple-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-gray-600 mt-4">{user?.email}</p>
            <div className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 text-sm font-medium">
              Diretor de Música
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Nome Completo</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Seu nome completo"
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="mt-2 rounded-2xl"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 text-lg"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="clay-card p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Trocar Tipo de Perfil</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Você está usando o app como Diretor de Música. Se quiser mudar para perfil de Músico, clique abaixo.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="clay-button w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Trocar para Perfil de Músico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar troca de perfil?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você será redirecionado para o perfil de músico. Poderá voltar a ser diretor quando quiser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleTrocarPerfil}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="clay-card p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Sair da Conta</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Desconectar desta conta e voltar para a tela de login.
          </p>
          <p className="text-xs text-amber-600 mb-4 bg-amber-50 p-3 rounded-xl">
            ⚠️ Para usar este recurso, habilite a autenticação em Dashboard → Settings
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="clay-button w-full bg-red-500 hover:bg-red-600 text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você precisará fazer login novamente para acessar o aplicativo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { MusicianProfile } from "@/entities/MusicianProfile";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Video, Music, Save, LogOut, RefreshCw } from "lucide-react";
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

export default function PerfilMusico() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    videoUrl: "",
    vocalRange: "",
    instruments: [],
    yearsExperience: 0
  });
  const [newInstrument, setNewInstrument] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await MusicianProfile.filter({ userId: currentUser.id });
      if (profiles.length > 0) {
        const existingProfile = profiles[0];
        setProfile(existingProfile);
        setFormData({
          bio: existingProfile.bio || "",
          videoUrl: existingProfile.videoUrl || "",
          vocalRange: existingProfile.vocalRange || "",
          instruments: existingProfile.instruments || [],
          yearsExperience: existingProfile.yearsExperience || 0
        });
      }
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

  const addInstrument = () => {
    if (newInstrument.trim() && !formData.instruments.includes(newInstrument.trim())) {
      setFormData({
        ...formData,
        instruments: [...formData.instruments, newInstrument.trim()]
      });
      setNewInstrument("");
    }
  };

  const removeInstrument = (instrument) => {
    setFormData({
      ...formData,
      instruments: formData.instruments.filter(i => i !== instrument)
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile) {
        await MusicianProfile.update(profile.id, formData);
      } else {
        await MusicianProfile.create({
          ...formData,
          userId: user.id
        });
      }
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
      await User.updateMyUserData({ userType: "diretor" });
      navigate(createPageUrl("DashboardDiretor"));
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
            Meu Perfil Musical
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
                  <Music className="w-16 h-16 text-purple-400" />
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
            <h2 className="text-2xl font-bold mt-4">{user?.full_name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-sm font-medium">
              Músico/Cantor
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Biografia</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre sua história musical..."
                className="mt-2 rounded-2xl min-h-32"
              />
            </div>

            <div>
              <Label>Link do Vídeo de Apresentação</Label>
              <div className="flex gap-2 mt-2">
                <Video className="w-5 h-5 text-purple-500 mt-3" />
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="Cole o link do YouTube, Vimeo, etc."
                  className="rounded-2xl"
                />
              </div>
            </div>

            <div>
              <Label>Extensão Vocal</Label>
              <Select 
                value={formData.vocalRange}
                onValueChange={(value) => setFormData({ ...formData, vocalRange: value })}
              >
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Selecione sua extensão vocal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soprano">Soprano</SelectItem>
                  <SelectItem value="Contralto">Contralto</SelectItem>
                  <SelectItem value="Tenor">Tenor</SelectItem>
                  <SelectItem value="Barítono">Barítono</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Instrumentos Musicais</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInstrument}
                  onChange={(e) => setNewInstrument(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addInstrument()}
                  placeholder="Digite um instrumento e pressione Enter"
                  className="rounded-2xl"
                />
                <Button
                  onClick={addInstrument}
                  className="clay-button bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.instruments.map((instrument) => (
                  <span
                    key={instrument}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 flex items-center gap-2"
                  >
                    {instrument}
                    <button
                      onClick={() => removeInstrument(instrument)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Anos de Experiência</Label>
              <Input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                className="mt-2 rounded-2xl"
                min="0"
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
            Você está usando o app como Músico. Se quiser mudar para perfil de Diretor de Música, clique abaixo.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="clay-button w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Trocar para Perfil de Diretor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar troca de perfil?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você será redirecionado para o perfil de diretor de música. Poderá voltar a ser músico quando quiser.
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
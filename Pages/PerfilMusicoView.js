import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Church } from "@/entities/Church";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, Plus } from "lucide-react";

export default function MinhaIgreja() {
  const [user, setUser] = useState(null);
  const [churches, setChurches] = useState([]);
  const [editingChurch, setEditingChurch] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userChurches = await Church.filter({ directorId: currentUser.id });
      setChurches(userChurches);

      if (userChurches.length === 0) {
        setEditingChurch({
          name: "",
          address: "",
          city: "",
          state: "",
          phone: "",
          pastorName: "",
          district: "",
          imageUrl: ""
        });
      } else {
        setEditingChurch(userChurches[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setEditingChurch({ ...editingChurch, imageUrl: file_url });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingChurch.id) {
        await Church.update(editingChurch.id, editingChurch);
      } else {
        await Church.create({
          ...editingChurch,
          directorId: user.id
        });
      }
      loadData();
    } catch (error) {
      console.error("Erro ao salvar igreja:", error);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Minha Igreja
          </h1>
          <p className="text-gray-600">
            Configure as informações da sua igreja
          </p>
        </div>

        <div className="clay-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {editingChurch?.imageUrl ? (
                  <img 
                    src={editingChurch.imageUrl} 
                    alt="Igreja" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                    <p className="text-sm text-gray-500">Foto da Igreja</p>
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Nome da Igreja</Label>
              <Input
                value={editingChurch?.name || ""}
                onChange={(e) => setEditingChurch({ ...editingChurch, name: e.target.value })}
                placeholder="Ex: Igreja Adventista Central"
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label>Endereço Completo</Label>
              <Input
                value={editingChurch?.address || ""}
                onChange={(e) => setEditingChurch({ ...editingChurch, address: e.target.value })}
                placeholder="Rua, número, bairro"
                className="mt-2 rounded-2xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Cidade</Label>
                <Input
                  value={editingChurch?.city || ""}
                  onChange={(e) => setEditingChurch({ ...editingChurch, city: e.target.value })}
                  placeholder="Cidade"
                  className="mt-2 rounded-2xl"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Input
                  value={editingChurch?.state || ""}
                  onChange={(e) => setEditingChurch({ ...editingChurch, state: e.target.value })}
                  placeholder="UF"
                  className="mt-2 rounded-2xl"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label>Telefone de Contato</Label>
              <Input
                value={editingChurch?.phone || ""}
                onChange={(e) => setEditingChurch({ ...editingChurch, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label>Nome do Pastor</Label>
              <Input
                value={editingChurch?.pastorName || ""}
                onChange={(e) => setEditingChurch({ ...editingChurch, pastorName: e.target.value })}
                placeholder="Pastor responsável"
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label>Distrito</Label>
              <Input
                value={editingChurch?.district || ""}
                onChange={(e) => setEditingChurch({ ...editingChurch, district: e.target.value })}
                placeholder="Ex: Distrito Paulistana Leste"
                className="mt-2 rounded-2xl"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !editingChurch?.name}
              className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 text-lg"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Informações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
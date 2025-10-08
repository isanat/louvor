import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Music, MapPin, Star, Calendar, User } from "lucide-react";

export default function MusicianCard({ musician, selectedDate }) {
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    try {
      // Implementar convite do músico
      console.log("Convidar músico:", musician.id, "para data:", selectedDate);
    } catch (error) {
      console.error("Erro ao convidar músico:", error);
    }
    setLoading(false);
  };

  return (
    <div className="clay-card p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">
            {musician.full_name}
          </h3>
          <p className="text-gray-600 text-sm">
            {musician.profile?.instruments?.join(", ") || "Músico"}
          </p>
          {musician.profile?.homeChurch && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              <span>{musician.profile.homeChurch}</span>
            </div>
          )}
        </div>
      </div>

      {musician.profile?.description && (
        <p className="text-gray-600 text-sm mb-4">
          {musician.profile.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600">
            {musician.profile?.rating || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{musician.profile?.experience || 0} anos</span>
        </div>
      </div>

      <Button
        onClick={handleInvite}
        disabled={loading}
        className="clay-button w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      >
        {loading ? "Enviando..." : "Convidar"}
      </Button>
    </div>
  );
}

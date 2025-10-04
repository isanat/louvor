import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MusicianCard({ musician, selectedDate }) {
  const getReputationBadge = () => {
    const count = musician.cancellationCount || 0;
    if (count === 0) return { emoji: "🥇", text: "Excelente", color: "from-green-100 to-green-200 text-green-700" };
    if (count <= 2) return { emoji: "🥈", text: "Bom", color: "from-blue-100 to-blue-200 text-blue-700" };
    return { emoji: "🥉", text: "Regular", color: "from-yellow-100 to-yellow-200 text-yellow-700" };
  };

  const badge = getReputationBadge();

  return (
    <Link 
      to={`${createPageUrl("PerfilMusicoView")}?musicianId=${musician.id}&date=${selectedDate?.toISOString()}`}
      className="clay-card p-6 hover:scale-105 transition-transform block"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
          {musician.profileImageUrl ? (
            <img src={musician.profileImageUrl} alt={musician.full_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-purple-600" />
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2">{musician.full_name}</h3>
        
        <div className="flex gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${badge.color}`}>
            {badge.emoji} {badge.text}
          </span>
          {musician.cancellationCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              {musician.cancellationCount} cancelamento{musician.cancellationCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {musician.profile && (
          <>
            {musician.profile.vocalRange && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm mb-2">
                {musician.profile.vocalRange}
              </span>
            )}
            {musician.profile.instruments && musician.profile.instruments.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {musician.profile.instruments.slice(0, 3).map((instrument) => (
                  <span key={instrument} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {instrument}
                  </span>
                ))}
                {musician.profile.instruments.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    +{musician.profile.instruments.length - 3}
                  </span>
                )}
              </div>
            )}
          </>
        )}
        
        <Button className="clay-button mt-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white w-full">
          Ver Perfil e Convidar
        </Button>
      </div>
    </Link>
  );
}
import React from "react";

export default function StatsCard({ title, value, icon: Icon, color, textColor }) {
  return (
    <div className="clay-card p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
}

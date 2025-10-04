import React from "react";

export default function StatsCard({ title, value, icon: Icon, color, textColor }) {
  return (
    <div className="clay-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${textColor}`} />
        </div>
      </div>
    </div>
  );
}
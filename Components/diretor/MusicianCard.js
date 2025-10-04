import React from "react";
import { Button } from "@/components/ui/button";
import { Church, MapPin, Map, Globe } from "lucide-react";

export default function FilterButtons({ filter, onFilterChange, myChurch }) {
  const filters = [
    { value: "minha_igreja", label: "Minha Igreja", icon: Church, disabled: !myChurch },
    { value: "minha_cidade", label: "Minha Cidade", icon: MapPin, disabled: !myChurch },
    { value: "meu_estado", label: "Meu Estado", icon: Map, disabled: !myChurch },
    { value: "todos", label: "Todos", icon: Globe, disabled: false }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((f) => {
        const Icon = f.icon;
        const isActive = filter === f.value;
        return (
          <Button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            disabled={f.disabled}
            className={`clay-button ${
              isActive 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-white text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {f.label}
          </Button>
        );
      })}
    </div>
  );
}
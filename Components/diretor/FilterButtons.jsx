import React from "react";
import { Button } from "@/components/ui/button";

export default function FilterButtons({ filter, onFilterChange, myChurch }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onFilterChange("todos")}
        variant={filter === "todos" ? "default" : "outline"}
        className="clay-button text-sm px-4 py-2"
      >
        Todos
      </Button>
      {myChurch && (
        <>
          <Button
            onClick={() => onFilterChange("minha_igreja")}
            variant={filter === "minha_igreja" ? "default" : "outline"}
            className="clay-button text-sm px-4 py-2"
          >
            Minha Igreja
          </Button>
          <Button
            onClick={() => onFilterChange("minha_cidade")}
            variant={filter === "minha_cidade" ? "default" : "outline"}
            className="clay-button text-sm px-4 py-2"
          >
            Minha Cidade
          </Button>
          <Button
            onClick={() => onFilterChange("meu_estado")}
            variant={filter === "meu_estado" ? "default" : "outline"}
            className="clay-button text-sm px-4 py-2"
          >
            Meu Estado
          </Button>
        </>
      )}
    </div>
  );
}

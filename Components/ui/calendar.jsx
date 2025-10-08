import React from "react";
import { cn } from "@/utils/cn";

export function Calendar({ mode = "single", selected, onSelect, locale, className, disabled, modifiers, modifiersStyles, ...props }) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Preencher dias do mês anterior
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Preencher dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    days.push(date);
  }

  const handleDayClick = (date) => {
    if (disabled && disabled(date)) return;
    onSelect(date);
  };

  const isSelected = (date) => {
    if (!selected) return false;
    if (mode === "single") {
      return date.toDateString() === selected.toDateString();
    }
    return false;
  };

  const hasModifier = (date) => {
    if (!modifiers) return false;
    return modifiers.event && modifiers.event.some(modDate => 
      modDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border p-4", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold">
          {currentMonth.toLocaleDateString(locale?.code || "pt-BR", { 
            month: "long", 
            year: "numeric" 
          })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="py-2" />;
          }

          const isSelectedDay = isSelected(date);
          const hasEvent = hasModifier(date);
          const isDisabled = disabled && disabled(date);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(date)}
              disabled={isDisabled}
              className={cn(
                "py-2 px-3 text-sm rounded hover:bg-gray-100 transition-colors",
                isSelectedDay && "bg-purple-500 text-white hover:bg-purple-600",
                hasEvent && !isSelectedDay && "bg-purple-100 text-purple-700 font-semibold",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              style={hasEvent && modifiersStyles?.event}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

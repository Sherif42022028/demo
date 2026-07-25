import React from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-500">{label}</label>}
      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
      </div>
    </div>
  );
};

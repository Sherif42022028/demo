import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentGradient?: "blue" | "emerald" | "amber" | "purple";
  className?: string;
}

const gradientClasses = {
  blue: "from-blue-500/10 to-indigo-500/5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  emerald: "from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
  amber: "from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  purple: "from-purple-500/10 to-violet-500/5 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accentGradient = "blue",
  className,
}) => {
  return (
    <Card className={cn("relative overflow-hidden p-6 border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60", gradientClasses[accentGradient])} />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</h3>
          
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}

          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
              {trend.isPositive ? (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="ml-1 h-3.5 w-3.5" />
                  {trend.value}
                </span>
              ) : (
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <TrendingDown className="ml-1 h-3.5 w-3.5" />
                  {trend.value}
                </span>
              )}
              <span className="text-slate-400 font-normal">مقارنة بالشهر السابق</span>
            </div>
          )}
        </div>

        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-200")}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

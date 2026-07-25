import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}) => {
  return (
    <div className="py-12 px-4 text-center space-y-3 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

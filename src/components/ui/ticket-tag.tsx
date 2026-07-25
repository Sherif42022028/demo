import React from "react";

export const TicketTag: React.FC<{ number: string; className?: string }> = ({ number, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-sm border border-dashed border-primary/40 bg-primary/5 px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-primary ${className}`}
  >
    {number}
  </span>
);

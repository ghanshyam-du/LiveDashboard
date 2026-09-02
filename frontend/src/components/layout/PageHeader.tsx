'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800/60">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

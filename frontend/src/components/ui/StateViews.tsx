import React from 'react';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no records matching your current filter criteria.',
  actionText,
  onAction,
  icon: Icon = FolderOpen,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200">
          {actionText}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load operational data',
  message = 'An unexpected server error occurred while retrieving data. Please check your backend connection.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-6 border border-rose-500/30 bg-rose-500/10 rounded-xl flex flex-col items-center text-center">
      <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
      <h4 className="text-sm font-bold text-rose-200">{title}</h4>
      <p className="text-xs text-rose-300/80 max-w-md mt-1 mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="border-rose-500/40 bg-rose-950/40 text-rose-200 hover:bg-rose-900/50"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}

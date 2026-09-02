'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Users,
  BarChart3,
  ShieldAlert,
  Car,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: CalendarCheck,
  },
  {
    title: 'Mechanics',
    href: '/mechanics',
    icon: Wrench,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#0B0F17] border-r border-slate-800/60 text-slate-300 w-64 shrink-0',
        className,
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-wide block leading-none">
              INSTANT
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase">
              Ops Control
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r" />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200',
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* System Operational Badge */}
      <div className="p-4 border-t border-slate-800/60 m-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">System Healthy</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          MongoDB & Socket.IO real-time pipelines active.
        </p>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
          OP
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-slate-200 truncate">Ops Controller</p>
          <p className="text-[10px] text-slate-500 truncate">ops@instantmechanic.in</p>
        </div>
      </div>
    </aside>
  );
}

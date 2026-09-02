'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Menu, Radio, CheckCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Sidebar from './Sidebar';
import { getSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/lib/formatters';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('notification:new', (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Fetch initial notifications
    fetchNotifications();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification:new');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications(10);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch {
      // silent fallback
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent fallback
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/60 bg-[#0B0F17]/80 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Drawer Toggle */}
      <div className="flex items-center gap-3">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerTrigger className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center justify-center">
            <Menu className="w-5 h-5" />
          </DrawerTrigger>
          <DrawerContent className="p-0 bg-[#0B0F17] border-slate-800 max-w-xs">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </DrawerContent>
        </Drawer>

        {/* Live Operational Connection Indicator */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            )}
          </span>
          <span className="font-semibold tracking-wide text-slate-300 flex items-center gap-1">
            {isConnected ? 'LIVE OPS CONNECTED' : 'DISCONNECTED'}
          </span>
          <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`} />
        </div>
      </div>

      {/* Right Actions Header */}
      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title="Refresh Data"
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}

        {/* Real-time Notifications Popover */}
        <Popover>
          <PopoverTrigger className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-800 text-slate-200 shadow-xl" align="end">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-[10px]">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No operational alerts.</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 text-xs transition-colors hover:bg-slate-800/40 ${
                      !notif.isRead ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200 truncate">{notif.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-snug">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
            OP
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-none">
              Ops Manager
            </span>
            <span className="text-[10px] text-slate-400">Shift 1 Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}

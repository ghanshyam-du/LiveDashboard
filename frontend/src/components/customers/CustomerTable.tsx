'use client';

import React from 'react';
import { Customer } from '@/types';
import { formatCurrency, formatDateShort } from '@/lib/formatters';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerTableProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onSelectCustomer }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-center">
        <p className="text-sm font-semibold text-slate-300">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800/80 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Contact</th>
            <th className="py-3.5 px-4">Address</th>
            <th className="py-3.5 px-4">Total Bookings</th>
            <th className="py-3.5 px-4">Total Spent</th>
            <th className="py-3.5 px-4">Last Booking</th>
            <th className="py-3.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
          {customers.map((customer) => (
            <tr
              key={customer._id}
              onClick={() => onSelectCustomer(customer)}
              className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <td className="py-3.5 px-4 font-semibold text-slate-200 group-hover:text-blue-400">
                {customer.name}
              </td>
              <td className="py-3.5 px-4">
                <span className="text-slate-300 block">{customer.email}</span>
                <span className="text-[10px] text-slate-500 font-mono block">{customer.phone}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-400 truncate max-w-[160px]">
                {customer.address || '-'}
              </td>
              <td className="py-3.5 px-4 font-bold text-slate-200">
                {customer.totalBookings ?? 0}
              </td>
              <td className="py-3.5 px-4 font-bold text-emerald-400">
                {formatCurrency(customer.totalAmountSpent ?? 0)}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                {formatDateShort(customer.lastBookingDate)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCustomer(customer);
                  }}
                  className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 px-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

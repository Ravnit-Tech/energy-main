"use client";
import React, { useEffect } from "react";
import Link from "next/link";

export interface CompletedStep {
  label: string;
  detail?: string;
}

export interface NextAction {
  label: string;
  description: string;
  href?: string;
  onClick?: () => void;
  color: "orange" | "green" | "blue" | "yellow" | "purple" | "gray";
  icon: React.ReactNode;
}

interface FlowCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  orderId?: string;
  orderLabel?: string;
  completedSteps: CompletedStep[];
  summary?: { label: string; value: string }[];
  nextActions: NextAction[];
}

const COLOR_MAP = {
  orange: { card: "bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20 hover:border-orange-500/70", icon: "bg-orange-500/20 text-orange-400", label: "text-orange-400" },
  green:  { card: "bg-green-500/10 border-green-500/40 hover:bg-green-500/20 hover:border-green-500/70",   icon: "bg-green-500/20 text-green-400",   label: "text-green-400"  },
  blue:   { card: "bg-blue-500/10 border-blue-500/40 hover:bg-blue-500/20 hover:border-blue-500/70",       icon: "bg-blue-500/20 text-blue-400",     label: "text-blue-400"   },
  yellow: { card: "bg-yellow-500/10 border-yellow-500/40 hover:bg-yellow-500/20 hover:border-yellow-500/70", icon: "bg-yellow-500/20 text-yellow-400", label: "text-yellow-400" },
  purple: { card: "bg-purple-500/10 border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-500/70", icon: "bg-purple-500/20 text-purple-400", label: "text-purple-400" },
  gray:   { card: "bg-gray-700/40 border-gray-600/40 hover:bg-gray-700/60 hover:border-gray-500/60",       icon: "bg-gray-700 text-gray-300",        label: "text-gray-300"   },
};

export default function FlowCompleteModal({
  isOpen, onClose, title = "Process Complete!", subtitle,
  orderId, orderLabel = "Reference ID",
  completedSteps, summary, nextActions,
}: FlowCompleteModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-2xl bg-gray-950 border border-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-6 py-5">
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">{title}</h2>
              {subtitle && <p className="text-white/80 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {orderId && (
            <div className="mt-3 inline-flex items-center gap-2 bg-black/20 border border-white/20 rounded-lg px-3 py-1.5">
              <span className="text-white/60 text-xs">{orderLabel}:</span>
              <span className="text-white font-mono font-black text-sm tracking-widest">{orderId}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Completed Journey */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Completed Journey</p>
            <div className="flex items-start gap-0">
              {completedSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-semibold text-orange-300 mt-1.5 text-center whitespace-nowrap max-w-[60px] leading-tight">{step.label}</p>
                    {step.detail && <p className="text-[9px] text-gray-500 text-center max-w-[60px] leading-tight mt-0.5">{step.detail}</p>}
                  </div>
                  {i < completedSteps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-orange-500/50 mt-3.5 min-w-[12px]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          {summary && summary.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Summary</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {summary.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-white font-semibold truncate">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Actions */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">What would you like to do next?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nextActions.map((action, i) => {
                const c = COLOR_MAP[action.color];
                const inner = (
                  <div className={`flex flex-col gap-2 p-3.5 rounded-xl border transition cursor-pointer ${c.card}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.icon}`}>
                      {action.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${c.label}`}>{action.label}</p>
                      <p className="text-xs text-gray-400 leading-snug mt-0.5">{action.description}</p>
                    </div>
                  </div>
                );
                if (action.href) return <Link key={i} href={action.href}>{inner}</Link>;
                return <button key={i} type="button" onClick={action.onClick} className="text-left">{inner}</button>;
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

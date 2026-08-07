import React, { useState } from 'react';
import { AuthUser } from '../types';
import { X, ShieldAlert, LogIn, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface GmailAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (email: string, name?: string) => void;
  onLogout: () => void;
  ownerEmail: string;
}

export const GmailAuthModal: React.FC<GmailAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  ownerEmail
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    onLogin(customEmail.trim().toLowerCase(), customName.trim() || customEmail.split('@')[0]);
    setCustomEmail('');
    setCustomName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 relative border border-amber-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top yellow highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-amber-400" />

        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
              <LogIn className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">
                เข้าสู่ระบบด้วย Gmail (Google Auth)
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                ระบบความปลอดภัยจำกัดสิทธิ์การเข้าถึง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current user status if logged in */}
        {currentUser ? (
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">สถานะการเข้าสู่ระบบปัจจุบัน</span>
              {currentUser.role === 'OWNER' ? (
                <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>เจ้าของระบบ (SYSTEM OWNER)</span>
                </span>
              ) : currentUser.role === 'AUTHORIZED' ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>ได้รับอนุมัติ (AUTHORIZED)</span>
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  <span>รออนุมัติ (PENDING)</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-base shadow-sm">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-neutral-900 truncate">{currentUser.name}</div>
                <div className="text-xs font-mono text-neutral-500 truncate">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2 rounded-xl text-xs font-bold transition-all"
            >
              ออกจากระบบ (Sign Out)
            </button>
          </div>
        ) : null}

        {/* Quick Account Selector Options */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
            เลือกบัญชี Google / Gmail เพื่อเข้าใช้งาน:
          </label>

          {/* Owner Account Option */}
          <button
            onClick={() => {
              onLogin(ownerEmail, 'เจ้าของระบบ (System Owner)');
              onClose();
            }}
            className="w-full bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-400 p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">
                G
              </div>
              <div>
                <div className="text-xs font-extrabold text-neutral-900 flex items-center space-x-1.5">
                  <span>{ownerEmail}</span>
                  <span className="bg-black text-amber-400 text-[9px] font-black px-1.5 py-0.2 rounded">OWNER</span>
                </div>
                <div className="text-[11px] text-amber-900 font-medium">
                  บัญชีเจ้าของระบบ (มีสิทธิ์เต็มและอนุมัติผู้ใช้อื่น)
                </div>
              </div>
            </div>
            <LogIn className="w-4 h-4 text-amber-700" />
          </button>

          {/* Contractor Pre-approved option */}
          <button
            onClick={() => {
              onLogin('somchai.hvac@gmail.com', 'สมชาย ชัยเจริญ (ช่าง VIP)');
              onClose();
            }}
            className="w-full bg-white hover:bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">somchai.hvac@gmail.com</div>
                <div className="text-[11px] text-emerald-600 font-medium">ช่างรับเหมาที่ได้รับอนุญาตแล้ว</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              APPROVED
            </span>
          </button>

          {/* New / Unapproved Gmail option */}
          <button
            onClick={() => {
              onLogin('new.contractor@gmail.com', 'ช่างใหม่ รออนุมัติ');
              onClose();
            }}
            className="w-full bg-white hover:bg-neutral-50 border border-neutral-200 p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold">
                N
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">new.contractor@gmail.com</div>
                <div className="text-[11px] text-amber-600 font-medium">บัญชีใหม่ (ต้องส่งคำขออนุมัติ)</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              PENDING
            </span>
          </button>
        </div>

        {/* Custom Email Login Form */}
        <div className="pt-2 border-t border-neutral-100">
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700">
              หรือระบุอีเมล Gmail อื่นๆ:
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-black text-amber-400 hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-extrabold flex-shrink-0 transition-all shadow-xs"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

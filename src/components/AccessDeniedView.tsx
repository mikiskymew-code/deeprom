import React, { useState } from 'react';
import { AuthUser } from '../types';
import { LogIn, Mail, Send, CheckCircle2, Lock, ArrowRight, AlertCircle, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface AccessDeniedViewProps {
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onRequestAccess: (email: string, name: string) => void;
  onLoginDirect: (email: string, name?: string) => void;
  ownerEmail: string;
  hasPendingRequest: boolean;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentUser,
  onOpenAuthModal,
  onRequestAccess,
  onLoginDirect,
  ownerEmail,
  hasPendingRequest
}) => {
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendRequest = () => {
    if (currentUser) {
      onRequestAccess(currentUser.email, currentUser.name);
      setSubmitted(true);
    } else if (inputEmail.trim()) {
      onRequestAccess(inputEmail.trim().toLowerCase(), inputName.trim() || inputEmail.split('@')[0]);
      setSubmitted(true);
    }
  };

  const handleDirectSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputEmail.includes('@')) return;
    onLoginDirect(inputEmail.trim().toLowerCase(), inputName.trim() || inputEmail.split('@')[0]);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400 space-y-5 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Yellow Header Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[#E8C228]" />

        {/* Deeprom Air Welcome Brand Badge */}
        <div className="pt-2">
          <div className="w-16 h-16 rounded-3xl bg-[#18181B] text-amber-400 flex items-center justify-center mx-auto shadow-lg border-2 border-amber-400">
            <Building2 className="w-8 h-8" />
          </div>
        </div>

        <div>
          <span className="bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center space-x-1 mb-2">
            <ShieldCheck className="w-3 h-3 text-black" />
            <span>MEMBER ACCESS GATE • ระบบสมาชิก</span>
          </span>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            ยินดีต้อนรับสู่ ดีพร้อมแอร์
          </h1>
          <p className="text-xs text-neutral-600 font-semibold mt-1.5 leading-relaxed">
            แคตตาล็อกและระบบสั่งซื้ออุปกรณ์รางครอบท่อแอร์ <br />
            <span className="text-amber-800 font-bold">สงวนสิทธิ์เฉพาะสมาชิกที่ได้รับอนุญาตเท่านั้น</span>
          </p>
        </div>

        {/* Email Entry Form */}
        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 text-left space-y-3">
          <label className="block text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-amber-700" />
            <span>กรอกอีเมล์ของคุณเพื่อเข้าสู่ระบบ:</span>
          </label>

          <form onSubmit={handleDirectSignIn} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="ใส่อีเมลของคุณ (เช่น user@gmail.com)"
                className="w-full bg-white border-2 border-amber-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 shadow-inner transition-all"
              />
              <Mail className="w-4 h-4 text-amber-700 absolute left-3 top-3" />
            </div>

            <button
              type="submit"
              className="w-full bg-[#18181B] hover:bg-black text-amber-400 py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all border border-amber-400/40"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ / ตรวจสอบสิทธิ์สมาชิก</span>
            </button>
          </form>

          {/* Quick Preset Accounts for Easy Login Testing */}
          <div className="pt-2 border-t border-amber-200/80 space-y-1.5">
            <span className="text-[10px] text-amber-900 font-extrabold uppercase block">
              เลือกอีเมลสมาชิกทดสอบด่วน:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => onLoginDirect('mikiskymew@gmail.com', 'Super')}
                className="bg-amber-100 border border-amber-300 hover:bg-amber-200 p-2 rounded-xl text-left font-bold text-amber-950 truncate transition-all"
              >
                👑 Super (Super Owner)
                <span className="block text-[9px] font-normal text-amber-800">ผู้คุมสิทธิ์ทั้งหมด</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginDirect('sp-deeprom@gmail.com', 'แอดมิน')}
                className="bg-amber-100 border border-amber-300 hover:bg-amber-200 p-2 rounded-xl text-left font-bold text-amber-950 truncate transition-all"
              >
                🛠️ แอดมิน (Admin)
                <span className="block text-[9px] font-normal text-amber-800">แอดมินดีพร้อมแอร์</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginDirect('somchai.hvac@gmail.com', 'สมชาย ช่าง VIP')}
                className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 p-2 rounded-xl text-left font-bold text-emerald-950 truncate col-span-2 transition-all"
              >
                👷 สมชาย (ช่างสมาชิก VIP)
              </button>
            </div>
          </div>
        </div>

        {/* Non-Member Warning Alert Box */}
        {currentUser && currentUser.role === 'PENDING' && (
          <div className="bg-red-50 border-2 border-red-400 p-4 rounded-2xl text-left space-y-2.5 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-start space-x-2.5 text-red-950">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-xs block text-red-900">
                  ❌ ไม่พบอีเมล์นี้ในระบบสมาชิก!
                </span>
                <span className="text-[11px] text-red-700 font-medium block mt-0.5 font-mono">
                  {currentUser.email.replace(/(.{2})(.*)(?=@)/, '$1***')}
                </span>
                <p className="text-[11px] text-red-800 font-medium mt-1 leading-relaxed">
                  อีเมล์นี้ยังไม่ได้รับอนุมัติให้เข้าใช้งานระบบแคตตาล็อกแอร์ดีพร้อม ท่านจะไม่สามารถเข้าดูหรือสั่งซื้อสินค้าได้จนกว่าจะได้รับการอนุมัติ
                </p>
              </div>
            </div>

            {submitted || hasPendingRequest ? (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-emerald-950 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ส่งคำขออนุมัติถึงผู้ดูแลระบบ ({ownerEmail}) เรียบร้อยแล้ว</span>
              </div>
            ) : (
              <button
                onClick={handleSendRequest}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-xs active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>กดที่นี่เพื่อยื่นคำขอสมัครสมาชิก / ขออนุมัติ</span>
              </button>
            )}
          </div>
        )}

        {/* Footer info & Contact */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-600">
          <button
            onClick={onOpenAuthModal}
            className="hover:text-black flex items-center space-x-1"
          >
            <span>สลับหรือเลือกบัญชีอื่น</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`mailto:${ownerEmail}`}
            className="hover:text-black flex items-center space-x-1 text-neutral-500"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ติดต่อแอดมิน ({ownerEmail})</span>
          </a>
        </div>
      </div>
    </div>
  );
};


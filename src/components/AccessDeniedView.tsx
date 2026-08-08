import React, { useState } from 'react';
import { AuthUser } from '../types';
import { ShieldAlert, LogIn, Mail, Send, CheckCircle2, Lock, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400 space-y-5 text-center relative overflow-hidden">
        {/* Yellow Header Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-amber-400" />

        {/* Lock Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-300">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <span className="bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-2">
            RESTRICTED ACCESS • เฉพาะผู้ได้รับอนุมัติ
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            เข้าสู่ระบบระบุอีเมลก่อนใช้งาน
          </h2>
          <p className="text-xs text-neutral-600 font-medium mt-1.5 leading-relaxed">
            แคตตาล็อกและระบบสั่งซื้ออุปกรณ์แอร์ดีพร้อม สงวนสิทธิ์เฉพาะผู้ได้รับอนุมัติจากผู้ดูแลระบบแล้วเท่านั้น
          </p>
        </div>

        {/* Direct Email Form */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left space-y-3">
          <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider">
            กรอกอีเมลของคุณเพื่อเข้าสู่ระบบ:
          </label>

          <form onSubmit={handleDirectSignIn} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="ใส่อีเมลของคุณ (เช่น yourname@gmail.com)"
                className="w-full bg-white border-2 border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold focus:outline-none focus:border-amber-500 transition-all"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-amber-400 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบ / ตรวจสอบสิทธิ์</span>
            </button>
          </form>

          {/* Quick Preset Buttons for Easy Login Testing */}
          <div className="pt-2 border-t border-neutral-200 space-y-1.5">
            <span className="text-[10px] text-neutral-500 font-bold uppercase block">
              หรือเลือกบัญชีทดสอบด่วน:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => onLoginDirect('mikiskymew@gmail.com', 'ผู้คุมสิทธิ์ระบบ')}
                className="bg-amber-100 border border-amber-300 hover:bg-amber-200 p-2 rounded-xl text-left font-bold text-amber-950 truncate"
              >
                👑 mikiskymew@gmail.com
                <span className="block text-[9px] font-normal text-amber-800">ผู้คุมสิทธิ์ทั้งหมด</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginDirect('sp-deeprom@gmail.com', 'แอดมินดีพร้อม')}
                className="bg-amber-100 border border-amber-300 hover:bg-amber-200 p-2 rounded-xl text-left font-bold text-amber-950 truncate"
              >
                🛠️ sp-deeprom@gmail.com
                <span className="block text-[9px] font-normal text-amber-800">แอดมิน ปรับราคา/ออเดอร์</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginDirect('somchai.hvac@gmail.com', 'สมชาย ช่าง VIP')}
                className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 p-2 rounded-xl text-left font-bold text-emerald-950 truncate col-span-2"
              >
                👷 somchai.hvac@gmail.com (ลูกค้าที่ได้รับอนุญาตแล้ว)
              </button>
            </div>
          </div>
        </div>

        {/* Current User Pending Status Feedback */}
        {currentUser && currentUser.role === 'PENDING' && (
          <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl text-left space-y-2">
            <div className="flex items-center space-x-2 text-amber-950">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="font-extrabold text-xs">
                อีเมล {currentUser.email} ยังไม่ได้รับอนุมัติเข้าใช้งาน
              </span>
            </div>

            {submitted || hasPendingRequest ? (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-emerald-950 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ส่งคำขอสมัครถึงผู้ดูแลระบบ ({ownerEmail}) แล้ว</span>
              </div>
            ) : (
              <button
                onClick={handleSendRequest}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-xs active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>กดที่นี่เพื่อส่งคำขอเข้าใช้งานระบบ</span>
              </button>
            )}
          </div>
        )}

        {/* Contact Owner Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-600">
          <button
            onClick={onOpenAuthModal}
            className="hover:text-black flex items-center space-x-1"
          >
            <span>เลือกบัญชีอื่นๆ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`mailto:${ownerEmail}`}
            className="hover:text-black flex items-center space-x-1 text-neutral-500"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ติดต่อผู้ดูแลระบบ</span>
          </a>
        </div>
      </div>
    </div>
  );
};

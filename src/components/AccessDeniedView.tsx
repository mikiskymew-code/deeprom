import React, { useState } from 'react';
import { AuthUser } from '../types';
import { ShieldAlert, LogIn, Mail, Send, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface AccessDeniedViewProps {
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onRequestAccess: (email: string, name: string) => void;
  ownerEmail: string;
  hasPendingRequest: boolean;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentUser,
  onOpenAuthModal,
  onRequestAccess,
  ownerEmail,
  hasPendingRequest
}) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSendRequest = () => {
    if (currentUser) {
      onRequestAccess(currentUser.email, currentUser.name);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400 space-y-6 text-center relative overflow-hidden">
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
            ระบบความปลอดภัยเฉพาะผู้ได้รับอนุญาต
          </h2>
          <p className="text-xs text-neutral-600 font-medium mt-1.5 leading-relaxed">
            แคตตาล็อกและระบบสั่งซื้ออุปกรณ์รางครอบท่อแอร์นี้สงวนสิทธิ์เฉพาะช่างและผู้รับเหมาที่ได้รับอนุมัติจากเจ้าของระบบแล้วเท่านั้น
          </p>
        </div>

        {/* Current user badge or Login request */}
        {currentUser ? (
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left space-y-2">
            <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
              บัญชี Gmail ปัจจุบันของคุณ:
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-black font-black flex items-center justify-center">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-neutral-900 truncate">{currentUser.name}</div>
                <div className="text-xs font-mono text-neutral-500 truncate">{currentUser.email}</div>
              </div>
            </div>

            {/* Request Status feedback */}
            {submitted || hasPendingRequest ? (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-emerald-950 text-xs font-bold space-y-1 mt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-extrabold text-emerald-900">ส่งคำขอเข้าใช้งานถึงผู้ดูแลระบบแล้ว</span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed pl-6">
                  ระบบได้ส่งข้อมูลการสมัครเข้าใช้งานของคุณไปยังอีเมลเจ้าของระบบ ({ownerEmail}) เรียบร้อยแล้ว เมื่อผู้ดูแลระบบอนุมัติ ท่านจะเข้าใช้งานได้ทันที
                </p>
              </div>
            ) : (
              <button
                onClick={handleSendRequest}
                className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-black py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-xs active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>ส่งคำขอสมัครเข้าใช้งานถึงผู้ดูแลระบบ</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
            <p className="text-xs font-bold text-neutral-800">
              กรุณาเข้าสู่ระบบด้วย Gmail เพื่อตรวจสอบสิทธิ์การใช้งาน
            </p>
            <button
              onClick={onOpenAuthModal}
              className="w-full bg-[#1C1C1E] text-amber-400 hover:bg-black py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบด้วย Gmail</span>
            </button>
          </div>
        )}

        {/* Action Options */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-600">
          <button
            onClick={onOpenAuthModal}
            className="hover:text-black flex items-center space-x-1"
          >
            <span>สลับบัญชี Gmail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`mailto:${ownerEmail}`}
            className="hover:text-black flex items-center space-x-1 text-neutral-500"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ติดต่อเจ้าของระบบ</span>
          </a>
        </div>
      </div>
    </div>
  );
};

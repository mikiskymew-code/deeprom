import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, AlertTriangle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  targetEmail: string;
  targetRoleName: string;
  expectedPin: string;
  onClose: () => void;
  onConfirmSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  targetEmail,
  targetRoleName,
  expectedPin,
  onClose,
  onConfirmSuccess
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === expectedPin.trim()) {
      setErrorMsg('');
      setEnteredPin('');
      onConfirmSuccess();
    } else {
      setErrorMsg('รหัส PIN ความปลอดภัยไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-amber-400 space-y-5 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-amber-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              {targetRoleName} SECURITY CHECK
            </span>
            <h3 className="text-lg font-black text-neutral-900 mt-1">
              ยืนยันรหัส PIN ผู้ดูแลระบบ
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              เข้าใช้งานในนาม: <span className="font-bold text-amber-900 font-mono">
                {targetRoleName === 'SUPER OWNER' ? 'Super (Super Owner)' : targetRoleName === 'ADMIN' ? 'แอดมิน (Admin)' : targetEmail.replace(/(.{2})(.*)(?=@)/, '$1***')}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-neutral-800 mb-1.5 text-center">
              กรอกรหัส PIN สี่หลัก (เริ่มต้น: <span className="text-amber-800 font-extrabold">{expectedPin}</span>)
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="• • • •"
                className="w-full bg-neutral-50 border-2 border-amber-400 text-center text-2xl tracking-[0.5em] font-black py-3 rounded-2xl focus:outline-none focus:bg-white focus:border-black transition-all"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-4" />
            </div>
            {errorMsg && (
              <div className="flex items-center space-x-1 text-red-600 text-[11px] font-bold mt-2 justify-center">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-extrabold text-xs hover:bg-neutral-100 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ยืนยันปลดล็อก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

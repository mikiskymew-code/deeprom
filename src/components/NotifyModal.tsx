import React, { useState } from 'react';
import { Product } from '../types';
import { X, Bell, Check } from 'lucide-react';

interface NotifyModalProps {
  product: Product | null;
  onClose: () => void;
}

export const NotifyModal: React.FC<NotifyModalProps> = ({ product, onClose }) => {
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContact('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-neutral-900">แจ้งเตือนเมื่อสินค้าพร้อมส่ง</h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 font-medium">
            {product.name} ({product.modelCode})
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>บันทึกการแจ้งเตือนเรียบร้อยแล้ว! เราจะส่งข้อความทันทีเมื่อมีสินค้าเข้า</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                เบอร์โทรศัพท์ หรือ LINE ID / Email
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="เช่น 081-234-5678 หรือ @technician_line"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1C1C1E] text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-black active:scale-98 transition-all"
            >
              บันทึกการรับแจ้งเตือน
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

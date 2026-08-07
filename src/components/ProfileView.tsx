import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Building2, FileText, Phone, MapPin, Award, Check } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-5 max-w-2xl mx-auto">
      {/* User Header Badge */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-100/90 shadow-2xs flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1C1C1E] text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-md">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-neutral-900 truncate">
            {user.name}
          </h2>
          <p className="text-xs text-neutral-500 font-medium truncate">
            {user.companyName}
          </p>
          <div className="mt-1.5 inline-flex items-center space-x-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            <Award className="w-3 h-3 text-amber-600" />
            <span>{user.tier}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
          ข้อมูลช่าง / นิติบุคคลผู้เสียภาษี
        </h3>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>บันทึกข้อมูลสำเร็จเรียบร้อย</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">ชื่อผู้ติดต่อหลัก</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-black"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">ชื่อบริษัท / ร้านค้า</label>
            <div className="relative">
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
              <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">เบอร์โทรศัพท์ติดต่อ</label>
            <div className="relative">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">ที่อยู่จัดส่งสินค้า / ออกใบกำกับภาษี</label>
            <div className="relative">
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-black"
              />
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1C1C1E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-black active:scale-98 transition-all"
        >
          บันทึกการเปลี่ยนแปลงข้อมูล
        </button>
      </form>
    </div>
  );
};

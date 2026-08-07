import React, { useState } from 'react';
import { SlidersHorizontal, Search, ChevronRight, X, ShieldCheck, LogIn, Lock, FileSpreadsheet, TrendingUp, HardDrive } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  totalItems: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilterDrawer: () => void;
  currentCategoryName: string;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onOpenAccessManagement: () => void;
  pendingRequestsCount: number;
  onOpenImporterModal?: () => void;
  onOpenSalesReportModal?: () => void;
  onOpenGoogleDriveModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  searchQuery,
  onSearchChange,
  onOpenFilterDrawer,
  currentCategoryName,
  currentUser,
  onOpenAuthModal,
  onOpenAccessManagement,
  pendingRequestsCount,
  onOpenImporterModal,
  onOpenSalesReportModal,
  onOpenGoogleDriveModal
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-amber-400 text-neutral-900 shadow-md transition-all">
      {/* Top Security & Auth Bar in Modern Dark Charcoal */}
      <div className="bg-[#18181B] text-white px-4 py-2 flex items-center justify-between text-xs font-medium border-b border-amber-500/30">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 rounded flex items-center space-x-1 shrink-0">
            <Lock className="w-3 h-3 stroke-[2.5]" />
            <span>SECURE SYSTEM</span>
          </span>
          <span className="text-[11px] text-neutral-300 font-medium truncate hidden sm:inline">
            ระบบความปลอดภัยจำกัดสิทธิ์เฉพาะผู้ได้รับอนุญาต
          </span>
        </div>

        {/* User Auth Info & Control Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              {/* Access Control & Product Management Button */}
              {(currentUser.role === 'OWNER' || currentUser.role === 'AUTHORIZED') && (
                <button
                  onClick={onOpenAccessManagement}
                  className="bg-amber-400 hover:bg-amber-300 text-black px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center space-x-1.5 shadow-xs transition-all"
                  title="แผงควบคุมสิทธิ์เข้าใช้งานและจัดการสินค้า"
                >
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{currentUser.role === 'OWNER' ? 'คุมสิทธิ์ระบบ' : 'จัดการสินค้า'}</span>
                  {currentUser.role === 'OWNER' && pendingRequestsCount > 0 && (
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Account Badge with Role */}
              <button
                onClick={onOpenAuthModal}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 border border-neutral-700 transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="max-w-[90px] sm:max-w-[130px] truncate">{currentUser.email}</span>
                <span className={`text-[9px] px-1 rounded font-mono ${
                  currentUser.role === 'OWNER' ? 'bg-amber-400 text-black font-extrabold' : 'bg-emerald-800 text-emerald-200'
                }`}>
                  {currentUser.role === 'OWNER' ? 'OWNER' : 'STAFF'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-amber-400 hover:bg-amber-300 text-black px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1 shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ Gmail</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Modern Yellow Header Area */}
      <div className="pt-3 pb-3 px-4">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center space-x-1.5 text-xs text-neutral-800 font-semibold mb-2">
          <span className="cursor-pointer hover:text-black transition-colors">หน้าแรก</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-700 stroke-[2.5]" />
          <span className="text-black font-extrabold">{currentCategoryName}</span>
        </nav>

        {/* Main Category Title & Count + Action Buttons */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-0.5">
              {currentCategoryName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-800 font-bold">
              พบอุปกรณ์ <span className="bg-black text-amber-400 px-2 py-0.5 rounded-md text-xs font-black">{totalItems}</span> รายการ
            </p>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Google Drive Integration Button */}
            {onOpenGoogleDriveModal && (
              <button
                onClick={onOpenGoogleDriveModal}
                className="h-10 px-2 sm:px-2.5 rounded-2xl bg-[#18181B] text-amber-400 font-extrabold text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all hover:bg-black border border-amber-400/40"
                title="Google Drive Cloud Integration"
              >
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">Google Drive</span>
              </button>
            )}

            {/* Sales Excel / Google Sheets Report Button */}
            {onOpenSalesReportModal && (
              <button
                onClick={onOpenSalesReportModal}
                className="h-10 px-2 rounded-2xl bg-emerald-800 text-emerald-100 font-extrabold text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all hover:bg-emerald-900"
                title="รายงานสรุปยอดขาย / Google Sheets & Excel"
              >
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span className="hidden md:inline">ยอดขาย/Excel</span>
              </button>
            )}

            {/* PDF/CSV Data Importer Button */}
            {onOpenImporterModal && (
              <button
                onClick={onOpenImporterModal}
                className="h-10 px-2 rounded-2xl bg-black text-amber-300 font-extrabold text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-all hover:bg-neutral-800"
                title="นำเข้าข้อมูล PDF / CSV (Forward Fill)"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">นำเข้า PDF</span>
              </button>
            )}

            {/* Search Toggle Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                showSearch || searchQuery 
                  ? 'bg-black text-amber-400' 
                  : 'bg-white text-black hover:bg-neutral-100 border border-amber-500/40'
              }`}
              aria-label="ค้นหาอุปกรณ์"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Filter Modal/Drawer Trigger Button */}
            <button
              onClick={onOpenFilterDrawer}
              className="w-10 h-10 rounded-2xl bg-[#18181B] text-amber-400 flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-black"
              aria-label="ตัวกรอง"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {(showSearch || searchQuery) && (
          <div className="mt-3 relative animate-in fade-in duration-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหาตามชื่อ, รหัสรุ่น (เช่น PC-75-IV, EL-90)..."
              className="w-full bg-white text-black placeholder-neutral-500 border-2 border-black rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-md font-medium"
              autoFocus
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

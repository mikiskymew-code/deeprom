import React from 'react';
import { TabType } from '../types';
import { LayoutGrid, Package, ShoppingBag, User, ShoppingCart, Flame, Heart } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  favoriteCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  favoriteCount = 0
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200/80 shadow-lg max-w-2xl mx-auto">
      {/* Floating Cart Button Bar if items selected */}
      {cartCount > 0 && (
        <div className="px-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </div>
            <span className="text-xs font-semibold">เลือกอุปกรณ์แล้ว {cartCount} รายการ</span>
          </div>
          <button
            onClick={onOpenCart}
            className="bg-white text-black hover:bg-neutral-100 px-3.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ดูตระกร้าสั่งซื้อ</span>
          </button>
        </div>
      )}

      {/* Main Tab Bar */}
      <nav className="grid grid-cols-5 py-2 px-1">
        {/* HOME */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'home' ? 'text-[#1C1C1E]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'home' ? 'font-black' : ''}`}>
            หน้าแรก
          </span>
        </button>

        {/* CATALOG */}
        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
            activeTab === 'catalog' ? 'text-[#1C1C1E]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === 'catalog' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'catalog' ? 'font-black' : ''}`}>
            แคตตาล็อก
          </span>
        </button>

        {/* RE-ORDER & FAVORITES (ซื้อซ้ำ & รายการโปรด) */}
        <button
          onClick={() => onSelectTab('daily')}
          className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
            activeTab === 'daily' ? 'text-[#1C1C1E]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'daily' ? 'text-red-500 fill-red-500 stroke-[2.5]' : 'text-red-500 stroke-[2]'}`} />
            {favoriteCount !== undefined && favoriteCount > 0 ? (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-black px-1 py-0.2 rounded-full shadow-2xs">
                {favoriteCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] font-black px-1 rounded-full animate-pulse">
                HOT
              </span>
            )}
          </div>
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'daily' ? 'font-black text-red-900' : 'text-red-700'}`}>
            ซื้อซ้ำ & โปรด
          </span>
        </button>

        {/* ORDERS */}
        <button
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'orders' ? 'text-[#1C1C1E]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'orders' ? 'font-black' : ''}`}>
            คำสั่งซื้อ
          </span>
        </button>

        {/* PROFILE */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'profile' ? 'text-[#1C1C1E]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          </div>
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'profile' ? 'font-black' : ''}`}>
            โปรไฟล์
          </span>
        </button>
      </nav>
    </div>
  );
};

import React from 'react';
import { FilterState } from '../types';
import { X, RotateCcw, Check } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-[#F8FAFC]">
          <h2 className="text-base font-extrabold text-neutral-900">
            ตัวกรองอุปกรณ์ (Filters)
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onResetFilters}
              className="text-xs text-neutral-500 hover:text-black font-semibold flex items-center space-x-1 px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ต</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-600 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Form Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              ยี่ห้อสินค้า (Brand)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['ทั้งหมด', 'KMCT', 'HARU', 'AEROFLEX', 'DAIKIN', 'CARRIER', 'TOTO', 'MITSUBISHI', 'YAZAKI'].map((b) => (
                <button
                  key={b}
                  onClick={() => onUpdateFilters({ brand: b === 'ทั้งหมด' ? 'ALL' : b as any })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    (filters.brand === b || (filters.brand === 'ALL' && b === 'ทั้งหมด'))
                      ? 'bg-amber-500 text-black font-black border-amber-600'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              ขนาดท่อ (Size)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['ทั้งหมด', '75mm', '100mm', '140mm'].map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateFilters({ size })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    filters.size === size
                      ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              สีอุปกรณ์ (Color)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['ทั้งหมด', 'ขาว', 'ครีม', 'เทา'].map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdateFilters({ color })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    filters.color === color
                      ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              ประเภทอุปกรณ์ (Category)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'ทั้งหมด',
                'รางตรง',
                'ข้องอ',
                'ข้อต่อ',
                'ฝาครอบ',
                'ท่อยืดหยุ่น',
                'ฝาครอบเพดาน'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => onUpdateFilters({ category: cat })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    filters.category === cat
                      ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Checkbox */}
          <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer">
            <span className="text-xs font-bold text-neutral-800">
              แสดงเฉพาะสินค้าที่มีในคลัง (In Stock Only)
            </span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onUpdateFilters({ inStockOnly: e.target.checked })}
              className="w-4 h-4 accent-black rounded"
            />
          </label>
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-neutral-100 bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="w-full bg-[#1C1C1E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-black active:scale-98"
          >
            ใช้ตัวกรองอุปกรณ์
          </button>
        </div>
      </div>
    </div>
  );
};

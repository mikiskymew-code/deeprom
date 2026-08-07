import React, { useState } from 'react';
import { Product, ProductBrand, TabType } from '../types';
import { ProductCard } from './ProductCard';
import { Flame, Zap, PackageCheck, Sparkles, Filter, Heart, ArrowRight, LayoutGrid, List } from 'lucide-react';

interface DailyEssentialsViewProps {
  products: Product[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenNotifyModal: (product: Product) => void;
  onOpenDetailModal: (product: Product) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (productId: string) => void;
  onSelectTab?: (tab: TabType) => void;
}

export const DailyEssentialsView: React.FC<DailyEssentialsViewProps> = ({
  products,
  cartQuantities,
  onUpdateQuantity,
  onOpenNotifyModal,
  onOpenDetailModal,
  favoriteIds = [],
  onToggleFavorite,
  onSelectTab
}) => {
  const [filterMode, setFilterMode] = useState<'favorites' | 'reorder' | 'all'>('favorites');
  const [selectedBrand, setSelectedBrand] = useState<ProductBrand | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Favorites products list
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));
  
  // Re-order essential products list
  const reorderProducts = products.filter(p => p.isDailyEssential || p.badge === 'BEST SELLER');

  // Determine active displayed products based on filterMode
  let activeProducts: Product[] = [];
  if (filterMode === 'favorites') {
    activeProducts = favoriteProducts;
  } else if (filterMode === 'reorder') {
    activeProducts = reorderProducts;
  } else {
    // combine both unique
    const combinedMap = new Map<string, Product>();
    favoriteProducts.forEach(p => combinedMap.set(p.id, p));
    reorderProducts.forEach(p => combinedMap.set(p.id, p));
    activeProducts = Array.from(combinedMap.values());
  }

  // Brand Filter
  const filteredProducts = activeProducts.filter(p => {
    if (selectedBrand === 'ALL') return true;
    return p.brand === selectedBrand;
  });

  const brands: { id: ProductBrand | 'ALL'; name: string }[] = [
    { id: 'ALL', name: 'ยี่ห้อทั้งหมด' },
    { id: 'HARU', name: 'HARU' },
    { id: 'SCG', name: 'SCG' },
    { id: 'YAZAKI', name: 'YAZAKI' },
    { id: 'THAI UNION', name: 'THAI UNION' },
    { id: 'KMCT', name: 'KMCT' },
    { id: 'AEROFLEX', name: 'AEROFLEX' },
    { id: 'TOTO', name: 'TOTO slim' },
    { id: 'อื่นๆ', name: 'อุปกรณ์อื่นๆ' },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Hero Banner for Re-order & Favorites */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 rounded-3xl p-5 text-neutral-900 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-black/90 text-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 animate-pulse" />
            <span>RE-ORDER & FAVORITE ITEMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-black leading-tight">
            สินค้าซื้อซ้ำ & รายการโปรด ❤️
          </h1>
          <p className="text-xs font-semibold text-neutral-900 opacity-90 max-w-md">
            รวมรายการสินค้าที่คุณกดถูกใจไว้ และอุปกรณ์ยอดนิยมสำหรับช่างแอร์ ให้คุณสั่งซ้ำและเติมของติดรถได้สะดวกรวดเร็วในคลิกเดียว
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold">
            <div className="bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center space-x-1 border border-black/10">
              <Heart className="w-3.5 h-3.5 text-red-600 fill-red-500" />
              <span>รายการโปรด {favoriteProducts.length} รายการ</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center space-x-1 border border-black/10">
              <Zap className="w-3.5 h-3.5 text-amber-800" />
              <span>ยกลังรับส่วนลดราคาส่งทันที</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Toggle Tabs (รายการโปรด / สินค้าซื้อซ้ำบ่อย / ทั้งหมด) */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs flex space-x-1">
        <button
          onClick={() => setFilterMode('favorites')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            filterMode === 'favorites'
              ? 'bg-red-500 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${filterMode === 'favorites' ? 'fill-white text-white' : 'text-red-500'}`} />
          <span>รายการโปรด</span>
          {favoriteProducts.length > 0 && (
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
              filterMode === 'favorites' ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
            }`}>
              {favoriteProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilterMode('reorder')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            filterMode === 'reorder'
              ? 'bg-amber-500 text-black shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${filterMode === 'reorder' ? 'fill-black text-black' : 'text-amber-600'}`} />
          <span>สินค้าซื้อซ้ำบ่อย</span>
        </button>

        <button
          onClick={() => setFilterMode('all')}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1 ${
            filterMode === 'all'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <span>ทั้งหมด</span>
        </button>
      </div>

      {/* Brand Filters Horizontal Scroll */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-neutral-800 px-1">
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>กรองตามยี่ห้อ (Brand Filter)</span>
          </div>
          <span className="text-[11px] font-normal text-neutral-500">
            พบ {filteredProducts.length} รายการ
          </span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {brands.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                selectedBrand === b.id
                  ? 'bg-amber-500 text-black shadow-sm font-black'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* List Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-extrabold text-neutral-900 flex items-center space-x-1.5">
          {filterMode === 'favorites' ? (
            <>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>รายการสินค้าที่คุณกดถูกใจไว้ ({filteredProducts.length})</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>รายการอุปกรณ์สั่งซื้อซ้ำยอดนิยม ({filteredProducts.length})</span>
            </>
          )}
        </h2>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-xl text-neutral-600 font-bold border border-neutral-300/40">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2 py-0.5 rounded-lg flex items-center space-x-1 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#1C1C1E] text-amber-400 shadow-2xs font-extrabold'
                : 'hover:text-neutral-900'
            }`}
            title="มุมมองตาราง"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[10px]">ตาราง</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-0.5 rounded-lg flex items-center space-x-1 transition-all ${
              viewMode === 'list'
                ? 'bg-[#1C1C1E] text-amber-400 shadow-2xs font-extrabold'
                : 'hover:text-neutral-900'
            }`}
            title="มุมมองรายการ"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[10px]">รายการ</span>
          </button>
        </div>
      </div>

      {/* Products Grid or List Container */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:gap-3' : 'space-y-2.5'}>
        {filteredProducts.length === 0 ? (
          filterMode === 'favorites' ? (
            <div className={`p-8 text-center bg-white rounded-3xl border border-neutral-200 space-y-3 ${
              viewMode === 'grid' ? 'col-span-2' : ''
            }`}>
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-neutral-800">ยังไม่มีรายการสินค้าโปรด</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  กดปุ่มหัวใจ ❤️ บนสินค้าที่คุณต้องใช้งานบ่อยๆ เพื่อรวมไว้ที่นี่สำหรับกดสั่งซื้อซ้ำได้อย่างรวดเร็ว
                </p>
              </div>
              {onSelectTab && (
                <button
                  onClick={() => onSelectTab('catalog')}
                  className="mt-2 inline-flex items-center space-x-1 bg-neutral-900 hover:bg-black text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
                >
                  <span>ไปเลือกสินค้าในแคตตาล็อก</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className={`p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs ${
              viewMode === 'grid' ? 'col-span-2' : ''
            }`}>
              ไม่พบสินค้าในหมวดหมู่หรือยี่ห้อที่เลือก
            </div>
          )
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartQuantities[product.id] || 0}
              onUpdateQuantity={onUpdateQuantity}
              onOpenNotifyModal={onOpenNotifyModal}
              onOpenDetailModal={onOpenDetailModal}
              isFavorite={favoriteIds.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              viewMode={viewMode}
            />
          ))
        )}
      </div>
    </div>
  );
};


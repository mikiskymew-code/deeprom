import React from 'react';
import { TabType, Product, Order } from '../types';
import { Package, Shield, Zap, Wrench, ChevronRight, Truck, Award, ShoppingBag, Clock, RotateCcw, Plus } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface HomeViewProps {
  onNavigateToCatalog: (category?: string, brand?: any) => void;
  featuredProducts?: Product[];
  orders?: Order[];
  products?: Product[];
  onOpenDetailModal: (p: Product) => void;
  onUpdateQuantity?: (productId: string, delta: number) => void;
  cartQuantities?: Record<string, number>;
  onSelectTab?: (tab: TabType) => void;
}

// Brand Logo Data URLs matching the official user provided brand banners:
// 1. TOTO slim (Yellow rounded box with purple border)
// 2. YAZAKI (Red triangle wing + colorful wire coils)
// 3. THAI UNION (Red oval logo + wire rolls)
// 4. SCG (Red SCG emblem + white PVC pipes & fittings)
// 5. KMCT (KMCT copper triangle + copper pipe coils)
// 6. HARU (Purple HARU banner with "สวย!...สว่าง!!" quote)
// 7. AEROFLEX (Yellow AEROFLEX logo + black insulation tube)
// 8. อุปกรณ์อื่นๆ (Red title text + HVAC spray bottle & parts)

const BRAND_LOGOS: { id: string; name: string; tag: string; logoSvg: string }[] = [
  {
    id: 'HARU',
    name: 'HARU',
    tag: 'อุปกรณ์ไฟฟ้า HARU',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><rect x="2" y="2" width="156" height="66" fill="%23581C87" rx="8" stroke="%233B0764" stroke-width="2"/><text x="8" y="18" font-family="sans-serif" font-size="7.5" font-weight="bold" fill="%23E9D5FF">รางครอบและอุปกรณ์ตัดต่อไฟฟ้า</text><text x="8" y="47" font-family="'Arial Black', sans-serif" font-weight="900" font-size="30" fill="%23FFFFFF">HARU</text><text x="9" y="61" font-family="sans-serif" font-weight="bold" font-size="10" fill="%23FDE047">"สวย!...สว่าง!!"</text><rect x="108" y="8" width="44" height="52" fill="%23FFFFFF" rx="5" stroke="%23D8B4FE" stroke-width="1.5"/><circle cx="130" cy="28" r="13" fill="none" stroke="%23581C87" stroke-width="2.5"/><path d="M120 38 L140 18" stroke="%23DC2626" stroke-width="3"/><text x="130" y="53" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="%23581C87" text-anchor="middle">SAFETY</text></svg>`
  },
  {
    id: 'SCG',
    name: 'SCG',
    tag: 'ท่อพีวีซี & ข้อต่อ',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><g transform="translate(8, 4)"><polygon points="18,0 34,8 34,25 18,33 2,25 2,8" fill="%23D32F2F"/><circle cx="18" cy="16" r="8" fill="%23FFFFFF"/><path d="M13 18 C13 12 23 12 23 18 C23 20 18 20 18 23" stroke="%23D32F2F" stroke-width="2.5" fill="none"/><text x="40" y="26" font-family="'Arial Black', sans-serif" font-weight="900" font-size="28" fill="%23D32F2F">SCG</text></g><g transform="translate(4, 38)"><rect x="2" y="6" width="68" height="7" fill="%23E2E8F0" stroke="%2394A3B8" stroke-width="1" rx="2"/><rect x="2" y="14" width="68" height="7" fill="%23CBD5E1" stroke="%2394A3B8" stroke-width="1" rx="2"/><rect x="2" y="22" width="68" height="7" fill="%23E2E8F0" stroke="%2394A3B8" stroke-width="1" rx="2"/><path d="M82 26 L82 12 A10 10 0 0 1 92 2 L112 2 L112 9 L100 9 A4 4 0 0 0 96 13 L96 26 Z" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="1.2"/><path d="M122 26 L122 6 L140 6 L140 26 Z" fill="%23E2E8F0" stroke="%2394A3B8" stroke-width="1.2"/><path d="M116 13 L146 13 L146 19 L116 19 Z" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="1.2"/></g></svg>`
  },
  {
    id: 'YAZAKI',
    name: 'YAZAKI',
    tag: 'สายไฟมาตรฐาน มอก.',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><polygon points="2,2 54,2 2,22" fill="%23D32F2F"/><text x="58" y="21" font-family="'Arial Black', sans-serif" font-weight="900" font-size="22" fill="%23000000" letter-spacing="0.5">YAZAKI</text><g transform="translate(2, 26)"><ellipse cx="18" cy="22" rx="17" ry="15" fill="%2300B4D8" stroke="%230077B6" stroke-width="2"/><ellipse cx="18" cy="22" rx="8" ry="6" fill="%23FFFFFF"/><ellipse cx="44" cy="19" rx="18" ry="16" fill="%23FFC300" stroke="%23E65100" stroke-width="2"/><ellipse cx="44" cy="19" rx="8" ry="6" fill="%23FFFFFF"/><ellipse cx="72" cy="17" rx="18" ry="16" fill="%23E63946" stroke="%23900C3F" stroke-width="2"/><ellipse cx="72" cy="17" rx="8" ry="6" fill="%23FFFFFF"/><ellipse cx="100" cy="17" rx="18" ry="16" fill="%231D3557" stroke="%2303045E" stroke-width="2"/><ellipse cx="100" cy="17" rx="8" ry="6" fill="%23FFFFFF"/><ellipse cx="128" cy="19" rx="18" ry="16" fill="%2370E000" stroke="%2338B000" stroke-width="2"/><ellipse cx="128" cy="19" rx="8" ry="6" fill="%23FFFFFF"/></g></svg>`
  },
  {
    id: 'THAI UNION',
    name: 'THAI UNION',
    tag: 'สายไฟ THAI UNION',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><rect x="10" y="2" width="140" height="42" fill="%23D32F2F" rx="5"/><ellipse cx="80" cy="23" rx="62" ry="18" fill="none" stroke="%23FFFFFF" stroke-width="2.5"/><text x="80" y="21" font-family="'Arial Black', sans-serif" font-weight="900" font-size="15" fill="%23FFFFFF" text-anchor="middle">THAI</text><text x="80" y="36" font-family="'Arial Black', sans-serif" font-weight="900" font-size="15" fill="%23FFFFFF" text-anchor="middle">UNION</text><g transform="translate(2, 44)"><ellipse cx="28" cy="14" rx="25" ry="11" fill="%238093F1" stroke="%232B2D42" stroke-width="1.5"/><ellipse cx="28" cy="14" rx="11" ry="5" fill="%23FFFFFF"/><ellipse cx="80" cy="14" rx="25" ry="11" fill="%23E2E8F0" stroke="%2364748B" stroke-width="1.5"/><ellipse cx="80" cy="14" rx="11" ry="5" fill="%23FFFFFF"/><ellipse cx="132" cy="14" rx="25" ry="11" fill="%23334155" stroke="%230F172A" stroke-width="1.5"/><ellipse cx="132" cy="14" rx="11" ry="5" fill="%23FFFFFF"/></g></svg>`
  },
  {
    id: 'KMCT',
    name: 'KMCT',
    tag: 'ท่อทองแดงม้วน',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><g transform="translate(8, 4)"><polygon points="8,22 24,4 19,24" fill="%23C87038"/><polygon points="19,24 32,13 25,26" fill="%23D97724"/><text x="38" y="23" font-family="'Arial Black', sans-serif" font-weight="900" font-size="26" fill="%230052A5" letter-spacing="0.5">KMCT</text></g><g transform="translate(5, 32)"><ellipse cx="75" cy="16" rx="65" ry="17" fill="none" stroke="%23D97724" stroke-width="7"/><ellipse cx="75" cy="16" rx="65" ry="17" fill="none" stroke="%23F59E0B" stroke-width="1.5"/><ellipse cx="75" cy="23" rx="54" ry="13" fill="none" stroke="%23B45309" stroke-width="5"/></g></svg>`
  },
  {
    id: 'AEROFLEX',
    name: 'AEROFLEX',
    tag: 'ฉนวนยางดำ EPDM',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><g transform="translate(2, 4)"><text x="78" y="23" font-family="'Arial Black', sans-serif" font-weight="900" font-size="22" fill="%23EAB308" text-anchor="middle" letter-spacing="0.5" stroke="%23854D0E" stroke-width="0.8">AEROFLEX®</text><text x="78" y="33" font-family="sans-serif" font-weight="bold" font-size="6.8" fill="%2318181B" text-anchor="middle">CLOSED CELL EPDM INSULATION FOR HVAC</text></g><g transform="translate(10, 38)"><path d="M10 20 C20 4, 120 4, 140 20" fill="none" stroke="%2318181B" stroke-width="16" stroke-linecap="round"/><ellipse cx="10" cy="20" rx="4" ry="8" fill="%233F3F46"/><ellipse cx="140" cy="20" rx="4" ry="8" fill="%2309090B"/><path d="M15 20 C25 7, 115 7, 135 20" fill="none" stroke="%233F3F46" stroke-width="2" stroke-linecap="round"/></g></svg>`
  },
  {
    id: 'TOTO',
    name: 'TOTO slim',
    tag: 'รางครอบท่อ 75/100',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><rect x="2" y="3" width="156" height="64" fill="%23FFE800" rx="16" stroke="%233B0764" stroke-width="5"/><text x="24" y="50" font-family="'Arial Black', sans-serif" font-weight="900" font-size="40" fill="%232E1403" letter-spacing="-1">TOTO</text><text x="116" y="47" font-family="'Arial', sans-serif" font-weight="bold" font-size="21" fill="%232E1403">slim</text></svg>`
  },
  {
    id: 'อื่นๆ',
    name: 'อุปกรณ์อื่นๆ',
    tag: 'อุปกรณ์ช่าง & อะไหล่แอร์',
    logoSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70"><rect width="160" height="70" fill="%23FFFFFF" rx="6"/><text x="80" y="25" font-family="'Kanit', 'Arial', sans-serif" font-weight="900" font-size="22" fill="%23DC2626" text-anchor="middle">อุปกรณ์อื่นๆ</text><g transform="translate(2, 28)"><rect x="5" y="15" width="24" height="24" fill="%23475569" rx="3"/><circle cx="17" cy="27" r="6" fill="%2394A3B8"/><rect x="36" y="17" width="18" height="22" fill="%230D9488" rx="2"/><rect x="40" y="12" width="10" height="5" fill="%2314B8A6"/><rect x="62" y="19" width="18" height="20" fill="%231E293B" rx="2"/><rect x="66" y="15" width="3" height="4" fill="%2394A3B8"/><rect x="72" y="15" width="3" height="4" fill="%2394A3B8"/><rect x="86" y="21" width="20" height="18" fill="%2364748B" rx="1"/><rect x="126" y="5" width="22" height="33" fill="%230284C7" rx="4"/><path d="M131 5 L131 0 L140 0 L140 5 Z" fill="%230369A1"/><path d="M140 2 L150 2 L150 7 L140 7 Z" fill="%230284C7"/></g></svg>`
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToCatalog,
  featuredProducts = [],
  orders = [],
  products = [],
  onOpenDetailModal,
  onUpdateQuantity,
  cartQuantities = {},
  onSelectTab
}) => {
  // Extract products from past orders
  const allOrderItems = orders.flatMap(o => o.items);
  
  // Find matching full product objects from `products` or construct fallback items
  const previouslyPurchasedProducts: { product: Product; qtyPurchased: number }[] = [];
  const addedIds = new Set<string>();

  allOrderItems.forEach((item) => {
    // Find matching product by name or modelCode
    const foundProduct = products.find(
      (p) => p.name === item.productName || p.modelCode === item.modelCode
    );

    if (foundProduct && !addedIds.has(foundProduct.id)) {
      addedIds.add(foundProduct.id);
      previouslyPurchasedProducts.push({
        product: foundProduct,
        qtyPurchased: item.qty
      });
    }
  });

  // Fallback if no specific matched products in state: take first few products as previously ordered demo items
  const displayedPurchased = previouslyPurchasedProducts.length > 0
    ? previouslyPurchasedProducts
    : products.slice(0, 4).map(p => ({ product: p, qtyPurchased: 2 }));

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 max-w-2xl mx-auto">
      {/* Banner Card */}
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2D2D30] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-xs">
            HVAC PRO SERIES 2026
          </span>
          <h2 className="text-xl font-extrabold leading-tight">
            อะไหล่ดีพร้อมแอร์ - ศูนย์รวมอะไหล่และอุปกรณ์แอร์ราคาส่ง
          </h2>
          <p className="text-xs text-neutral-300 max-w-xs font-normal">
            PVC เกรด A ทนแสง UV ไม่กรอบแตกง่าย มาตรฐานงานคอนโดและบ้านโครงการ
          </p>
          <button
            onClick={() => onNavigateToCatalog()}
            className="mt-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md hover:bg-neutral-100 active:scale-95 transition-all"
          >
            <span>เข้าชมแคตตาล็อกสินค้า</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Decorative Grid SVG in background */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
          <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
            <rect width="100" height="100" rx="20" />
          </svg>
        </div>
      </div>

      {/* Brand Logo Grid - Updated: Daikin/Carrier/Mitsubishi removed, 'อื่นๆ' added */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight flex items-center space-x-1.5">
              <span>เลือกตามแบรนด์สินค้า (Brand Category)</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {BRAND_LOGOS.length} แบรนด์
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium">
              คลิกโลโก้ยี่ห้อเพื่อดูสินค้าและราคาพิเศษของแบรนด์นั้นๆ
            </p>
          </div>
          <button 
            onClick={() => onNavigateToCatalog()} 
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center space-x-0.5"
          >
            <span>ดูแบรนด์ทั้งหมด</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BRAND_LOGOS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onNavigateToCatalog(undefined, brand.id)}
              className="bg-white p-1.5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 active:scale-95 transition-all flex flex-col items-center justify-between text-center group h-28 overflow-hidden"
            >
              <div className="w-full flex-1 flex items-center justify-center p-0.5 overflow-hidden">
                <img 
                  src={brand.logoSvg} 
                  alt={brand.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                />
              </div>
              <div className="w-full pt-1 pb-1 bg-neutral-50/80 rounded-b-xl border-t border-neutral-100">
                <span className="block text-xs font-black text-neutral-900 leading-none">
                  {brand.name}
                </span>
                <span className="text-[9.5px] font-medium text-neutral-500 block mt-0.5 truncate px-1">
                  {brand.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Previously Purchased Items (รายการที่เคยซื้อ) - Replaced Popular Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight">
                รายการที่เคยซื้อ (Previously Purchased)
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                รายการอุปกรณ์ที่คุณเคยสั่งซื้อ สะดวกกดสั่งซื้อซ้ำได้ทันที
              </p>
            </div>
          </div>
          {onSelectTab && (
            <button 
              onClick={() => onSelectTab('orders')} 
              className="text-xs font-bold text-neutral-600 hover:text-black flex items-center space-x-0.5 whitespace-nowrap"
            >
              <span>ประวัติการสั่งซื้อ</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedPurchased.map(({ product, qtyPurchased }) => (
            <div
              key={product.id}
              className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all flex items-center space-x-3 relative group"
            >
              <div 
                onClick={() => onOpenDetailModal(product)}
                className="w-16 h-16 bg-neutral-50 rounded-xl p-1 flex-shrink-0 flex items-center justify-center cursor-pointer border border-neutral-100"
              >
                <img 
                  src={formatImageUrl(product.imageUrl, product.modelCode, product.name, product.brand)} 
                  alt={product.name} 
                  onError={(e) => handleImageError(e, product.modelCode, product.name, product.brand)}
                  className="max-h-full object-contain" 
                />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="inline-block bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono">
                  {product.brand}
                </span>
                <h4 
                  onClick={() => onOpenDetailModal(product)}
                  className="text-xs font-extrabold text-neutral-900 truncate cursor-pointer hover:text-amber-600"
                >
                  {product.name}
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono">
                  {product.modelCode}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-emerald-600">
                    ฿{product.price.toFixed(2)}
                  </span>
                  
                  {onUpdateQuantity && (
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="bg-neutral-900 hover:bg-black text-amber-400 font-bold px-2.5 py-1 rounded-xl text-[11px] flex items-center space-x-1 shadow-2xs active:scale-95 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>สั่งซ้ำ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition Perks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-neutral-100 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">จัดส่งด่วนทั่วไทย</h4>
            <p className="text-[10px] text-neutral-500">ฟรีเมื่อสั่งครบ ฿3,000</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-neutral-100 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">ราคาสมาชิกช่าง</h4>
            <p className="text-[10px] text-neutral-500">ส่วนลดพิเศษสูงสุด 10%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

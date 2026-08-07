import React from 'react';
import { Product } from '../types';
import { X, Check, ShieldCheck, Box, Ruler, Wrench, ShoppingBag, Heart } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-[#F8FAFC]">
          <span className="text-xs font-bold text-neutral-500 font-mono">
            MODEL: {product.modelCode}
          </span>
          <div className="flex items-center space-x-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(product.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isFavorite 
                    ? 'bg-red-50 text-red-500 ring-2 ring-red-200 shadow-xs' 
                    : 'bg-neutral-200/80 text-neutral-600 hover:text-red-500'
                }`}
                title={isFavorite ? 'ยกเลิกถูกใจ' : 'กดถูกใจสินค้า'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-600 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Specs Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Main Image Banner */}
          <div className="w-full h-48 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-center p-4 relative">
            <img
              src={formatImageUrl(product.imageUrl, product.modelCode, product.name, product.brand)}
              alt={product.name}
              onError={(e) => handleImageError(e, product.modelCode, product.name, product.brand)}
              className="max-h-full object-contain"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#1C1C1E] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Title and Price */}
          <div>
            <div className="flex items-center space-x-2">
              {product.brand && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2 py-0.5 rounded-md">
                  {product.brand}
                </span>
              )}
              <h2 className="text-lg font-extrabold text-neutral-900 leading-snug">
                {product.name}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              ซีรีส์: <span className="text-neutral-800 font-semibold">{product.series}</span> • เกรด: <span className="text-neutral-800 font-semibold">{product.grade}</span>
            </p>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#1C1C1E]">
                ฿{product.price.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-neutral-500">/{product.unit}</span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ฿{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-neutral-500 font-medium ml-2">
                (ราคารวมภาษีแล้ว)
              </span>
            </div>

            {/* Bulk Tier Banner */}
            {product.boxQty && product.boxQty > 1 && product.boxPrice && (
              <div className="mt-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-between shadow-2xs">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-amber-700" />
                  <span>ราคาสั่งยกลัง ({product.boxQty} {product.unit})</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-950">฿{product.boxPrice.toLocaleString()}</span>
                  <span className="block text-[10px] text-amber-800 font-medium">
                    (ตก{product.unit}ละ ฿{(product.bulkUnitPrice || (product.boxPrice / product.boxQty)).toFixed(2)})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3 text-xs">
            <h3 className="font-extrabold text-neutral-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-neutral-700" />
              <span>ข้อมูลทางเทคนิควิศวกรรม (Technical Specs)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-neutral-700 pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">ขนาดมิติ (Size)</span>
                <span className="font-bold text-neutral-900">{product.dimensions}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">วัสดุผลิต (Material)</span>
                <span className="font-bold text-neutral-900">{product.material}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">การบรรจุกล่อง (Box Qty)</span>
                <span className="font-bold text-neutral-900">{product.boxQty} ชิ้น/กล่อง</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">สถานะคลังสินค้า</span>
                <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `พร้อมส่ง (${product.stock} ชิ้น)` : 'สินค้าหมดชั่วคราว'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1.5">
              รายละเอียดคุณสมบัติ
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features check list */}
          <div className="space-y-1.5 text-xs text-neutral-700">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>ผ่านการทดสอบมาตรฐานทนแสง UV ไม่เหลืองกรอบแม้ตากแดด</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>คุณสมบัติพลาสติก PVC Flame Retardant ไม่ลามไฟ</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>เข้าล็อคแน่นด้วยระบบ Snap-Lock ติดตั้งรวดเร็ว สวยงาม</span>
            </div>
          </div>
        </div>

        {/* Footer Add to Cart Button */}
        <div className="p-4 border-t border-neutral-100 bg-[#F8FAFC]">
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            disabled={product.isSoldOut || product.stock <= 0}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all ${
              product.isSoldOut || product.stock <= 0
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-[#1C1C1E] text-white hover:bg-black active:scale-98'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {product.isSoldOut || product.stock <= 0
                ? 'สินค้าหมดชั่วคราว'
                : `เพิ่มลงตระกร้า - ฿${product.price.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

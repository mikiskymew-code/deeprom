import React from 'react';
import { Product } from '../types';
import { Bell, Minus, Plus, Info, Heart } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenNotifyModal: (product: Product) => void;
  onOpenDetailModal: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
  canManageProduct?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onUpdateQuantity,
  onOpenNotifyModal,
  onOpenDetailModal,
  isFavorite = false,
  onToggleFavorite,
  onDeleteProduct,
  canManageProduct = false,
  viewMode = 'grid'
}) => {
  const isSoldOut = product.isSoldOut || product.stock <= 0;

  // -------------------------------------------------------------
  // GRID VIEW MODE (Vertical Card with Full Eye-Catching Image)
  // -------------------------------------------------------------
  if (viewMode === 'grid') {
    return (
      <div className={`bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-neutral-100/80 transition-all duration-200 flex flex-col justify-between h-full relative ${
        isSoldOut ? 'opacity-85' : 'hover:shadow-md'
      }`}>
        <div>
          {/* Top Square Full Product Image */}
          <div 
            onClick={() => onOpenDetailModal(product)}
            className="w-full aspect-square bg-neutral-50 rounded-xl relative overflow-hidden cursor-pointer group border border-neutral-100 shadow-2xs"
          >
            <img
              src={formatImageUrl(product.imageUrl, product.modelCode, product.name, product.brand)}
              alt={product.name}
              onError={(e) => handleImageError(e, product.modelCode, product.name, product.brand)}
              className={`w-full h-full object-contain p-2 transition-transform duration-300 ${
                isSoldOut ? 'filter grayscale opacity-60' : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />

            {/* Badges Overlay */}
            {product.badge && (
              <div className="absolute top-1 left-1 z-10">
                {product.badge === 'IN STOCK' && (
                  <span className="bg-[#1C1C1E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    IN STOCK
                  </span>
                )}
                {product.badge === 'BEST SELLER' && (
                  <span className="bg-[#E11D48] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    BEST SELLER
                  </span>
                )}
                {product.badge === 'SOLD OUT' && (
                  <span className="bg-neutral-800/80 backdrop-blur-xs text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                    SOLD OUT
                  </span>
                )}
                {product.badge === 'NEW' && (
                  <span className="bg-[#2563EB] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    NEW
                  </span>
                )}
              </div>
            )}

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className={`absolute top-1 right-1 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  isFavorite 
                    ? 'bg-white text-red-500 fill-red-500 shadow-md ring-2 ring-red-200' 
                    : 'bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 shadow-xs'
                }`}
                title={isFavorite ? 'ยกเลิกถูกใจ' : 'กดถูกใจ'}
              >
                <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}

            {/* Sold Out Stamp */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-neutral-200/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-neutral-900/80 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded tracking-widest shadow-md">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Brand Tag & Name */}
          <div className="mt-2">
            {product.brand && (
              <span className="inline-block bg-amber-100 text-amber-950 border border-amber-300 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded text-center truncate shadow-2xs">
                {product.brand}
              </span>
            )}
            <h2 
              onClick={() => onOpenDetailModal(product)}
              className={`text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 mt-1 cursor-pointer transition-colors ${
                isSoldOut ? 'text-neutral-500' : 'text-[#1C1C1E] hover:text-amber-600'
              }`}
              title={product.name}
            >
              {product.name}
            </h2>
            <p className="text-[10px] sm:text-xs text-neutral-500 font-mono font-bold mt-0.5 truncate">
              {product.modelCode}
            </p>
          </div>
        </div>

        {/* Bottom Price & Add Controls */}
        <div className="mt-2 pt-1 border-t border-neutral-100 flex flex-col gap-1.5">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              {product.originalPrice && (
                <span className="block text-[10px] text-neutral-400 line-through leading-tight">
                  ฿{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={`text-xs sm:text-sm font-black ${
                isSoldOut ? 'text-neutral-400' : 'text-[#1C1C1E]'
              }`}>
                ฿{quantity >= (product.boxQty || 999) && product.boxPrice 
                  ? (product.bulkUnitPrice || (product.boxPrice / product.boxQty!)).toFixed(2) 
                  : product.price.toFixed(2)}
              </span>
              <span className="text-[9px] text-neutral-500 font-medium ml-0.5">/{product.unit}</span>
            </div>

            {product.boxQty && product.boxQty > 1 && (
              <span className="text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                ยกลัง {product.boxQty}
              </span>
            )}
          </div>

          {/* Stepper or Add Button */}
          <div>
            {isSoldOut ? (
              <button
                onClick={() => onOpenNotifyModal(product)}
                className="w-full bg-[#EFECE6] hover:bg-[#E4E0D7] active:scale-95 text-neutral-700 text-[11px] font-medium py-1.5 rounded-xl flex items-center justify-center space-x-1 transition-all"
              >
                <Bell className="w-3 h-3 text-neutral-600" />
                <span>แจ้งเตือน</span>
              </button>
            ) : quantity === 0 ? (
              <button
                onClick={() => onUpdateQuantity(product.id, 1)}
                className="w-full bg-[#1C1C1E] hover:bg-black text-amber-400 active:scale-95 text-[11px] font-extrabold py-1.5 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>เพิ่มสินค้า</span>
              </button>
            ) : (
              <div className="bg-[#EFECE6] rounded-xl p-0.5 flex items-center justify-between border border-neutral-200/50">
                <button
                  onClick={() => onUpdateQuantity(product.id, -1)}
                  className="w-6 h-6 rounded-lg bg-white text-neutral-800 flex items-center justify-center shadow-2xs hover:bg-neutral-100 active:scale-95 transition-all"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="text-xs font-black text-neutral-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, 1)}
                  disabled={quantity >= product.stock}
                  className="w-6 h-6 rounded-lg bg-[#1C1C1E] text-white flex items-center justify-center shadow-2xs hover:bg-black active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST VIEW MODE (Compact Horizontal Row)
  // -------------------------------------------------------------
  return (
    <div className={`bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-neutral-100/80 transition-all duration-200 relative ${
      isSoldOut ? 'opacity-85' : 'hover:shadow-md'
    }`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Left Column: Product Image & Brand Tag */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div 
            onClick={() => onOpenDetailModal(product)}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-50 rounded-xl relative overflow-hidden cursor-pointer group border border-neutral-100 shadow-2xs"
          >
            <img
              src={formatImageUrl(product.imageUrl, product.modelCode, product.name, product.brand)}
              alt={product.name}
              onError={(e) => handleImageError(e, product.modelCode, product.name, product.brand)}
              className={`w-full h-full object-contain p-1.5 transition-transform duration-300 ${
                isSoldOut ? 'filter grayscale opacity-60' : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />

            {/* Badge Overlay */}
            {product.badge && (
              <div className="absolute top-1 left-1 z-10">
                {product.badge === 'IN STOCK' && (
                  <span className="bg-[#1C1C1E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    IN STOCK
                  </span>
                )}
                {product.badge === 'BEST SELLER' && (
                  <span className="bg-[#E11D48] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    BEST SELLER
                  </span>
                )}
                {product.badge === 'SOLD OUT' && (
                  <span className="bg-neutral-800/80 backdrop-blur-xs text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                    SOLD OUT
                  </span>
                )}
                {product.badge === 'NEW' && (
                  <span className="bg-[#2563EB] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    NEW
                  </span>
                )}
              </div>
            )}

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className={`absolute top-1 right-1 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  isFavorite 
                    ? 'bg-white text-red-500 fill-red-500 shadow-md ring-2 ring-red-200' 
                    : 'bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 shadow-xs'
                }`}
                title={isFavorite ? 'ยกเลิกถูกใจ' : 'กดถูกใจ'}
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}

            {/* Sold Out Stamp */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-neutral-200/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-neutral-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest shadow-md">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Brand Badge */}
          {product.brand && (
            <span className="mt-1 bg-amber-100 text-amber-950 border border-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md text-center max-w-[80px] sm:max-w-[96px] truncate shadow-2xs">
              {product.brand}
            </span>
          )}
        </div>

        {/* Right Content Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            <h2 
              onClick={() => onOpenDetailModal(product)}
              className={`text-xs sm:text-sm font-extrabold leading-tight line-clamp-2 cursor-pointer transition-colors ${
                isSoldOut ? 'text-neutral-500' : 'text-[#1C1C1E] hover:text-amber-600'
              }`}
            >
              {product.name}
            </h2>

            <div className="flex items-center space-x-1.5 mt-0.5">
              <p className={`text-[11px] font-medium line-clamp-1 ${
                isSoldOut ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {product.series && `${product.series} `}
                <span className="text-neutral-500 font-mono font-bold">({product.modelCode})</span>
              </p>
            </div>

            {product.boxQty && product.boxQty > 1 && product.boxPrice && (
              <div className={`mt-1 p-1 rounded text-[9.5px] font-semibold transition-all ${
                quantity >= product.boxQty 
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold' 
                  : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
              }`}>
                {quantity >= product.boxQty ? (
                  <span>⚡ ได้รับราคายกลังแล้ว! (ตก{product.unit}ละ ฿{(product.bulkUnitPrice || (product.boxPrice / product.boxQty)).toFixed(2)})</span>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>📦 ยกลัง {product.boxQty} {product.unit}: ฿{product.boxPrice.toLocaleString()}</span>
                    <span className="text-amber-800 font-bold">({(product.bulkUnitPrice || (product.boxPrice / product.boxQty)).toFixed(2)}/{product.unit})</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row: Price & Quantity Controls */}
          <div className="flex items-end justify-between mt-1 pt-0.5">
            <div>
              {product.originalPrice && (
                <span className="block text-[10px] text-neutral-400 line-through leading-none">
                  ฿{product.originalPrice.toFixed(2)}
                </span>
              )}
              <div className={`text-xs sm:text-sm font-extrabold ${
                isSoldOut ? 'text-neutral-400' : 'text-[#1C1C1E]'
              }`}>
                ฿{quantity >= (product.boxQty || 999) && product.boxPrice 
                  ? (product.bulkUnitPrice || (product.boxPrice / product.boxQty!)).toFixed(2) 
                  : product.price.toFixed(2)}
                <span className="text-[10px] font-medium text-neutral-500 ml-0.5">/{product.unit}</span>
              </div>
            </div>

            <div>
              {isSoldOut ? (
                <button
                  onClick={() => onOpenNotifyModal(product)}
                  className="bg-[#EFECE6] hover:bg-[#E4E0D7] active:scale-95 text-neutral-700 text-[11px] font-medium px-2 py-1 rounded-xl flex items-center space-x-1 transition-all"
                >
                  <Bell className="w-3 h-3 text-neutral-600" />
                  <span>แจ้งเตือน</span>
                </button>
              ) : (
                <div className="bg-[#EFECE6] rounded-xl p-0.5 flex items-center space-x-1 border border-neutral-200/50">
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    disabled={quantity <= 0}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      quantity > 0 
                        ? 'bg-white text-neutral-800 shadow-2xs hover:bg-neutral-100 active:scale-95' 
                        : 'text-neutral-300 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <span className="text-xs font-bold text-neutral-900 w-4 text-center select-none">
                    {quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    disabled={quantity >= product.stock}
                    className="w-6 h-6 rounded-lg bg-[#1C1C1E] text-white flex items-center justify-center shadow-2xs hover:bg-black active:scale-95 transition-all"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


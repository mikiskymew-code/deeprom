import React, { useState } from 'react';
import { CartItem, UserProfile } from '../types';
import { X, ShoppingBag, CheckCircle, Trash2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  user: UserProfile;
  onPlaceOrder: (items: CartItem[], total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  user,
  onPlaceOrder
}) => {
  const [requestTaxInvoice, setRequestTaxInvoice] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const getItemUnitPrice = (item: CartItem) => {
    if (item.product.boxQty && item.quantity >= item.product.boxQty && item.product.boxPrice) {
      return item.product.bulkUnitPrice || (item.product.boxPrice / item.product.boxQty);
    }
    return item.product.price;
  };

  const rawSubtotal = cartItems.reduce((acc, item) => acc + getItemUnitPrice(item) * item.quantity, 0);
  const discountRate = user.tier.includes('VIP') ? 0.05 : user.tier.includes('โครงการ') ? 0.10 : 0;
  const discountAmount = rawSubtotal * discountRate;
  const netSubtotal = rawSubtotal - discountAmount;
  const vatAmount = requestTaxInvoice ? netSubtotal * 0.07 : 0;
  const shippingFee = netSubtotal > 3000 ? 0 : 150;
  const grandTotal = netSubtotal + vatAmount + shippingFee;

  const handleCheckout = () => {
    const newId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newId);
    setIsSuccess(true);
    onPlaceOrder(cartItems, grandTotal);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h2 className="text-base font-extrabold text-neutral-900">
              ตระกร้าคำสั่งซื้อ ({cartItems.reduce((a, b) => a + b.quantity, 0)} ชิ้น)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-600 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900">ส่งคำสั่งซื้อสำเร็จ!</h3>
              <p className="text-xs text-neutral-500 mt-1">
                หมายเลขออเดอร์ <span className="font-mono font-bold text-black">{orderId}</span>
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>ยอดชำระสุทธิ:</span>
                <span className="font-extrabold text-black text-sm">฿{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>ผู้สั่งซื้อ:</span>
                <span className="font-medium text-black">{user.name} ({user.phone})</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>ใบกำกับภาษี:</span>
                <span className="font-medium text-black">{requestTaxInvoice ? `ออกในนาม ${user.companyName}` : 'ไม่รับ'}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-[#06C755] font-extrabold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#06C755] animate-pulse" />
                  <span>ส่งแจ้งเตือนอีเมลคำสั่งซื้อไปที่ sp-deeprom@gmail.com เรียบร้อยแล้ว</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-medium">
                  บันทึกข้อมูลลงฐานข้อมูล Firestore & หักสต๊อกสินค้าเรียบร้อยแล้ว
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-[#1C1C1E] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-black active:scale-98 transition-all"
            >
              ตกลง และดูประวัติคำสั่งซื้อ
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center my-auto space-y-3">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <p className="text-sm text-neutral-500 font-medium">ยังไม่มีรายการอุปกรณ์ในตระกร้า</p>
            <button
              onClick={onClose}
              className="bg-[#1C1C1E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-black"
            >
              เลือกดูสินค้าในแคตตาล็อก
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-neutral-100 flex-1">
              {cartItems.map((item) => {
                const { product, quantity } = item;
                const isBulkActive = product.boxQty && quantity >= product.boxQty && product.boxPrice;
                const unitPrice = isBulkActive 
                  ? (product.bulkUnitPrice || (product.boxPrice! / product.boxQty!)) 
                  : product.price;

                return (
                  <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={formatImageUrl(product.imageUrl, product.modelCode, product.name, product.brand)}
                        alt={product.name}
                        onError={(e) => handleImageError(e, product.modelCode, product.name, product.brand)}
                        className="w-14 h-14 object-contain rounded-lg bg-neutral-50 border border-neutral-100 p-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          {product.brand && (
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1 rounded">
                              {product.brand}
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{product.name}</h4>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono">{product.modelCode}</p>
                        
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-xs font-extrabold text-[#1C1C1E]">
                            ฿{unitPrice.toFixed(2)} /{product.unit}
                          </span>
                          {isBulkActive && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              ยกลัง
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="bg-neutral-100 rounded-lg flex items-center p-0.5 space-x-1">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1.5">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(product.id, -quantity)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contractor Specs & Tax Settings */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200/80 space-y-3 text-xs">
              {/* Discount tier banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-amber-900">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-bold text-[11px]">{user.tier}</span>
                </div>
                {discountAmount > 0 && (
                  <span className="font-extrabold text-amber-700">ประหยัด -฿{discountAmount.toFixed(2)}</span>
                )}
              </div>

              {/* Tax Invoice Toggle */}
              <label className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-neutral-600" />
                  <span className="font-medium text-neutral-800 text-[11px]">รับใบกำกับภาษีเต็มรูปแบบ (VAT 7%)</span>
                </div>
                <input
                  type="checkbox"
                  checked={requestTaxInvoice}
                  onChange={(e) => setRequestTaxInvoice(e.target.checked)}
                  className="w-4 h-4 accent-black rounded"
                />
              </label>

              {/* Order Calculations */}
              <div className="space-y-1.5 pt-1 text-neutral-600">
                <div className="flex justify-between">
                  <span>ราคารวมสินค้า:</span>
                  <span className="font-semibold text-neutral-900">฿{rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>ส่วนลดสมาชิกช่าง ({discountRate * 100}%):</span>
                    <span>-฿{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {requestTaxInvoice && (
                  <div className="flex justify-between">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                    <span>฿{vatAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ค่าจัดส่งขนส่งด่วน (ฟรีเมื่อครบ ฿3,000):</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">ฟรี</span> : `฿${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>ยอดชำระสุทธิ:</span>
                  <span className="text-base text-black">฿{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1C1C1E] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:bg-black active:scale-98 transition-all"
              >
                <span>ยืนยันการสั่งซื้ออุปกรณ์</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

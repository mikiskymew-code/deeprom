import React, { useState } from 'react';
import { Order, AuthUser } from '../types';
import { ShoppingBag, Truck, CheckCircle2, Clock, Mail, FileSpreadsheet, ChevronRight, Check, PackageCheck } from 'lucide-react';
import { TARGET_ORDER_EMAIL } from '../utils/emailNotify';

interface OrdersViewProps {
  orders: Order[];
  onOpenSalesReportModal?: () => void;
  currentUser?: AuthUser | null;
  onUpdateOrderStatus?: (orderId: string, newStatus: 'รอยืนยัน' | 'ชำระเงินแล้ว' | 'กำลังจัดส่ง' | 'สำเร็จ', trackingNo?: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenSalesReportModal,
  currentUser,
  onUpdateOrderStatus
}) => {
  const [trackingInputs, setTrackingInputs] = useState<{ [orderId: string]: string }>({});

  const isAdminOrOwner = currentUser && (currentUser.role === 'OWNER' || currentUser.role === 'ADMIN');

  // Filter orders based on user role and 1-month history
  const filteredOrders = orders.filter((order) => {
    // Admin / Owner sees all orders
    if (isAdminOrOwner) return true;

    // Customer sees only their own orders
    const userEmail = currentUser?.email?.toLowerCase().trim() || '';
    const orderCustomerEmail = order.customerEmail?.toLowerCase().trim() || '';

    if (userEmail && orderCustomerEmail && userEmail !== orderCustomerEmail) {
      return false;
    }

    // Customer sees orders within 1 month (30 days)
    if (order.createdAtTimestamp) {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      if (order.createdAtTimestamp < thirtyDaysAgo) {
        return false;
      }
    }

    return true;
  });

  const handleTrackingChange = (orderId: string, val: string) => {
    setTrackingInputs((prev) => ({ ...prev, [orderId]: val }));
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            {isAdminOrOwner ? 'จัดการคำสั่งซื้อทั้งหมด (All Orders)' : 'ประวัติคำสั่งซื้อของคุณ (Orders History)'}
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            {isAdminOrOwner 
              ? 'ระบบรับออเดอร์ ปรับสถานะ และเตรียมสินค้าจัดส่ง' 
              : 'รายการสั่งซื้อของคุณ ย้อนหลังไม่เกิน 1 เดือน'}
          </p>
        </div>
      </div>

      {/* Admin / Owner Tools Cards */}
      {isAdminOrOwner && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={onOpenSalesReportModal}
            className="bg-emerald-800 text-white p-3.5 rounded-2xl text-left shadow-xs hover:bg-emerald-900 transition-all active:scale-95 border border-emerald-700 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-2">
              <span className="font-extrabold text-xs block text-white">สรุปยอดขาย / Excel</span>
              <span className="text-[10px] text-emerald-200 block font-medium">
                ส่งออก Google Sheets & Excel
              </span>
            </div>
          </button>

          {/* Email Notification Indicator */}
          <div className="bg-[#18181B] text-white p-3.5 rounded-2xl text-left shadow-xs border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
                <Mail className="w-4 h-4" />
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>ACTIVE</span>
              </span>
            </div>
            <div className="mt-2">
              <span className="font-extrabold text-xs block text-amber-400">แจ้งเตือนคำสั่งซื้อทางอีเมล</span>
              <span className="text-[10px] text-neutral-300 block font-mono font-medium truncate">
                ส่งถึง: {TARGET_ORDER_EMAIL}
              </span>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-neutral-100 shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <p className="text-xs text-neutral-500 font-medium">
            {isAdminOrOwner ? 'ยังไม่มีคำสั่งซื้อเข้ามาในระบบ' : 'ไม่พบประวัติคำสั่งซื้อของคุณในช่วง 1 เดือนที่ผ่านมา'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-3 relative overflow-hidden"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div>
                    <span className="text-xs font-black font-mono text-neutral-900">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-neutral-500 block font-medium">{order.date}</span>
                    {isAdminOrOwner && order.customerEmail && (
                      <span className="text-[10px] text-amber-800 font-bold block mt-0.5">
                        👤 ลูกค้า: {order.customerName || 'ลูกค้าดีพร้อม'} ({order.customerEmail})
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                    order.status === 'สำเร็จ' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : order.status === 'กำลังจัดส่ง'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {order.status === 'สำเร็จ' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {order.status === 'กำลังจัดส่ง' && <Truck className="w-3.5 h-3.5" />}
                    {order.status === 'รอยืนยัน' && <Clock className="w-3.5 h-3.5" />}
                    <span>{order.status}</span>
                  </span>
                </div>

                {/* Items list summary */}
                <div className="space-y-1.5 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-700">
                      <span className="line-clamp-1 font-medium">
                        • {item.productName} <span className="text-neutral-400 font-mono">x{item.qty}</span>
                      </span>
                      <span className="font-semibold text-neutral-900">
                        ฿{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with Tracking and Total */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div>
                    {order.trackingNo && (
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Tracking: <span className="font-bold text-neutral-800">{order.trackingNo}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-bold uppercase">ยอดรวมสุทธิ</span>
                    <span className="text-sm font-black text-neutral-900">
                      ฿{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Admin / Owner Order Preparation Action Buttons */}
                {isAdminOrOwner && onUpdateOrderStatus && (
                  <div className="pt-2 border-t border-amber-100 bg-amber-50/50 -mx-4 -mb-4 p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-amber-900 flex items-center space-x-1">
                      <PackageCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>เมนูแอดมิน: กดรับออเดอร์เตรียมสินค้า</span>
                    </span>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      {order.status !== 'กำลังจัดส่ง' && order.status !== 'สำเร็จ' && (
                        <button
                          onClick={() => {
                            const track = trackingInputs[order.id] || `TH${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                            onUpdateOrderStatus(order.id, 'กำลังจัดส่ง', track);
                          }}
                          className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-500 text-black px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1 shadow-xs transition-all active:scale-95"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>กดรับออเดอร์ / เตรียมส่ง</span>
                        </button>
                      )}

                      {order.status !== 'สำเร็จ' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'สำเร็จ', order.trackingNo)}
                          className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1 shadow-xs transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ส่งสินค้าสำเร็จ</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

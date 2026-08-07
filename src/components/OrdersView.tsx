import React from 'react';
import { Order } from '../types';
import { ShoppingBag, Truck, CheckCircle2, Clock, FileText, ChevronRight, Mail, FileSpreadsheet, Download, TrendingUp, Check } from 'lucide-react';
import { TARGET_ORDER_EMAIL } from '../utils/emailNotify';

interface OrdersViewProps {
  orders: Order[];
  onOpenSalesReportModal?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenSalesReportModal
}) => {
  return (
    <div className="pb-24 pt-4 px-4 space-y-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            ประวัติคำสั่งซื้อ (Orders History)
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            รายการสั่งซื้ออุปกรณ์และสถานะการจัดส่ง realtime
          </p>
        </div>
      </div>

      {/* Owner Tools & Notification Cards */}
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

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-neutral-100 shadow-2xs">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <p className="text-xs text-neutral-500 font-medium">ยังไม่มีประวัติคำสั่งซื้อในระบบ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-neutral-100/90 shadow-2xs space-y-3"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                  <div>
                    <span className="text-xs font-bold font-mono text-neutral-900">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-neutral-400 block">{order.date}</span>
                  </div>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                    order.status === 'สำเร็จ' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : order.status === 'กำลังจัดส่ง'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

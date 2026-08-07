import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  CheckCircle2,
  Calendar,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Box,
  Layers,
  Search
} from 'lucide-react';
import {
  downloadExcelCSV,
  copyForGoogleSheets,
  getDailyMetrics
} from '../utils/salesExport';

interface DailySalesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const DailySalesReportModal: React.FC<DailySalesReportModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  const [selectedDateFilter, setSelectedDateFilter] = useState<'ALL' | 'TODAY'>('ALL');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedDateFilter === 'TODAY') {
        const isToday = o.date === 'เมื่อครู่นี้' || o.date.includes('วันนี้') || o.date.includes(new Date().toLocaleDateString('th-TH'));
        if (!isToday) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesItem = o.items.some((i) => i.productName.toLowerCase().includes(q) || i.modelCode.toLowerCase().includes(q));
        if (!matchesId && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, selectedDateFilter, searchQuery]);

  const metrics = useMemo(() => {
    return getDailyMetrics(filteredOrders, selectedDateFilter === 'TODAY' ? 'วันนี้' : 'ทั้งหมด');
  }, [filteredOrders, selectedDateFilter]);

  if (!isOpen) return null;

  const handleCopyGoogleSheets = () => {
    const text = copyForGoogleSheets(filteredOrders);
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    downloadExcelCSV(filteredOrders, selectedDateFilter === 'TODAY' ? 'วันนี้' : 'ทั้งหมด');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight flex items-center space-x-1.5">
                <span>รายงานสรุปยอดขาย (Daily Sales & Google Sheets / Excel)</span>
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                ดึงข้อมูลการขายประจำวันและส่งออกไฟล์ Excel / Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Top Control Bar: Date Filter & Export Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            {/* Filter Toggle */}
            <div className="flex items-center space-x-1.5 bg-neutral-200/80 p-1 rounded-xl">
              <button
                onClick={() => setSelectedDateFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                  selectedDateFilter === 'ALL'
                    ? 'bg-white text-black shadow-2xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                ยอดขายทั้งหมด ({orders.length})
              </button>
              <button
                onClick={() => setSelectedDateFilter('TODAY')}
                className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition-all flex items-center space-x-1 ${
                  selectedDateFilter === 'TODAY'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>เฉพาะวันนี้</span>
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl flex items-center justify-center space-x-1.5 shadow-xs active:scale-95 transition-all text-xs"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด Excel (.csv)</span>
              </button>

              <button
                onClick={handleCopyGoogleSheets}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-900 hover:bg-black text-white font-black rounded-xl flex items-center justify-center space-x-1.5 shadow-xs active:scale-95 transition-all text-xs"
              >
                {copiedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>คัดลอกเรียบร้อย!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>คัดลอกลง Google Sheets</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                ยอดขายรวม (Total Sales)
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-950 block mt-0.5">
                ฿{metrics.totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-800 block uppercase">
                จำนวนออเดอร์ (Orders)
              </span>
              <span className="text-base sm:text-lg font-black text-blue-950 block mt-0.5">
                {metrics.totalOrders} รายการ
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 block uppercase">
                สินค้าที่ขายได้ (Units)
              </span>
              <span className="text-base sm:text-lg font-black text-amber-950 block mt-0.5">
                {metrics.totalUnitsSold} ชิ้น
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามรหัสสินค้า, ชื่ออุปกรณ์ หรือหมายเลขออเดอร์..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          </div>

          {/* Table Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-neutral-900 flex items-center space-x-1">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>รายละเอียดรายการขายประจำวัน</span>
              </span>
            </div>

            <div className="border border-neutral-200 rounded-2xl overflow-x-auto max-h-64 shadow-2xs">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-neutral-100 font-extrabold text-neutral-700 sticky top-0 border-b border-neutral-200">
                  <tr>
                    <th className="p-2.5">วันที่</th>
                    <th className="p-2.5">ออเดอร์ ID</th>
                    <th className="p-2.5">รหัสสินค้า</th>
                    <th className="p-2.5">รายการสินค้า</th>
                    <th className="p-2.5 text-center">จำนวน</th>
                    <th className="p-2.5 text-right">ราคา/ชิ้น</th>
                    <th className="p-2.5 text-right">รวมเงิน (฿)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800 bg-white">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-neutral-400">
                        ไม่พบข้อมูลคำสั่งซื้อในวันที่เลือก
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.flatMap((order) =>
                      order.items.map((item, idx) => (
                        <tr key={`${order.id}-${idx}`} className="hover:bg-amber-50/40">
                          <td className="p-2.5 text-neutral-500 whitespace-nowrap">{order.date}</td>
                          <td className="p-2.5 font-mono font-bold text-neutral-900 whitespace-nowrap">
                            {order.id}
                          </td>
                          <td className="p-2.5 font-mono text-neutral-600 whitespace-nowrap">
                            {item.modelCode || '-'}
                          </td>
                          <td className="p-2.5 font-semibold text-neutral-900 line-clamp-1">
                            {item.productName}
                          </td>
                          <td className="p-2.5 text-center font-bold text-blue-700">
                            {item.qty}
                          </td>
                          <td className="p-2.5 text-right text-neutral-600">
                            ฿{item.price.toFixed(2)}
                          </td>
                          <td className="p-2.5 text-right font-black text-emerald-600 whitespace-nowrap">
                            ฿{(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs">
          <p className="text-[11px] text-neutral-500">
            ไฟล์ที่ส่งออก (.csv) รองรับภาษาไทยสมบูรณ์บน MS Excel และ Google Sheets
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-extrabold rounded-xl transition-all"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};

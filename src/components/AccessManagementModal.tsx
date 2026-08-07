import React, { useState } from 'react';
import { AuthUser, AccessRequest, Product } from '../types';
import { X, ShieldCheck, UserCheck, UserX, Plus, Mail, CheckCircle2, AlertTriangle, Trash2, Download, Upload, FileSpreadsheet, Package, FileCheck, Edit3 } from 'lucide-react';
import { exportProductsToExcel } from '../utils/salesExport';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface AccessManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowedEmails: string[];
  accessRequests: AccessRequest[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onAddAllowedEmail: (email: string) => void;
  onRemoveAllowedEmail: (email: string) => void;
  products?: Product[];
  onOpenImporterModal?: () => void;
  onDeleteProduct?: (productId: string) => void;
  onDeleteAllProducts?: () => void;
  onResetDefaultProducts?: () => void;
  onEditProduct?: (product: Product) => void;
  onAddNewProduct?: () => void;
  currentUser?: AuthUser | null;
}

export const AccessManagementModal: React.FC<AccessManagementModalProps> = ({
  isOpen,
  onClose,
  allowedEmails,
  accessRequests,
  onApproveRequest,
  onRejectRequest,
  onAddAllowedEmail,
  onRemoveAllowedEmail,
  products = [],
  onOpenImporterModal,
  onDeleteProduct,
  onDeleteAllProducts,
  onResetDefaultProducts,
  onEditProduct,
  onAddNewProduct,
  currentUser
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'whitelist' | 'products'>(
    currentUser?.role === 'AUTHORIZED' ? 'products' : 'requests'
  );

  if (!isOpen) return null;

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    onAddAllowedEmail(newEmail.trim().toLowerCase());
    setNewEmail('');
  };

  const pendingRequests = accessRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden relative border-2 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yellow Header Banner */}
        <div className="bg-amber-400 p-4 flex items-center justify-between text-black">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                แผงควบคุมสิทธิ์เข้าใช้งานระบบ (Owner Security Control)
              </h2>
              <p className="text-[11px] font-bold text-neutral-800">
                จัดการสิทธิ์ผู้ใช้งานและบริหารจัดการข้อมูลสินค้า Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-black font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-3 pt-3 space-x-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-white text-black border-t-2 border-x border-neutral-200 shadow-2xs'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <span>คำขอรออนุมัติ</span>
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('whitelist')}
            className={`py-2 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1 whitespace-nowrap ${
              activeTab === 'whitelist'
                ? 'bg-white text-black border-t-2 border-x border-neutral-200 shadow-2xs'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <span>ผู้ได้รับสิทธิ์ ({allowedEmails.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-3 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-white text-amber-900 border-t-2 border-amber-500 border-x border-neutral-200 shadow-2xs font-extrabold'
                : 'text-amber-800 hover:text-black'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>จัดการสินค้า Excel ({products.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'requests' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                คำขอเข้าใช้งานที่รอการพิจารณา (Pending Requests)
              </h3>

              {pendingRequests.length === 0 ? (
                <div className="bg-neutral-50 p-6 rounded-2xl text-center border border-dashed border-neutral-200 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs text-neutral-600 font-bold">ไม่มีคำขอที่ค้างอยู่</p>
                  <p className="text-[11px] text-neutral-400">เมื่อช่างส่งคำขอเข้าใช้งาน ระบบจะแสดงที่นี่ทันที</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-neutral-900 truncate">{req.name}</div>
                      <div className="text-xs font-mono text-neutral-600 truncate">{req.email}</div>
                      <div className="text-[10px] text-amber-800 font-medium mt-0.5">
                        ขอเข้าใช้งานเมื่อ: {req.requestedAt}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => onApproveRequest(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs active:scale-95 transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>อนุมัติ</span>
                      </button>
                      <button
                        onClick={() => onRejectRequest(req.id)}
                        className="bg-neutral-200 hover:bg-red-50 text-neutral-700 hover:text-red-600 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                        title="ไม่อนุญาต"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'whitelist' ? (
            <div className="space-y-4">
              {/* Add email form */}
              <form onSubmit={handleAddEmail} className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-neutral-800">
                  เพิ่มอีเมลช่าง/ผู้รับเหมาใน Whitelist โดยตรง:
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="engineer@gmail.com"
                      className="w-full bg-white border border-neutral-300 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1C1C1E] text-amber-400 hover:bg-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 flex-shrink-0 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มอีเมล</span>
                  </button>
                </div>
              </form>

              {/* List of Allowed Emails */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  รายการอีเมลที่มีสิทธิ์เข้าใช้งาน:
                </h4>
                <div className="space-y-1.5">
                  {allowedEmails.map((email) => (
                    <div
                      key={email}
                      className="bg-white border border-neutral-200 p-2.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-mono font-bold text-neutral-800 truncate">{email}</span>
                      </div>
                      <button
                        onClick={() => onRemoveAllowedEmail(email)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                        title="ยกเลิกสิทธิ์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Export/Import Action Cards */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-amber-950 font-extrabold text-sm">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>นำเข้า & ส่งออกไฟล์แคตตาล็อกสินค้า (Excel Catalog)</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  ผู้ดูแลระบบ (Owner) สามารถส่งออกรายการสินค้าทั้งหมดในระบบเป็นไฟล์ Excel/CSV หรือเพิ่มสินค้าใหม่จำนวนมากผ่านการอัปโหลดไฟล์ CSV ได้ที่นี่
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Export Excel Button */}
                  <button
                    onClick={() => exportProductsToExcel(products)}
                    className="p-3 bg-white border border-amber-300 rounded-xl hover:bg-amber-100 transition-all text-left space-y-1 shadow-2xs group active:scale-95"
                  >
                    <div className="flex items-center justify-between text-amber-950 font-extrabold text-xs">
                      <span className="flex items-center space-x-1.5">
                        <Download className="w-4 h-4 text-amber-600 group-hover:translate-y-0.5 transition-transform" />
                        <span>ดึงไฟล์ Excel สินค้าออก</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-800">.CSV</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-snug">
                      ดาวน์โหลดข้อมูลสินค้าปัจจุบัน {products.length} รายการ ไปใช้งานต่อใน Excel
                    </p>
                  </button>

                  {/* Import Excel Button */}
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenImporterModal) onOpenImporterModal();
                    }}
                    className="p-3 bg-neutral-900 hover:bg-black text-white rounded-xl transition-all text-left space-y-1 shadow-2xs group active:scale-95"
                  >
                    <div className="flex items-center justify-between font-extrabold text-xs">
                      <span className="flex items-center space-x-1.5">
                        <Upload className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                        <span>เพิ่มสินค้าเข้าสู่ระบบ</span>
                      </span>
                      <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold">IMPORT</span>
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-snug">
                      อัปโหลด/วางข้อมูลจาก Excel เพื่อเพิ่มสินค้าล็อตใหม่
                    </p>
                  </button>
                </div>
              </div>

              {/* Quick Summary list of products */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-neutral-800">
                  <span>รายการสินค้าทั้งหมด ({products.length} รายการ)</span>
                  <div className="flex items-center space-x-1.5">
                    {onAddNewProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onAddNewProduct) onAddNewProduct();
                        }}
                        className="text-[11px] text-black font-extrabold bg-amber-400 hover:bg-amber-300 px-2.5 py-0.5 rounded-lg flex items-center space-x-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>เพิ่มสินค้าใหม่</span>
                      </button>
                    )}
                    {currentUser?.role === 'OWNER' && onResetDefaultProducts && (
                      <button
                        type="button"
                        onClick={onResetDefaultProducts}
                        className="text-[11px] text-amber-900 hover:text-black font-bold bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-lg active:scale-95 transition-all"
                        title="คืนค่าชุดสินค้าตัวอย่างเริ่มต้น"
                      >
                        <span>🔄 คืนค่าเริ่มต้น</span>
                      </button>
                    )}
                    {currentUser?.role === 'OWNER' && onDeleteAllProducts && products.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('คุณต้องการลบสินค้าทั้งหมดในระบบออกใช่หรือไม่? (การกระทำนี้ไม่สามารถย้อนกลับได้)')) {
                            onDeleteAllProducts();
                          }
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg flex items-center space-x-1 active:scale-95 transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        <span>ล้างสินค้าทั้งหมด</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-neutral-100 text-neutral-700 font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2 w-10 text-center">รูป</th>
                        <th className="p-2">ยี่ห้อ</th>
                        <th className="p-2">รหัส</th>
                        <th className="p-2">ชื่อสินค้า</th>
                        <th className="p-2 text-right">ราคา</th>
                        <th className="p-2 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-medium">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-neutral-400">
                            ไม่มีสินค้าในระบบ สามารถกด "เพิ่มสินค้าใหม่" หรือ "นำเข้าสินค้า" ได้
                          </td>
                        </tr>
                      ) : (
                        products.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="p-1.5 text-center">
                              <img
                                src={formatImageUrl(p.imageUrl, p.modelCode, p.name, p.brand)}
                                alt={p.name}
                                onError={(e) => handleImageError(e, p.modelCode, p.name, p.brand)}
                                className="w-7 h-7 object-contain rounded bg-neutral-100 mx-auto"
                              />
                            </td>
                            <td className="p-2 font-bold text-amber-800">{p.brand}</td>
                            <td className="p-2 font-mono text-neutral-500">{p.modelCode}</td>
                            <td className="p-2 truncate max-w-[120px]">{p.name}</td>
                            <td className="p-2 text-right font-extrabold text-emerald-600">฿{p.price.toFixed(2)}</td>
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                {onEditProduct && (
                                  <button
                                    type="button"
                                    onClick={() => onEditProduct(p)}
                                    className="p-1 text-amber-700 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
                                    title="แก้ไขข้อมูล & เปลี่ยนรูปภาพ"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {currentUser?.role === 'OWNER' && onDeleteProduct && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`ต้องการลบสินค้า "${p.name}" (${p.modelCode}) หรือไม่?`)) {
                                        onDeleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                    title="ลบสินค้านี้"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 text-center text-[11px] text-neutral-600 font-medium">
          🔒 ข้อมูลสิทธิ์การเข้าใช้งานถูกจัดเก็บความปลอดภัยในระบบอย่างรัดกุม
        </div>
      </div>
    </div>
  );
};

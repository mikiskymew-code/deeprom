import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import {
  X,
  HardDrive,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  FolderPlus,
  RefreshCw,
  Search,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  Folder,
  ShieldAlert,
  Database
} from 'lucide-react';
import {
  googleSignInWithDrive,
  initDriveAuth,
  logoutDrive,
  listDriveFiles,
  uploadFileToDrive,
  createDriveFolder,
  getDriveFileContent,
  deleteDriveFile,
  DriveFileItem
} from '../utils/googleDriveService';
import * as XLSX from 'xlsx';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onImportProducts: (imported: Product[]) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onImportProducts,
}) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Drive Files State
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'SPREADSHEET' | 'JSON'>('ALL');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Action Loading States
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // Initialize Drive Auth listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive Files when modal opens and token is available
  const fetchFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    setStatusMessage(null);
    try {
      let query = "trashed = false";
      if (filterType === 'SPREADSHEET') {
        query += " and (mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or name contains '.xlsx' or name contains '.csv')";
      } else if (filterType === 'JSON') {
        query += " and (mimeType = 'application/json' or name contains '.json')";
      }
      const fileList = await listDriveFiles(accessToken, query);
      setFiles(fileList);
    } catch (err: any) {
      console.error('Fetch Drive files error:', err);
      setStatusMessage({
        type: 'error',
        text: `ไม่สามารถดึงข้อมูลไฟล์จาก Google Drive: ${err.message || 'เกิดข้อผิดพลาด'}`
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles();
    }
  }, [isOpen, accessToken, filterType]);

  if (!isOpen) return null;

  // Handle Google Login
  const handleLogin = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignInWithDrive();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setStatusMessage({
          type: 'success',
          text: `เชื่อมต่อ Google Drive สำเร็จ! ยินดีต้อนรับ ${res.user.displayName || res.user.email}`
        });
      }
    } catch (err: any) {
      console.error('Drive Login failed:', err);
      setStatusMessage({
        type: 'error',
        text: `เข้าสู่ระบบ Google Drive ไม่สำเร็จ: ${err.message || 'โปรดลองอีกครั้ง'}`
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Google Logout
  const handleLogout = async () => {
    await logoutDrive();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setStatusMessage({
      type: 'info',
      text: 'ออกจากระบบ Google Drive เรียบร้อยแล้ว'
    });
  };

  // Export Store Catalog to Google Drive as Excel (.xlsx)
  const handleExportCatalogExcel = async () => {
    if (!accessToken) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const exportData = products.map((p, index) => ({
        'ลำดับ': index + 1,
        'รหัสสินค้า (ID)': p.id,
        'ชื่อสินค้า': p.name,
        'รุ่น/โมเดล (Model)': p.model || '-',
        'หมวดหมู่ (Category)': p.category,
        'ราคาช่าง (บาท)': p.price,
        'ราคาปกติ (บาท)': p.originalPrice || p.price,
        'สถานะสินค้า': p.inStock ? 'พร้อมส่ง' : 'สินค้าหมด',
        'ยี่ห้อ (Brand)': p.brand || '-',
        'รายละเอียด/สเปก': p.description || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'HVAC Catalog');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileName = `HVAC_Catalog_Backup_${new Date().toISOString().slice(0, 10)}.xlsx`;

      const result = await uploadFileToDrive(
        accessToken,
        fileName,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        new Blob([excelBuffer])
      );

      setStatusMessage({
        type: 'success',
        text: `สำรองข้อมูลแคตตาล็อกขึ้น Google Drive สำเร็จ! ชื่อไฟล์: ${result.name}`
      });
      fetchFiles();
    } catch (err: any) {
      console.error('Export Excel to Drive failed:', err);
      setStatusMessage({
        type: 'error',
        text: `สำรองข้อมูลขึ้น Google Drive ไม่สำเร็จ: ${err.message || 'เกิดข้อผิดพลาด'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export Store Data Backup to Google Drive as JSON
  const handleExportBackupJson = async () => {
    if (!accessToken) return;
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const backupObj = {
        app: 'HVAC Deeprom Catalog',
        exportedAt: new Date().toISOString(),
        productsCount: products.length,
        ordersCount: orders.length,
        products,
        orders,
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const fileName = `HVAC_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;

      const result = await uploadFileToDrive(
        accessToken,
        fileName,
        'application/json',
        jsonStr
      );

      setStatusMessage({
        type: 'success',
        text: `สำรองไฟล์ฐานข้อมูล (.json) บน Google Drive เรียบร้อย! (${result.name})`
      });
      fetchFiles();
    } catch (err: any) {
      console.error('Export JSON to Drive failed:', err);
      setStatusMessage({
        type: 'error',
        text: `ไม่สามารถสำรองข้อมูล JSON: ${err.message || 'เกิดข้อผิดพลาด'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Import JSON Catalog from Google Drive
  const handleImportFileFromDrive = async (file: DriveFileItem) => {
    if (!accessToken) return;
    setIsImporting(file.id);
    setStatusMessage(null);
    try {
      const content = await getDriveFileContent(accessToken, file.id);

      if (file.name.endsWith('.json') || file.mimeType === 'application/json') {
        const parsed = JSON.parse(content);
        let importedProducts: Product[] = [];
        if (Array.isArray(parsed)) {
          importedProducts = parsed;
        } else if (parsed && Array.isArray(parsed.products)) {
          importedProducts = parsed.products;
        }

        if (importedProducts.length > 0) {
          onImportProducts(importedProducts);
          setStatusMessage({
            type: 'success',
            text: `นำเข้าสินค้าจำนวน ${importedProducts.length} รายการ จาก Google Drive (${file.name}) สำเร็จ!`
          });
        } else {
          throw new Error('ไม่พบรายการสินค้าที่ถูกต้องในไฟล์ JSON');
        }
      } else {
        setStatusMessage({
          type: 'info',
          text: `ไฟล์ ${file.name} สามารถดาวน์โหลดได้ หรือเปิดใน Google Drive โดยตรง`
        });
      }
    } catch (err: any) {
      console.error('Import file from Drive failed:', err);
      setStatusMessage({
        type: 'error',
        text: `ไม่สามารถนำเข้าไฟล์จาก Google Drive: ${err.message || 'รูปแบบไฟล์ไม่ถูกต้อง'}`
      });
    } finally {
      setIsImporting(null);
    }
  };

  // Confirm Delete File from Google Drive (Mandatory Confirmation Dialog)
  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setDeletingFileId(fileToDelete.id);
    setStatusMessage(null);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setStatusMessage({
        type: 'success',
        text: `ลบไฟล์ "${fileToDelete.name}" จาก Google Drive เรียบร้อยแล้ว`
      });
      setFileToDelete(null);
      fetchFiles();
    } catch (err: any) {
      console.error('Delete Drive file failed:', err);
      setStatusMessage({
        type: 'error',
        text: `ไม่สามารถลบไฟล์: ${err.message || 'เกิดข้อผิดพลาด'}`
      });
    } finally {
      setDeletingFileId(null);
    }
  };

  // Filter files by query
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-neutral-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black flex items-center justify-center shadow-lg font-black">
              <HardDrive className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Google Drive Cloud Integration
                </h3>
                <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                สำรองข้อมูล อัปโหลด และนำเข้าไฟล์แคตตาล็อกอะไหล่กับ Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-neutral-50/50">
          {/* Status Message Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2 duration-200 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : statusMessage.type === 'error'
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span className="truncate">{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-neutral-500 hover:text-black font-bold text-xs pl-2"
              >
                ปิด
              </button>
            </div>
          )}

          {/* Authentication Section */}
          {!accessToken ? (
            <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <HardDrive className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-extrabold text-neutral-900">
                  เชื่อมต่อ Google Account กับ Google Drive
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  เข้าสู่ระบบเพื่อสำรองข้อมูลแคตตาล็อกสินค้า ยอดขาย และนำเข้าไฟล์ Excel/JSON
                  ผ่านบัญชี Google Drive ของคุณอย่างปลอดภัย
                </p>
              </div>

              {/* Official Sign in with Google Button Pattern */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleLogin}
                  disabled={isSigningIn}
                  className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-extrabold text-xs px-6 py-3 rounded-2xl shadow-sm flex items-center space-x-3 transition-all active:scale-98 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>
                    {isSigningIn ? 'กำลังเชื่อมต่อ Google Drive...' : 'Sign in with Google Drive'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Logged in User Bar */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-black font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 truncate">
                      {user?.displayName || 'Google Drive Connected'}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ออกจากระบบ Drive</span>
                </button>
              </div>

              {/* Action Toolbar: Upload/Backup to Drive */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-neutral-900 flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>สำรองข้อมูลระบบขึ้น Google Drive:</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    ({products.length} รายการสินค้า)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleExportCatalogExcel}
                    disabled={isExporting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50 shadow-xs"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>
                      {isExporting ? 'กำลังส่งออก...' : 'สำรองเป็นไฟล์ Excel (.xlsx)'}
                    </span>
                  </button>

                  <button
                    onClick={handleExportBackupJson}
                    disabled={isExporting}
                    className="bg-neutral-900 hover:bg-black text-amber-400 p-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50 shadow-xs"
                  >
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>
                      {isExporting ? 'กำลังส่งออก...' : 'สำรองฐานข้อมูลฉบับเต็ม (.json)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Drive File Browser */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-extrabold text-neutral-900">
                      รายการไฟล์ใน Google Drive ของคุณ:
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={fetchFiles}
                      disabled={isLoadingFiles}
                      className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">รีเฟรช</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ค้นหาชื่อไฟล์ใน Google Drive..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>

                  <div className="flex space-x-1 bg-neutral-100 p-1 rounded-xl text-[11px] font-bold shrink-0">
                    <button
                      onClick={() => setFilterType('ALL')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        filterType === 'ALL' ? 'bg-white text-black shadow-2xs' : 'text-neutral-600'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      onClick={() => setFilterType('SPREADSHEET')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        filterType === 'SPREADSHEET' ? 'bg-white text-black shadow-2xs' : 'text-neutral-600'
                      }`}
                    >
                      Excel / CSV
                    </button>
                    <button
                      onClick={() => setFilterType('JSON')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        filterType === 'JSON' ? 'bg-white text-black shadow-2xs' : 'text-neutral-600'
                      }`}
                    >
                      JSON
                    </button>
                  </div>
                </div>

                {/* File List */}
                {isLoadingFiles ? (
                  <div className="py-12 text-center text-neutral-400 text-xs font-medium space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                    <p>กำลังดึงข้อมูลไฟล์จาก Google Drive...</p>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="py-10 text-center text-neutral-400 text-xs font-medium space-y-1">
                    <HardDrive className="w-8 h-8 mx-auto text-neutral-300" />
                    <p>ไม่พบไฟล์ที่ตรงกับเงื่อนไขใน Google Drive</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
                    {filteredFiles.map((f) => {
                      const isJson = f.name.endsWith('.json') || f.mimeType === 'application/json';
                      const isExcel =
                        f.name.endsWith('.xlsx') ||
                        f.name.endsWith('.csv') ||
                        f.mimeType.includes('spreadsheet');

                      return (
                        <div
                          key={f.id}
                          className="py-2.5 px-2 hover:bg-neutral-50 rounded-xl flex items-center justify-between transition-all group"
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            <div className="shrink-0">
                              {isExcel ? (
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                              ) : isJson ? (
                                <FileText className="w-5 h-5 text-amber-500" />
                              ) : (
                                <HardDrive className="w-5 h-5 text-neutral-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-neutral-900 truncate">
                                {f.name}
                              </div>
                              <div className="text-[10px] text-neutral-400 font-mono">
                                {f.modifiedTime
                                  ? new Date(f.modifiedTime).toLocaleString('th-TH')
                                  : '-'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            {/* Import Button if JSON or catalog */}
                            {isJson && (
                              <button
                                onClick={() => handleImportFileFromDrive(f)}
                                disabled={isImporting === f.id}
                                className="bg-amber-400 hover:bg-amber-500 text-black px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center space-x-1 transition-all active:scale-95 disabled:opacity-50"
                                title="นำเข้าสินค้าเข้าสู่ระบบ"
                              >
                                <Download className="w-3 h-3" />
                                <span>{isImporting === f.id ? 'นำเข้า...' : 'นำเข้า'}</span>
                              </button>
                            )}

                            {/* Open in Google Drive */}
                            {f.webViewLink && (
                              <a
                                href={f.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black transition-all"
                                title="เปิดใน Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Delete File from Drive with User Confirmation */}
                            <button
                              onClick={() => setFileToDelete(f)}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-100 text-neutral-400 hover:text-red-600 transition-all"
                              title="ลบไฟล์ออกจาก Google Drive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-neutral-900 hover:bg-black text-amber-400 px-5 py-2 rounded-xl text-xs font-extrabold transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Mandatory Delete Confirmation Dialog */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border border-red-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-neutral-900">
                ยืนยันการลบไฟล์จาก Google Drive?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono bg-neutral-50 p-2 rounded-xl border border-neutral-200 break-all">
                {fileToDelete.name}
              </p>
              <p className="text-[11px] text-red-600 font-medium pt-1">
                ⚠️ การลบไฟล์ถาวร จะไม่สามารถกู้คืนกลับมาได้
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={deletingFileId === fileToDelete.id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-98 disabled:opacity-50"
              >
                {deletingFileId === fileToDelete.id ? 'กำลังลบ...' : 'ยืนยันลบไฟล์'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

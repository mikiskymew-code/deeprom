import React, { useState, useRef } from 'react';
import { Product, ProductBrand, ProductCategory } from '../types';
import { X, Upload, FileSpreadsheet, CheckCircle2, ArrowRight, Download, Copy, Flame, Image as ImageIcon, Info, FileUp, Sparkles, HelpCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { downloadProductImportExcelTemplate } from '../utils/salesExport';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface DataImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (newProducts: Product[]) => void;
}

export const SAMPLE_CSV_FULL = `ยี่ห้อ,รูปภาพ (URL หรือ ชื่อไฟล์),ชื่อสินค้า,รหัสสินค้า,ราคาขาย,หน่วยนับ,ราคายกลัง,หมวดหมู่,ปริมาณบรรจุต่อกล่อง,รายละเอียด,สินค้าขายดี
KMCT,https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500,ท่อทองแดง KMCT แบบม้วน 1/4 นิ้ว หนา 0.71 มม.,KMCT 1/4x0.71,885.00,ม้วน,12390.00,ท่อน้ำยาแอร์,14,ท่อทองแดงคุณภาพสูงสำหรับงานติดตั้งแอร์,ขายดี
HARU,https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500,รางครอบท่อแอร์ HARU 75 มม. ยาว 2 เมตร,SD-75,58.00,เส้น,290.00,รางตรง,5,รางครอบท่อคุณภาพดี ทนแดด ทนฝน,ขายดี
HARU,https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500,ฝาครอบผนัง HARU 75 มม.,SW-75,26.00,ชิ้น,520.00,ฝาครอบ,20,ฝาครอบสำหรับปิดช่องเจาะผนัง,ขายดี
HARU,https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500,ข้องอมุม 90 องศา HARU 75 มม.,SC-75,25.00,ชิ้น,500.00,ข้องอ,20,ข้องอฉากสำหรับเดินรางเลี้ยวโค้ง,ปกติ
TOTO SLIM,https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500,ฝาครอบหัวกระโหลก TOTO SLIM 75 มม.,TW-75,45.00,ชิ้น,900.00,ฝาครอบ,20,ฝาครอบหัวกระโหลกพรีเมียมจากญี่ปุ่น,ปกติ
VALUE,https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500,ชุดบานท่อแอร์เกจดิจิทัล VALUE,VFT-808-I,2850.00,ชุด,2850.00,เครื่องมือช่าง,1,ชุดบานท่อคุณภาพสูงสำหรับช่างมืออาชีพ,ขายดี`;

export const DataImporterModal: React.FC<DataImporterModalProps> = ({
  isOpen,
  onClose,
  onImportProducts
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'guide'>('upload');
  const [csvText, setCsvText] = useState(SAMPLE_CSV_FULL);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    downloadProductImportExcelTemplate();
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_CSV_FULL);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Helper to parse array of JSON objects (from XLSX or CSV)
  const processJsonRows = (jsonRows: any[]) => {
    if (!jsonRows || jsonRows.length === 0) return;

    let lastBrand = 'อื่นๆ';
    const processed: any[] = [];

    jsonRows.forEach((row, i) => {
      // Find value by checking potential column key names (TH / EN)
      const getVal = (keys: string[]) => {
        for (const k of keys) {
          const matchedKey = Object.keys(row).find(
            rk => rk.trim().toLowerCase() === k.trim().toLowerCase() || rk.includes(k)
          );
          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
            return String(row[matchedKey]).trim();
          }
        }
        return '';
      };

      // Extract properties
      let currentBrand = getVal(['ยี่ห้อ', 'Brand', 'brand']);
      if (!currentBrand || currentBrand === '' || currentBrand === 'NaN') {
        currentBrand = lastBrand;
      } else {
        lastBrand = currentBrand;
      }

      const name = getVal(['ชื่อสินค้า', 'รายการสินค้า', 'Product Name', 'name']) || 'สินค้าอะไหล่แอร์';
      const modelCode = getVal(['รหัสสินค้า', 'Model Code', 'code']) || `ITEM-${i + 1}`;

      const imageUrlVal = getVal(['รูปภาพ', 'รูปภาพสินค้า', 'ภาพสินค้า', 'รูป', 'Image', 'imageUrl', 'URL', 'Picture', 'Photo', 'Link', 'Image URL', 'url', 'image', 'src']);
      const imageUrl = formatImageUrl(imageUrlVal, modelCode, name, currentBrand);
      
      const priceRaw = getVal(['ราคาขาย', 'ราคาขาย (บาท)', 'Price']);
      const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;

      const unit = getVal(['หน่วยนับ', 'Unit']) || 'ชิ้น';

      const boxPriceRaw = getVal(['ราคายกลัง', 'ราคายกลัง (บาท)', 'Box Price']);
      const boxPrice = parseFloat(boxPriceRaw.replace(/[^0-9.]/g, '')) || (price * 10);

      const category = (getVal(['หมวดหมู่', 'Category']) || 'รางตรง') as ProductCategory;

      const boxQtyRaw = getVal(['ปริมาณบรรจุต่อกล่อง', 'Box Qty']);
      const boxQty = parseInt(boxQtyRaw.replace(/[^0-9]/g, '')) || 1;

      const description = getVal(['รายละเอียดสินค้า', 'รายละเอียด', 'Description']) || `${name} ยี่ห้อ ${currentBrand}`;

      const bestSellerVal = getVal(['สินค้าขายดี', 'Best Seller', 'ขายดี']);
      const isBestSeller = bestSellerVal.includes('ขายดี') || bestSellerVal.toLowerCase().includes('best') || bestSellerVal.toLowerCase().includes('yes');

      processed.push({
        brand: currentBrand,
        imageUrl,
        name,
        modelCode,
        price,
        unit,
        boxPrice,
        category,
        boxQty,
        description,
        isBestSeller
      });
    });

    setParsedRows(processed);
    setHasProcessed(true);
  };

  // Direct File Upload handler (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON array of objects
        const jsonRows = XLSX.utils.sheet_to_json(worksheet);
        processJsonRows(jsonRows);
      } catch (error) {
        alert('ไม่สามารถอ่านไฟล์ Excel ได้ กรุณาตรวจสอบรูปแบบไฟล์');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Manual CSV text parse
  const handleProcessCsvText = () => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#'));
    if (lines.length <= 1) return;

    // Check if headers
    const startIndex = lines[0].includes('ยี่ห้อ') || lines[0].includes('Brand') ? 1 : 0;
    
    const rows = lines.slice(startIndex).map(line => {
      const cols = line.split(',').map(c => c.trim());
      return {
        'ยี่ห้อ': cols[0],
        'รูปภาพ': cols[1],
        'ชื่อสินค้า': cols[2],
        'รหัสสินค้า': cols[3],
        'ราคาขาย': cols[4],
        'หน่วยนับ': cols[5],
        'ราคายกลัง': cols[6],
        'หมวดหมู่': cols[7],
        'ปริมาณบรรจุต่อกล่อง': cols[8],
        'รายละเอียดสินค้า': cols[9],
        'สินค้าขายดี': cols[10]
      };
    });

    processJsonRows(rows);
  };

  const handleConfirmImport = () => {
    const newProducts: Product[] = parsedRows.map((r, idx) => ({
      id: `imp-${Date.now()}-${idx}`,
      name: r.name,
      brand: r.brand as ProductBrand,
      series: `${r.brand} Series`,
      modelCode: r.modelCode,
      grade: 'มาตรฐานศูนย์',
      price: r.price,
      size: '75mm',
      color: 'ขาว',
      category: r.category || 'รางตรง',
      badge: r.isBestSeller ? 'BEST SELLER' : 'IN STOCK',
      isDailyEssential: r.isBestSeller,
      stock: 50,
      imageUrl: r.imageUrl,
      description: r.description,
      unit: r.unit,
      boxQty: r.boxQty,
      boxPrice: r.boxPrice
    }));

    onImportProducts(newProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-100">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-amber-500 text-black">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-black/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-black leading-tight">
                นำเข้าข้อมูลสินค้าด้วยไฟล์ Excel (.xlsx)
              </h3>
              <p className="text-[10px] text-amber-950 font-medium">
                รองรับ 7 หัวข้อหลัก + โหลดไฟล์ .xlsx เข้าสู่ระบบโดยตรง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-amber-600" />
            <span>1. เลือกไฟล์ Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'text'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-amber-600" />
            <span>2. วางข้อความ CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'guide'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>คู่มือการเพิ่มรูปภาพ</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Download Template Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <span className="font-extrabold text-amber-950 text-xs flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>แบบฟอร์มนำเข้าสินค้าสำเร็จรูป (.xlsx)</span>
              </span>
              <p className="text-[11px] text-amber-900">
                ดาวน์โหลดแบบฟอร์มที่มี 7 หัวข้อที่จำเป็น สามารถกรอกใน Microsoft Excel หรือ Google Sheets แล้วอัปโหลดได้ทันที
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl flex items-center justify-center space-x-1.5 shadow-xs active:scale-95 transition-all text-xs shrink-0"
            >
              <Download className="w-4 h-4 text-black" />
              <span>ดาวน์โหลดแบบฟอร์ม Excel</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-neutral-50/50 hover:bg-amber-50/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-500 rounded-2xl flex items-center justify-center mx-auto transition-colors">
                  <FileUp className="w-6 h-6 text-amber-700 group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-neutral-900">
                    คลิกเพื่อเลือกไฟล์ Excel (.xlsx, .xls, .csv)
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    หรือลากไฟล์ Excel มาวางไว้ในบริเวณนี้ได้เลย
                  </p>
                </div>
                {uploadedFileName && (
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>เลือกไฟล์แล้ว: {uploadedFileName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TEXT CSV PASTE */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-800">
                  วางข้อมูลข้อความ CSV ที่นี่:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="text-[10px] font-bold text-amber-800 hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSuccess ? 'คัดลอกแล้ว!' : 'คัดลอกตัวอย่าง'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCsvText(SAMPLE_CSV_FULL);
                      setHasProcessed(false);
                    }}
                    className="text-[10px] font-bold text-amber-800 hover:underline"
                  >
                    ใส่ข้อมูลตัวอย่าง
                  </button>
                </div>
              </div>
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setHasProcessed(false);
                }}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-[11px] text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="วางข้อมูลที่นี่..."
              />
              <button
                onClick={handleProcessCsvText}
                className="w-full py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm text-xs"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>ประมวลผลข้อความ CSV</span>
              </button>
            </div>
          )}

          {/* TAB 3: IMAGE GUIDANCE */}
          {activeTab === 'guide' && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
              <div className="font-extrabold text-sm text-neutral-900 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>คำแนะนำเกี่ยวกับช่องรูปภาพสินค้า (Image Field)</span>
              </div>

              <div className="space-y-2 text-[11px] text-neutral-700">
                <div className="p-2.5 bg-white border border-neutral-200 rounded-xl space-y-1">
                  <div className="font-bold text-neutral-900">วิธีที่ 1: ใส่ URL รูปภาพใน Excel (แนะนำ)</div>
                  <p className="text-neutral-600">
                    ก๊อปปี้ลิงก์รูปภาพ เช่น <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-amber-900 font-bold text-[10px]">https://.../product.jpg</code> วางลงในช่องคอลัมน์ <strong className="text-neutral-900">รูปภาพ</strong> ใน Excel
                  </p>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200 rounded-xl space-y-1">
                  <div className="font-bold text-neutral-900">ข้อกำหนดของคุณภาพไฟล์รูปภาพ:</div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-neutral-600">
                    <li><strong>ประเภทไฟล์:</strong> รองรับ <code className="bg-amber-100/80 px-1 py-0.2 rounded font-mono text-amber-900 font-bold">.jpg</code>, <code className="bg-amber-100/80 px-1 py-0.2 rounded font-mono text-amber-900 font-bold">.png</code>, <code className="bg-amber-100/80 px-1 py-0.2 rounded font-mono text-amber-900 font-bold">.webp</code></li>
                    <li><strong>ขนาดไฟล์:</strong> ไม่เกิน <strong className="text-red-600 font-bold">2 MB</strong> ต่อรูป</li>
                    <li><strong>ขนาดสัดส่วน:</strong> แนะนำขนาด <strong className="text-neutral-900">500 x 500 px</strong> (อัตราส่วน 1:1 พื้นหลังสีขาว)</li>
                  </ul>
                </div>

                <div className="p-2.5 bg-white border border-neutral-200 rounded-xl space-y-1">
                  <div className="font-bold text-neutral-900">หากไม่มีรูปภาพจะเกิดอะไรขึ้น?</div>
                  <p className="text-neutral-600">
                    หากเว้นว่างไว้ ระบบจะสร้างรูปป้ายรหัสสินค้าแบบ SVG สีสันสวยงามให้โดยอัตโนมัติ เพื่อไม่ให้หน้าเว็บว่างเปล่า
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Processed Results Preview Table */}
          {hasProcessed && (
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="flex items-center justify-between text-neutral-900 font-extrabold">
                <span className="flex items-center space-x-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>พบข้อมูลสินค้าพร้อมนำเข้าทั้งหมด ({parsedRows.length} รายการ)</span>
                </span>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-x-auto max-h-56">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-neutral-100 font-bold text-neutral-700 sticky top-0">
                    <tr>
                      <th className="p-2 border-b whitespace-nowrap">1. ยี่ห้อ</th>
                      <th className="p-2 border-b whitespace-nowrap">2. รูปภาพ</th>
                      <th className="p-2 border-b whitespace-nowrap">3. ชื่อสินค้า</th>
                      <th className="p-2 border-b whitespace-nowrap">4. รหัสสินค้า</th>
                      <th className="p-2 border-b whitespace-nowrap">5. ราคาขาย</th>
                      <th className="p-2 border-b whitespace-nowrap">6. หน่วยนับ</th>
                      <th className="p-2 border-b whitespace-nowrap">7. ราคายกลัง</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-amber-50/50">
                        <td className="p-2 whitespace-nowrap">
                          <span className="bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded text-[10px]">
                            {r.brand}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                            {r.imageUrl.startsWith('data:') ? (
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                        </td>
                        <td className="p-2 font-bold text-neutral-900 line-clamp-1 max-w-[140px]">{r.name}</td>
                        <td className="p-2 font-mono text-neutral-600 whitespace-nowrap">{r.modelCode}</td>
                        <td className="p-2 font-bold text-emerald-600 whitespace-nowrap">฿{r.price.toFixed(2)}</td>
                        <td className="p-2 text-neutral-600 whitespace-nowrap">{r.unit}</td>
                        <td className="p-2 font-bold text-amber-700 whitespace-nowrap">฿{r.boxPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs">
          <button
            onClick={handleDownloadTemplate}
            className="text-amber-800 hover:underline font-bold flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>รับไฟล์ Excel ตัวอย่าง (.xlsx)</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              disabled={!hasProcessed || parsedRows.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm disabled:opacity-50 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ยืนยันนำเข้าสินค้าสู่ระบบ ({parsedRows.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


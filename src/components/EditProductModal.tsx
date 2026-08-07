import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductBrand, ProductCategory } from '../types';
import { X, Image as ImageIcon, Upload, Save, Check, Plus, Trash2, Sparkles, HelpCircle } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null means adding a new product
  onSaveProduct: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveProduct,
  onDeleteProduct
}) => {
  const [name, setName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [brand, setBrand] = useState<ProductBrand>('HARU');
  const [category, setCategory] = useState<ProductCategory>('รางตรง');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState('ชิ้น');
  const [boxPrice, setBoxPrice] = useState<number | undefined>(undefined);
  const [boxQty, setBoxQty] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState<string>('IN STOCK');
  const [isDailyEssential, setIsDailyEssential] = useState(false);
  const [stock, setStock] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setModelCode(product.modelCode || '');
      setBrand(product.brand || 'HARU');
      setCategory(product.category || 'รางตรง');
      setPrice(product.price || 0);
      setOriginalPrice(product.originalPrice);
      setUnit(product.unit || 'ชิ้น');
      setBoxPrice(product.boxPrice);
      setBoxQty(product.boxQty);
      setImageUrl(product.imageUrl || '');
      setDescription(product.description || '');
      setBadge(product.badge || 'IN STOCK');
      setIsDailyEssential(!!product.isDailyEssential);
      setStock(product.stock !== undefined ? product.stock : 100);
    } else {
      // Reset defaults for new product
      setName('');
      setModelCode(`ITEM-${Date.now().toString().slice(-4)}`);
      setBrand('HARU');
      setCategory('รางตรง');
      setPrice(0);
      setOriginalPrice(undefined);
      setUnit('ชิ้น');
      setBoxPrice(undefined);
      setBoxQty(undefined);
      setImageUrl('');
      setDescription('');
      setBadge('NEW');
      setIsDailyEssential(false);
      setStock(100);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload (converts image file to Base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ไฟล์รูปภาพมีขนาดใหญ่เกิน 5MB กรุณาเลือกรูปที่มีขนาดเล็กลง');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }

    const formattedImage = formatImageUrl(imageUrl, modelCode, name, brand);

    const updatedProduct: Product = {
      id: product ? product.id : `prod-${Date.now()}`,
      name: name.trim(),
      modelCode: modelCode.trim() || `ITEM-${Date.now().toString().slice(-4)}`,
      brand,
      category,
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      unit: unit.trim() || 'ชิ้น',
      boxPrice: boxPrice ? Number(boxPrice) : undefined,
      boxQty: boxQty ? Number(boxQty) : undefined,
      imageUrl: formattedImage,
      description: description.trim() || `${name} ยี่ห้อ ${brand}`,
      badge: (badge as Product['badge']) || 'IN STOCK',
      isDailyEssential,
      stock: Number(stock) || 100,
      size: product?.size || '75mm',
      color: product?.color || 'ขาว',
      series: product?.series || brand,
      grade: product?.grade || 'มาตรฐาน',
      dimensions: product?.dimensions || 'มาตรฐาน',
      material: product?.material || 'คุณภาพสูง'
    };

    onSaveProduct(updatedProduct);
    onClose();
  };

  const brandsList: ProductBrand[] = ['HARU', 'SCG', 'YAZAKI', 'THAI UNION', 'KMCT', 'AEROFLEX', 'TOTO', 'อื่นๆ'];
  const categoriesList: ProductCategory[] = ['รางตรง', 'ข้องอ', 'ข้อต่อ', 'ฝาครอบ', 'ท่อยืดหยุ่น', 'ฝาครอบเพดาน', 'ท่อน้ำยาแอร์', 'ฉนวนกันความร้อน', 'สายไฟ&เบรกเกอร์', 'ขายาง&ขาแขวน', 'น้ำยาแอร์&เคมีภัณฑ์', 'เครื่องมือช่าง'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden relative border-2 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-amber-400 p-4 flex items-center justify-between text-black shrink-0">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 stroke-[2.5]" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                {product ? 'แก้ไขข้อมูล & รูปภาพสินค้า' : 'เพิ่มสินค้าใหม่เข้าสู่ระบบ'}
              </h2>
              <p className="text-[11px] font-bold text-neutral-800">
                {product ? `รหัส: ${product.modelCode}` : 'เพิ่มสินค้าและแนบไฟล์รูปภาพเพื่อแสดงผลในแอป'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Product Image Section with Preview and Upload */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <label className="block text-xs font-extrabold text-neutral-900 flex items-center justify-between">
              <span>🖼️ รูปภาพสินค้า (Product Image)</span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                แสดงผลในแอปทันที
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Image Preview Box */}
              <div className="sm:col-span-1 h-32 bg-white rounded-xl border border-neutral-200 overflow-hidden flex items-center justify-center p-2 relative group shadow-2xs">
                <img
                  src={formatImageUrl(imageUrl, modelCode, name, brand)}
                  alt="Product preview"
                  onError={(e) => handleImageError(e, modelCode, name, brand)}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Upload & Link Controls */}
              <div className="sm:col-span-2 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    วางลิงก์รูปภาพ (Google Drive, Web URL):
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... หรือ URL รูป"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-black text-amber-400 hover:bg-neutral-800 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>อัปโหลดรูปภาพจากเครื่อง</span>
                  </button>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2.5 py-2 bg-neutral-200 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-xl text-xs font-bold transition-all"
                      title="ลบรุปภาพ"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 font-medium leading-tight">
                  💡 รองรับการอัปโหลดไฟล์รูปจากมือถือ/คอมพิวเตอร์ หรือวางลิงก์ Google Drive
                </p>
              </div>
            </div>
          </div>

          {/* Core Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                ยี่ห้อสินค้า (Brand):
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as ProductBrand)}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {brandsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                หมวดหมู่ (Category):
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                รหัสสินค้า (Model Code) * :
              </label>
              <input
                type="text"
                required
                value={modelCode}
                onChange={(e) => setModelCode(e.target.value)}
                placeholder="เช่น SD-75, KMCT 1/4"
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                ชื่อสินค้า (Product Name) * :
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น รางครอบท่อแอร์ 75 มม."
                className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Pricing & Stock Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                ราคาขาย (฿) * :
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-black text-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                หน่วยนับ:
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ชิ้น / เส้น / ม้วน"
                className="w-full bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                ราคายกลัง (฿):
              </label>
              <input
                type="number"
                step="0.01"
                value={boxPrice || ''}
                onChange={(e) => setBoxPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="ถ้ามี"
                className="w-full bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1">
                จำนวน/ลัง:
              </label>
              <input
                type="number"
                value={boxQty || ''}
                onChange={(e) => setBoxQty(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="ชิ้นต่อกล่อง"
                className="w-full bg-white border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Description & Badges */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              รายละเอียดสินค้า (Description):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ข้อมูลจำเพาะ วัสดุ สี..."
              className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Daily Essential Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="dailyEssential"
              checked={isDailyEssential}
              onChange={(e) => setIsDailyEssential(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-neutral-300 focus:ring-amber-400"
            />
            <label htmlFor="dailyEssential" className="text-xs font-bold text-neutral-800 cursor-pointer">
              ⭐ แสดงในหน้า "สินค้าซื้อซ้ำบ่อย & รายการติดรถช่าง"
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
            {product && onDeleteProduct ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`ต้องการลบสินค้า "${product.name}" ออกใช่หรือไม่?`)) {
                    onDeleteProduct(product.id);
                    onClose();
                  }
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบสินค้านี้</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูลสินค้า</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

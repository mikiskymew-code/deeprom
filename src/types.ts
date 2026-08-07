export type ProductSize = '75mm' | '100mm' | '140mm' | '1/4"' | '3/8"' | '1/2"' | '5/8"' | '3/4"' | 'ทั้งหมด';
export type ProductCategory = 'ทั้งหมด' | 'รางตรง' | 'ข้องอ' | 'ข้อต่อ' | 'ฝาครอบ' | 'ท่อยืดหยุ่น' | 'ฝาครอบเพดาน' | 'ท่อน้ำยาแอร์' | 'ฉนวนกันความร้อน' | 'สายไฟ&เบรกเกอร์' | 'ขายาง&ขาแขวน' | 'น้ำยาแอร์&เคมีภัณฑ์' | 'เครื่องมือช่าง';
export type ProductColor = 'ทั้งหมด' | 'ขาว' | 'ครีม' | 'เทา' | 'ดำ';
export type ProductBrand = 'ทั้งหมด' | 'KMCT' | 'HARU' | 'TOTO' | 'AEROFLEX' | 'CARRIER' | 'DAIKIN' | 'MITSUBISHI' | 'SAMSUNG' | 'YAZAKI' | 'THAI UNION' | 'SCG' | 'LEETECH' | 'VALUE' | 'KAPATEK' | 'WINMAX' | 'อื่นๆ';

export interface Product {
  id: string;
  name: string;
  brand: string;
  series: string;
  modelCode: string;
  grade: string;
  originalPrice?: number;
  price: number; // ราคาต่อชิ้น/ม้วน/เส้น
  size: string;
  color: ProductColor;
  category: ProductCategory;
  badge?: 'IN STOCK' | 'BEST SELLER' | 'SOLD OUT' | 'NEW' | 'PROMO' | 'ยกลังถูกกว่า';
  stock: number;
  isSoldOut?: boolean;
  imageUrl: string;
  description: string;
  dimensions: string;
  material: string;
  unit: string; // หน่วยนับ e.g. ชิ้น, ม้วน, เส้น, กล่อง, หลอด, ถัง
  boxQty?: number; // ปริมาณบรรจุต่อลัง/กระสอบ
  boxPrice?: number; // ราคายกลัง / กระสอบ
  bulkUnitPrice?: number; // ราคาต่อชิ้นเมื่อยกลัง
  isDailyEssential?: boolean; // สินค้าขายดี ต้องซื้อทุกวัน
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  size: string;
  category: string;
  color: string;
  brand: string;
  searchQuery: string;
  inStockOnly: boolean;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'name';
}

export type TabType = 'home' | 'catalog' | 'daily' | 'orders' | 'profile';

export interface Order {
  id: string;
  date: string;
  items: {
    productName: string;
    modelCode: string;
    qty: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'รอยืนยัน' | 'ชำระเงินแล้ว' | 'กำลังจัดส่ง' | 'สำเร็จ';
  trackingNo?: string;
  shippingAddress: string;
}

export interface UserProfile {
  name: string;
  companyName: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  tier: 'ช่างทั่วไป' | 'ช่าง VIP (ส่วนลด 5%)' | 'ผู้รับเหมาโครงการ (ส่วนลด 10%)';
}

export type UserRole = 'OWNER' | 'AUTHORIZED' | 'PENDING' | 'REJECTED';

export interface AuthUser {
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  requestedAt?: string;
  approvedAt?: string;
}

export interface AccessRequest {
  id: string;
  email: string;
  name: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note?: string;
}


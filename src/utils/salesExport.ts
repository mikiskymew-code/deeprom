import { Order, Product } from '../types';

export interface DailySalesSummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalUnitsSold: number;
  itemsBreakdown: {
    productName: string;
    modelCode: string;
    qty: number;
    totalAmount: number;
  }[];
}

/**
 * Filter orders by date string or get today's orders
 */
export const filterOrdersByDate = (orders: Order[], targetDateStr?: string): Order[] => {
  if (!targetDateStr) return orders;

  return orders.filter((order) => {
    if (order.date === 'เมื่อครู่นี้' || order.date.includes('วันนี้')) {
      return targetDateStr === 'TODAY' || targetDateStr === new Date().toISOString().split('T')[0];
    }
    return order.date.includes(targetDateStr);
  });
};

/**
 * Calculate metrics for selected orders
 */
export const getDailyMetrics = (orders: Order[], selectedDate: string = 'วันนี้'): DailySalesSummary => {
  let totalRevenue = 0;
  let totalUnitsSold = 0;
  const itemMap: Record<string, { productName: string; modelCode: string; qty: number; totalAmount: number }> = {};

  orders.forEach((order) => {
    totalRevenue += order.totalAmount;
    order.items.forEach((item) => {
      totalUnitsSold += item.qty;
      const key = item.modelCode || item.productName;
      if (!itemMap[key]) {
        itemMap[key] = {
          productName: item.productName,
          modelCode: item.modelCode,
          qty: 0,
          totalAmount: 0
        };
      }
      itemMap[key].qty += item.qty;
      itemMap[key].totalAmount += item.price * item.qty;
    });
  });

  return {
    date: selectedDate,
    totalOrders: orders.length,
    totalRevenue,
    totalUnitsSold,
    itemsBreakdown: Object.values(itemMap).sort((a, b) => b.totalAmount - a.totalAmount)
  };
};

/**
 * Download CSV file formatted for Excel with UTF-8 BOM
 */
export const downloadExcelCSV = (orders: Order[], dateLabel: string = 'DailySales'): void => {
  const headers = [
    'วันที่สั่งซื้อ (Order Date)',
    'หมายเลขออเดอร์ (Order ID)',
    'รหัสสินค้า (Item Code)',
    'ชื่อสินค้า (Product Name)',
    'จำนวนที่สั่ง (Qty)',
    'ราคาต่อหน่วย (Price)',
    'ยอดรวมรายการ (Subtotal)',
    'ยอดรวมทั้งบิล (Order Total)',
    'สถานะ (Status)',
    'ที่อยู่จัดส่ง (Shipping Address)'
  ];

  const rows: string[][] = [];

  orders.forEach((order) => {
    order.items.forEach((item) => {
      rows.push([
        order.date,
        order.id,
        item.modelCode || '-',
        `"${item.productName.replace(/"/g, '""')}"`,
        item.qty.toString(),
        item.price.toFixed(2),
        (item.price * item.qty).toFixed(2),
        order.totalAmount.toFixed(2),
        order.status,
        `"${(order.shippingAddress || '-').replace(/"/g, '""')}"`
      ]);
    });
  });

  // UTF-8 BOM byte marker so Microsoft Excel renders Thai text correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `รายงานยอดขายแอร์_${dateLabel}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format data for pasting into Google Sheets
 */
export const copyForGoogleSheets = (orders: Order[]): string => {
  const headers = [
    'Order Date\tOrder ID\tModel Code\tProduct Name\tQuantity\tUnit Price (THB)\tItem Total (THB)\tOrder Total (THB)\tStatus'
  ];

  const rows: string[] = [];

  orders.forEach((order) => {
    order.items.forEach((item) => {
      rows.push([
        order.date,
        order.id,
        item.modelCode || '-',
        item.productName,
        item.qty,
        item.price.toFixed(2),
        (item.price * item.qty).toFixed(2),
        order.totalAmount.toFixed(2),
        order.status
      ].join('\t'));
    });
  });

  return [headers[0], ...rows].join('\n');
};

import * as XLSX from 'xlsx';

/**
 * Download product import template formatted as a real XLSX Excel file
 */
export const downloadProductImportExcelTemplate = (): void => {
  const templateData = [
    {
      'ยี่ห้อ': 'KMCT',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      'ชื่อสินค้า': 'ท่อทองแดง KMCT แบบม้วน 1/4 นิ้ว หนา 0.71 มม.',
      'รหัสสินค้า': 'KMCT 1/4x0.71',
      'ราคาขาย (บาท)': 885.00,
      'หน่วยนับ': 'ม้วน',
      'ราคายกลัง (บาท)': 12390.00,
      'หมวดหมู่': 'ท่อน้ำยาแอร์',
      'ปริมาณบรรจุต่อกล่อง': 14,
      'รายละเอียดสินค้า': 'ท่อทองแดงคุณภาพสูงสำหรับงานติดตั้งแอร์',
      'สินค้าขายดี': 'ขายดี'
    },
    {
      'ยี่ห้อ': 'HARU',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500',
      'ชื่อสินค้า': 'รางครอบท่อแอร์ HARU 75 มม. ยาว 2 เมตร',
      'รหัสสินค้า': 'SD-75',
      'ราคาขาย (บาท)': 58.00,
      'หน่วยนับ': 'เส้น',
      'ราคายกลัง (บาท)': 290.00,
      'หมวดหมู่': 'รางตรง',
      'ปริมาณบรรจุต่อกล่อง': 5,
      'รายละเอียดสินค้า': 'รางครอบท่อคุณภาพดี ทนแดด ทนฝน',
      'สินค้าขายดี': 'ขายดี'
    },
    {
      'ยี่ห้อ': 'HARU',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
      'ชื่อสินค้า': 'ฝาครอบผนัง HARU 75 มม.',
      'รหัสสินค้า': 'SW-75',
      'ราคาขาย (บาท)': 26.00,
      'หน่วยนับ': 'ชิ้น',
      'ราคายกลัง (บาท)': 520.00,
      'หมวดหมู่': 'ฝาครอบ',
      'ปริมาณบรรจุต่อกล่อง': 20,
      'รายละเอียดสินค้า': 'ฝาครอบสำหรับปิดช่องเจาะผนัง',
      'สินค้าขายดี': 'ขายดี'
    },
    {
      'ยี่ห้อ': 'HARU',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500',
      'ชื่อสินค้า': 'ข้องอมุม 90 องศา HARU 75 มม.',
      'รหัสสินค้า': 'SC-75',
      'ราคาขาย (บาท)': 25.00,
      'หน่วยนับ': 'ชิ้น',
      'ราคายกลัง (บาท)': 500.00,
      'หมวดหมู่': 'ข้องอ',
      'ปริมาณบรรจุต่อกล่อง': 20,
      'รายละเอียดสินค้า': 'ข้องอฉากสำหรับเดินรางเลี้ยวโค้ง',
      'สินค้าขายดี': 'ปกติ'
    },
    {
      'ยี่ห้อ': 'TOTO SLIM',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      'ชื่อสินค้า': 'ฝาครอบหัวกระโหลก TOTO SLIM 75 มม.',
      'รหัสสินค้า': 'TW-75',
      'ราคาขาย (บาท)': 45.00,
      'หน่วยนับ': 'ชิ้น',
      'ราคายกลัง (บาท)': 900.00,
      'หมวดหมู่': 'ฝาครอบ',
      'ปริมาณบรรจุต่อกล่อง': 20,
      'รายละเอียดสินค้า': 'ฝาครอบหัวกระโหลกพรีเมียมจากญี่ปุ่น',
      'สินค้าขายดี': 'ปกติ'
    },
    {
      'ยี่ห้อ': 'VALUE',
      'รูปภาพ (URL หรือ ชื่อไฟล์)': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      'ชื่อสินค้า': 'ชุดบานท่อแอร์เกจดิจิทัล VALUE',
      'รหัสสินค้า': 'VFT-808-I',
      'ราคาขาย (บาท)': 2850.00,
      'หน่วยนับ': 'ชุด',
      'ราคายกลัง (บาท)': 2850.00,
      'หมวดหมู่': 'เครื่องมือช่าง',
      'ปริมาณบรรจุต่อกล่อง': 1,
      'รายละเอียดสินค้า': 'ชุดบานท่อคุณภาพสูงสำหรับช่างมืออาชีพ',
      'สินค้าขายดี': 'ขายดี'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Import Template');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // ยี่ห้อ
    { wch: 45 }, // รูปภาพ
    { wch: 40 }, // ชื่อสินค้า
    { wch: 20 }, // รหัสสินค้า
    { wch: 15 }, // ราคาขาย
    { wch: 10 }, // หน่วยนับ
    { wch: 15 }, // ราคายกลัง
    { wch: 15 }, // หมวดหมู่
    { wch: 20 }, // ปริมาณบรรจุต่อกล่อง
    { wch: 35 }, // รายละเอียด
    { wch: 12 }  // สินค้าขายดี
  ];

  XLSX.writeFile(workbook, `แบบฟอร์มนำเข้าสินค้า_Excel_อะไหล่ดีพร้อมแอร์.xlsx`);
};

export const exportProductsToExcel = (products: Product[]): void => {
  const exportData = products.map(p => ({
    'ยี่ห้อ': p.brand || '-',
    'รูปภาพ (URL/Path)': p.imageUrl || '-',
    'ชื่อสินค้า': p.name || '',
    'รหัสสินค้า': p.modelCode || '',
    'หมวดหมู่': p.category || 'ทั้งหมด',
    'หน่วยนับ': p.unit || 'ชิ้น',
    'ราคาขาย (บาท)': p.price || 0,
    'ราคายกลัง (บาท)': p.boxPrice || 0,
    'ปริมาณบรรจุต่อกล่อง': p.boxQty || 1,
    'สินค้าขายดี': p.isDailyEssential || p.badge === 'BEST SELLER' ? 'ขายดี' : 'ปกติ',
    'สถานะสินค้า': p.badge || 'IN STOCK',
    'รายละเอียดสินค้า': p.description || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Catalog');
  XLSX.writeFile(workbook, `รายการสินค้า_อะไหล่ดีพร้อมแอร์_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


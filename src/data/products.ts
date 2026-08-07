import { Product, UserProfile, Order } from '../types';

// Dynamic Clean SVG Data URLs for precise technical product visual representations
const createSvgDataUrl = (type: string, code: string, label: string, colorHex: string = '#E5E7EB', brand: string = '') => {
  let innerGraphics = '';
  
  if (type === 'copper-coil') {
    innerGraphics = `
      <!-- Copper Pipe Coil -->
      <ellipse cx="100" cy="60" rx="60" ry="32" fill="none" stroke="#D97706" stroke-width="12" />
      <ellipse cx="100" cy="60" rx="45" ry="22" fill="none" stroke="#B45309" stroke-width="10" />
      <ellipse cx="100" cy="60" rx="30" ry="14" fill="none" stroke="#92400E" stroke-width="8" />
      <rect x="85" y="48" width="30" height="24" rx="3" fill="#1E293B" opacity="0.85" />
      <text x="100" y="63" font-family="sans-serif" font-size="8" font-weight="bold" fill="#F3F4F6" text-anchor="middle">COPPER</text>
    `;
  } else if (type === 'copper-set') {
    innerGraphics = `
      <!-- Insulated Copper Pair Coil -->
      <rect x="25" y="42" width="150" height="16" rx="8" fill="#FFFFFF" stroke="#374151" stroke-width="2" />
      <rect x="25" y="62" width="150" height="20" rx="10" fill="#FFFFFF" stroke="#374151" stroke-width="2" />
      <circle cx="35" cy="50" r="4" fill="#D97706" />
      <circle cx="35" cy="72" r="6" fill="#D97706" />
      <text x="100" y="64" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle">${brand} AIR PIPE</text>
    `;
  } else if (type === 'aeroflex') {
    innerGraphics = `
      <!-- Aeroflex Black Rubber Insulation Tube -->
      <rect x="20" y="45" width="160" height="30" rx="15" fill="#18181B" stroke="#3F3F46" stroke-width="2" />
      <ellipse cx="30" cy="60" rx="10" ry="15" fill="#27272A" stroke="#52525B" />
      <ellipse cx="30" cy="60" rx="5" ry="8" fill="#D97706" />
      <text x="105" y="64" font-family="sans-serif" font-size="9" font-weight="bold" fill="#F4F4F5" text-anchor="middle">AEROFLEX TUBE</text>
    `;
  } else if (type === 'straight') {
    innerGraphics = `
      <!-- Duct Trunking -->
      <rect x="25" y="45" width="150" height="30" rx="4" fill="${colorHex}" stroke="#374151" stroke-width="2.5" />
      <line x1="25" y1="52" x2="175" y2="52" stroke="#6B7280" stroke-width="1.5" stroke-dasharray="4 2" />
      <path d="M 175 45 L 185 40 L 185 80 L 175 75 Z" fill="#9CA3AF" stroke="#374151" stroke-width="2" />
      <text x="100" y="65" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle">${brand || 'TRUNKING'}</text>
    `;
  } else if (type === 'elbow') {
    innerGraphics = `
      <!-- 90 Deg Elbow -->
      <path d="M 40 100 L 40 60 Q 40 30 70 30 L 140 30 L 140 60 L 80 60 Q 70 60 70 70 L 70 100 Z" fill="${colorHex}" stroke="#374151" stroke-width="2.5" />
      <text x="95" y="75" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle">ELBOW 90°</text>
    `;
  } else if (type === 'joint') {
    innerGraphics = `
      <!-- Joint / Coupler -->
      <rect x="50" y="35" width="100" height="50" rx="6" fill="${colorHex}" stroke="#374151" stroke-width="2.5" />
      <line x1="100" y1="35" x2="100" y2="85" stroke="#4B5563" stroke-width="2" />
      <text x="100" y="64" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle">COUPLER</text>
    `;
  } else if (type === 'wall') {
    innerGraphics = `
      <!-- Wall Cap Cover -->
      <rect x="40" y="25" width="120" height="70" rx="8" fill="${colorHex}" stroke="#374151" stroke-width="2.5" />
      <ellipse cx="100" cy="60" rx="35" ry="20" fill="#9CA3AF" stroke="#374151" stroke-width="2" />
      <text x="100" y="64" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">WALL CAP</text>
    `;
  } else if (type === 'wire') {
    innerGraphics = `
      <!-- Cable Wire Roll -->
      <ellipse cx="100" cy="60" rx="55" ry="30" fill="none" stroke="${colorHex}" stroke-width="18" />
      <ellipse cx="100" cy="60" rx="35" ry="18" fill="#111827" stroke="#374151" stroke-width="2" />
      <text x="100" y="63" font-family="sans-serif" font-size="9" font-weight="bold" fill="#F3F4F6" text-anchor="middle">${brand} CABLE</text>
    `;
  } else if (type === 'refrigerant') {
    innerGraphics = `
      <!-- Refrigerant Tank -->
      <rect x="75" y="35" width="50" height="65" rx="12" fill="${colorHex}" stroke="#1E293B" stroke-width="2.5" />
      <rect x="85" y="20" width="30" height="15" fill="#9CA3AF" stroke="#1E293B" stroke-width="2" />
      <circle cx="100" cy="18" r="6" fill="#EF4444" />
      <text x="100" y="70" font-family="sans-serif" font-size="9" font-weight="black" fill="#111827" text-anchor="middle">${label}</text>
    `;
  } else if (type === 'breaker') {
    innerGraphics = `
      <!-- Safety Breaker -->
      <rect x="65" y="25" width="70" height="75" rx="6" fill="#334155" stroke="#0F172A" stroke-width="2.5" />
      <rect x="85" y="45" width="30" height="35" rx="3" fill="#1E293B" />
      <rect x="92" y="50" width="16" height="12" rx="2" fill="#EF4444" />
      <text x="100" y="88" font-family="sans-serif" font-size="8" font-weight="bold" fill="#F8FAFC" text-anchor="middle">CCS 32A</text>
    `;
  } else if (type === 'bracket') {
    innerGraphics = `
      <!-- Wall Bracket -->
      <path d="M 40 30 L 40 90 L 160 90 L 140 80 L 55 80 L 55 30 Z" fill="#475569" stroke="#0F172A" stroke-width="2" />
      <line x1="40" y1="90" x2="140" y2="30" stroke="#0F172A" stroke-width="3" />
      <text x="100" y="65" font-family="sans-serif" font-size="8" font-weight="bold" fill="#F8FAFC" text-anchor="middle">BRACKET</text>
    `;
  } else if (type === 'sealant') {
    innerGraphics = `
      <!-- Sealant Tube -->
      <rect x="40" y="48" width="110" height="24" rx="4" fill="#E2E8F0" stroke="#1E293B" stroke-width="2" />
      <path d="M 150 52 L 180 60 L 150 68 Z" fill="#64748B" />
      <rect x="25" y="50" width="15" height="20" fill="#334155" />
      <text x="95" y="64" font-family="sans-serif" font-size="8" font-weight="bold" fill="#0F172A" text-anchor="middle">${label}</text>
    `;
  } else {
    innerGraphics = `
      <!-- Tools / Generic -->
      <rect x="45" y="30" width="110" height="60" rx="10" fill="${colorHex}" stroke="#374151" stroke-width="2.5" />
      <text x="100" y="64" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1F2937" text-anchor="middle">${label}</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
    <rect width="200" height="120" fill="#F8FAFC" rx="8" />
    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>
    </pattern>
    <rect width="200" height="120" fill="url(#grid)" />
    ${innerGraphics}
    ${brand ? `<rect x="8" y="8" width="55" height="14" rx="3" fill="#000000" opacity="0.85" />
    <text x="35.5" y="18" font-family="sans-serif" font-size="8" font-weight="black" fill="#FBBF24" text-anchor="middle">${brand}</text>` : ''}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_PRODUCTS: Product[] = [
  // ========================================================
  // 1. KMCT - ท่อทองแดง (COPPER PIPES)
  // ========================================================
  {
    id: 'kmct-14-coil',
    name: 'ท่อทองแดง KMCT แบบม้วน 1/4" x 0.71 mm (ยกลัง 14 ม้วน)',
    brand: 'KMCT',
    series: 'KMCT Copper Coil',
    modelCode: 'KMCT 1/4x0.71',
    grade: 'หนา 0.71 มิล',
    price: 885.00,
    size: '1/4"',
    color: 'ดำ',
    category: 'ท่อน้ำยาแอร์',
    badge: 'BEST SELLER',
    stock: 80,
    imageUrl: createSvgDataUrl('copper-coil', 'KMCT-14', 'ท่อทองแดง 1/4"', '#D97706', 'KMCT'),
    description: 'ท่อทองแดงคุณภาพสูง KMCT แบบม้วน ขนาด 1/4 นิ้ว หนา 0.71 มม. เหนียว ดัดง่าย ไม่รั่วซึมง่าย',
    dimensions: 'ขนาด 1/4 นิ้ว x หนา 0.71 mm x ยาว 15 เมตร',
    material: 'Pure Seamless Copper 99.9%',
    unit: 'ม้วน',
    boxQty: 14,
    boxPrice: 11900.00,
    bulkUnitPrice: 850.00,
    isDailyEssential: true
  },
  {
    id: 'kmct-38-coil',
    name: 'ท่อทองแดง KMCT แบบม้วน 3/8" x 0.71 mm (ยกลัง 10 ม้วน)',
    brand: 'KMCT',
    series: 'KMCT Copper Coil',
    modelCode: 'KMCT 3/8x0.71',
    grade: 'หนา 0.71 มิล',
    price: 1424.00,
    size: '3/8"',
    color: 'ดำ',
    category: 'ท่อน้ำยาแอร์',
    badge: 'BEST SELLER',
    stock: 65,
    imageUrl: createSvgDataUrl('copper-coil', 'KMCT-38', 'ท่อทองแดง 3/8"', '#D97706', 'KMCT'),
    description: 'ท่อทองแดง KMCT แบบม้วน ขนาด 3/8 นิ้ว หนา 0.71 มม. ทนแรงดันน้ำยา R32 / R410a ได้เยี่ยมยอด',
    dimensions: 'ขนาด 3/8 นิ้ว x หนา 0.71 mm x ยาว 15 เมตร',
    material: 'Seamless Copper',
    unit: 'ม้วน',
    boxQty: 10,
    boxPrice: 13800.00,
    bulkUnitPrice: 1380.00,
    isDailyEssential: true
  },
  {
    id: 'kmct-12-coil',
    name: 'ท่อทองแดง KMCT แบบม้วน 1/2" x 0.71 mm (ยกลัง 8 ม้วน)',
    brand: 'KMCT',
    series: 'KMCT Copper Coil',
    modelCode: 'KMCT 1/2x0.71',
    grade: 'หนา 0.71 มิล',
    price: 1883.00,
    size: '1/2"',
    color: 'ดำ',
    category: 'ท่อน้ำยาแอร์',
    badge: 'IN STOCK',
    stock: 40,
    imageUrl: createSvgDataUrl('copper-coil', 'KMCT-12', 'ท่อทองแดง 1/2"', '#D97706', 'KMCT'),
    description: 'ท่อทองแดง KMCT ขนาด 1/2 นิ้ว หนา 0.71 มิล บรรจุลังละ 8 ม้วน',
    dimensions: 'ขนาด 1/2 นิ้ว x หนา 0.71 mm',
    material: 'Pure Copper',
    unit: 'ม้วน',
    boxQty: 8,
    boxPrice: 14400.00,
    bulkUnitPrice: 1800.00,
    isDailyEssential: true
  },

  // ========================================================
  // 2. ท่อแอร์ชุดสำเร็จรูป (CARRIER, DAIKIN, MITSUBISHI, SAMSUNG)
  // ========================================================
  {
    id: 'carrier-1438',
    name: 'ท่อแอร์ชุดสำเร็จรูป CARRIER 3/8 + 1/4" (หนา 0.70mm)',
    brand: 'CARRIER',
    series: 'Carrier Pair Coil',
    modelCode: 'PPK1438',
    grade: 'แท้ศูนย์ CARRIER',
    price: 874.00,
    size: '3/8"',
    color: 'ขาว',
    category: 'ท่อน้ำยาแอร์',
    badge: 'BEST SELLER',
    stock: 90,
    imageUrl: createSvgDataUrl('copper-set', 'PPK1438', 'CARRIER 3/8+1/4', '#F8FAFC', 'CARRIER'),
    description: 'ท่อทองแดงสำเร็จรูปหุ้มฉนวนยี่ห้อ CARRIER ขนาด 3/8" + 1/4" ยาว 4 เมตร หนา 0.70 มม.',
    dimensions: '3/8" + 1/4" x ยาว 4 เมตร',
    material: 'Copper + Insulated PE Foam',
    unit: 'กล่อง',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'daikin-racn',
    name: 'ท่อแอร์ชุดสำเร็จรูป DAIKIN 3/8 + 1/4" (หนา 0.80mm)',
    brand: 'DAIKIN',
    series: 'Daikin Factory Pipe Set',
    modelCode: 'RA-CN',
    grade: 'หนาพิเศษ 0.80 มิล',
    price: 989.00,
    size: '3/8"',
    color: 'ขาว',
    category: 'ท่อน้ำยาแอร์',
    badge: 'BEST SELLER',
    stock: 120,
    imageUrl: createSvgDataUrl('copper-set', 'RA-CN', 'DAIKIN 3/8+1/4', '#F8FAFC', 'DAIKIN'),
    description: 'ท่อแอร์สำเร็จรูป DAIKIN แท้ หนาพิเศษ 0.80 มิล ฉนวนเหนียวนุ่ม ทนUV สำหรับแอร์ไดกิ้นทุกรุ่น',
    dimensions: '3/8" + 1/4" x ยาว 4 เมตร',
    material: 'High-Density Copper + UV PE',
    unit: 'กล่อง',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'mitsubishi-321',
    name: 'ท่อแอร์ชุดสำเร็จรูป MITSUBISHI HEAVYDUTY 3/8 + 1/4"',
    brand: 'MITSUBISHI',
    series: 'Mitsubishi Heavy Duty Pipe',
    modelCode: 'RPE 321-5C',
    grade: 'มาตรฐานมิตซูบิชิ',
    price: 874.00,
    size: '3/8"',
    color: 'ขาว',
    category: 'ท่อน้ำยาแอร์',
    badge: 'IN STOCK',
    stock: 85,
    imageUrl: createSvgDataUrl('copper-set', 'RPE-321', 'MITSUBISHI 3/8+1/4', '#F8FAFC', 'MITSUBISHI'),
    description: 'ชุดท่อน้ำยาแอร์สำเร็จรูป MITSUBISHI HEAVYDUTY ขนาด 3/8 + 1/4 นิ้ว หนา 0.70 มิล ยาว 4 เมตร',
    dimensions: '3/8" + 1/4" x ยาว 4 เมตร',
    material: 'Copper Pipe + Insulation',
    unit: 'กล่อง',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'samsung-fsc1438',
    name: 'ท่อแอร์ชุดสำเร็จรูป SAMSUNG 3/8 + 1/4"',
    brand: 'SAMSUNG',
    series: 'Samsung Pipe Kit',
    modelCode: 'FSC1438Z3',
    grade: 'มาตรฐานซัมซุง',
    price: 874.00,
    size: '3/8"',
    color: 'ขาว',
    category: 'ท่อน้ำยาแอร์',
    badge: 'IN STOCK',
    stock: 60,
    imageUrl: createSvgDataUrl('copper-set', 'FSC1438', 'SAMSUNG 3/8+1/4', '#F8FAFC', 'SAMSUNG'),
    description: 'ท่อแอร์สำเร็จรูป SAMSUNG ขนาด 3/8 + 1/4 นิ้ว หนา 0.70 มิล พร้อมบานแฟร์และฉนวนหุ้มแน่นหนา',
    dimensions: '3/8" + 1/4" x ยาว 4 เมตร',
    material: 'Seamless Copper Pipe',
    unit: 'กล่อง',
    boxQty: 1
  },

  // ========================================================
  // 3. AEROFLEX & AEROTAPE - ฉนวนกันความร้อน
  // ========================================================
  {
    id: 'aeroflex-1214',
    name: 'ฉนวนยางดำ AEROFLEX หนา 1/2" รุ่น 1214 (1/4" ID) (ยกลัง 80 เส้น)',
    brand: 'AEROFLEX',
    series: 'Aeroflex Insulation',
    modelCode: 'AEROFLEX 1214',
    grade: 'หนา 1/2 นิ้ว',
    originalPrice: 44.00,
    price: 44.00,
    size: '1/4"',
    color: 'ดำ',
    category: 'ฉนวนกันความร้อน',
    badge: 'ยกลังถูกกว่า',
    stock: 500,
    imageUrl: createSvgDataUrl('aeroflex', 'AF-1214', 'AEROFLEX 1214', '#18181B', 'AEROFLEX'),
    description: 'ฉนวนยางดำ AEROFLEX หนา 1/2" รุ่น 1214 ยาง EPDM โครงสร้างเซลล์ปิด ป้องกันการเกิดหยดน้ำเกาะ',
    dimensions: 'รูใน 1/4" x หนา 1/2" x ยาว 1.83 เมตร',
    material: 'EPDM Closed-Cell Rubber',
    unit: 'เส้น',
    boxQty: 80,
    boxPrice: 3200.00,
    bulkUnitPrice: 40.00,
    isDailyEssential: true
  },
  {
    id: 'aeroflex-1238',
    name: 'ฉนวนยางดำ AEROFLEX หนา 1/2" รุ่น 1238 (3/8" ID) (ยกลัง 70 เส้น)',
    brand: 'AEROFLEX',
    series: 'Aeroflex Insulation',
    modelCode: 'AEROFLEX 1238',
    grade: 'หนา 1/2 นิ้ว',
    originalPrice: 47.00,
    price: 47.00,
    size: '3/8"',
    color: 'ดำ',
    category: 'ฉนวนกันความร้อน',
    badge: 'ยกลังถูกกว่า',
    stock: 450,
    imageUrl: createSvgDataUrl('aeroflex', 'AF-1238', 'AEROFLEX 1238', '#18181B', 'AEROFLEX'),
    description: 'ฉนวนยางดำ AEROFLEX รูใน 3/8" หนา 1/2" ยกลัง 70 เส้น ตกเส้นละ 43 บาทเท่านั้น!',
    dimensions: 'รูใน 3/8" x หนา 1/2" x ยาว 1.83 เมตร',
    material: 'EPDM Closed-Cell Rubber',
    unit: 'เส้น',
    boxQty: 70,
    boxPrice: 3010.00,
    bulkUnitPrice: 43.00,
    isDailyEssential: true
  },
  {
    id: 'aerotape-tape',
    name: 'เทปยางดำชนิดมีกาวในตัว AEROTAPE (ยกลัง 10 ม้วน)',
    brand: 'AEROFLEX',
    series: 'Aerotape Self-Adhesive',
    modelCode: 'AEROTAPE',
    grade: 'กาวในตัวเหนียวพิเศษ',
    originalPrice: 156.00,
    price: 156.00,
    size: 'ทั้งหมด',
    color: 'ดำ',
    category: 'ฉนวนกันความร้อน',
    badge: 'BEST SELLER',
    stock: 300,
    imageUrl: createSvgDataUrl('aeroflex', 'AEROTAPE', 'AEROTAPE', '#18181B', 'AEROFLEX'),
    description: 'เทปยางฉนวนมีกาวในตัว AEROTAPE สำหรับพันรอยต่อท่อแอร์ ข้อต่อ วาล์ว กันหยดน้ำเกาะได้ 100%',
    dimensions: 'กว้าง 2 นิ้ว x หนา 3 มม. x ยาว 30 ฟุต (9.1 เมตร)',
    material: 'EPDM Foam Tape + Adhesive Backing',
    unit: 'ม้วน',
    boxQty: 10,
    boxPrice: 1420.00,
    bulkUnitPrice: 142.00,
    isDailyEssential: true
  },

  // ========================================================
  // 4. HARU - รางครอบท่อและอุปกรณ์ (TRUNKING 75mm)
  // ========================================================
  {
    id: 'haru-sd75',
    name: 'รางครอบท่อแอร์ HARU ขนาด 75 มิล (ยกลัง 5 เส้น)',
    brand: 'HARU',
    series: 'HARU Trunking 75mm',
    modelCode: 'HARU SD-75',
    grade: 'PVC เกรด A ทน UV',
    price: 58.00,
    size: '75mm',
    color: 'ขาว',
    category: 'รางตรง',
    badge: 'BEST SELLER',
    stock: 500,
    imageUrl: createSvgDataUrl('straight', 'SD-75', 'รางครอบท่อ 75mm', '#FFFFFF', 'HARU'),
    description: 'รางครอบท่อแอร์ HARU 75mm ยาว 2 เมตร ผิวขาวเงาไม่เหลืองกรอบง่าย สวยงาม ทนทาน ล็อคแน่น',
    dimensions: 'กว้าง 75mm x สูง 60mm x ยาว 2000mm',
    material: 'Rigid PVC Grade A UV Protection',
    unit: 'เส้น',
    boxQty: 5,
    boxPrice: 265.00,
    bulkUnitPrice: 53.00,
    isDailyEssential: true
  },
  {
    id: 'haru-sw75',
    name: 'ฝาครอบผนัง HARU ขนาด 75 มิล (ยกลัง 20 ชิ้น)',
    brand: 'HARU',
    series: 'HARU Accessories',
    modelCode: 'HARU SW-75',
    grade: 'SNOW WHITE',
    price: 26.00,
    size: '75mm',
    color: 'ขาว',
    category: 'ฝาครอบ',
    badge: 'ยกลังถูกกว่า',
    stock: 400,
    imageUrl: createSvgDataUrl('wall', 'SW-75', 'ฝาครอบ 75mm', '#FFFFFF', 'HARU'),
    description: 'ฝาครอบทางออกท่อผนัง HARU 75mm ยกลัง 20 ชิ้น เหลือเพียงชิ้นละ 24 บาท!',
    dimensions: 'สำหรับราง 75mm',
    material: 'PVC High Impact',
    unit: 'ชิ้น',
    boxQty: 20,
    boxPrice: 480.00,
    bulkUnitPrice: 24.00,
    isDailyEssential: true
  },
  {
    id: 'haru-sc75',
    name: 'ข้องอมุม 90 องศา HARU ขนาด 75 มิล (ยกลัง 20 ชิ้น)',
    brand: 'HARU',
    series: 'HARU Accessories',
    modelCode: 'HARU SC-75',
    grade: 'SNOW WHITE',
    price: 25.00,
    size: '75mm',
    color: 'ขาว',
    category: 'ข้องอ',
    badge: 'BEST SELLER',
    stock: 600,
    imageUrl: createSvgDataUrl('elbow', 'SC-75', 'ข้องอ 90° 75mm', '#FFFFFF', 'HARU'),
    description: 'ข้องอมุม 90 องศา HARU เข้ามุมสวยแนบสนิท ยกลัง 20 ชิ้น 460 บาท (ชิ้นละ 23 บาท)',
    dimensions: 'มุม 90° สำหรับราง 75mm',
    material: 'PVC Grade A',
    unit: 'ชิ้น',
    boxQty: 20,
    boxPrice: 460.00,
    bulkUnitPrice: 23.00,
    isDailyEssential: true
  },
  {
    id: 'haru-sj75',
    name: 'ข้อต่อตรง HARU ขนาด 75 มิล (ยกลัง 50 ชิ้น)',
    brand: 'HARU',
    series: 'HARU Accessories',
    modelCode: 'HARU SJ-75',
    grade: 'SNOW WHITE',
    price: 11.00,
    size: '75mm',
    color: 'ขาว',
    category: 'ข้อต่อ',
    badge: 'ยกลังถูกกว่า',
    stock: 800,
    imageUrl: createSvgDataUrl('joint', 'SJ-75', 'ข้อต่อตรง 75mm', '#FFFFFF', 'HARU'),
    description: 'ข้อต่อตรงสำหรับเชื่อมต่อราง HARU 75mm ยกลัง 50 ชิ้น เหลือเพียงชิ้นละ 10 บาทเท่านั้น!',
    dimensions: 'สำหรับราง 75mm',
    material: 'PVC',
    unit: 'ชิ้น',
    boxQty: 50,
    boxPrice: 500.00,
    bulkUnitPrice: 10.00,
    isDailyEssential: true
  },

  // ========================================================
  // 5. TOTO - รางครอบท่อและอุปกรณ์ (TRUNKING 75mm & 100mm)
  // ========================================================
  {
    id: 'toto-td75',
    name: 'รางครอบท่อ TOTO ขนาด 75 มิล (ยกลัง 5 เส้น)',
    brand: 'TOTO',
    series: 'TOTO Trunking 75mm',
    modelCode: 'TOTO TD-75',
    grade: 'PVC หนาทนทาน',
    price: 61.00,
    size: '75mm',
    color: 'ขาว',
    category: 'รางตรง',
    badge: 'BEST SELLER',
    stock: 350,
    imageUrl: createSvgDataUrl('straight', 'TD-75', 'ราง TOTO 75mm', '#F8FAFC', 'TOTO'),
    description: 'รางครอบท่อแอร์ TOTO 75mm สวยงาม มาตรฐานช่างติดตั้งยกลัง 5 เส้น เหลือเส้นละ 55 บาท',
    dimensions: 'กว้าง 75mm x ยาว 2000mm',
    material: 'PVC Grade A',
    unit: 'เส้น',
    boxQty: 5,
    boxPrice: 275.00,
    bulkUnitPrice: 55.00,
    isDailyEssential: true
  },
  {
    id: 'toto-tc75',
    name: 'ข้องอมุม 90 องศา TOTO ขนาด 75 มิล (ยกลัง 20 ชิ้น)',
    brand: 'TOTO',
    series: 'TOTO Accessories',
    modelCode: 'TOTO TC-75',
    grade: 'SNOW WHITE',
    price: 19.00,
    size: '75mm',
    color: 'ขาว',
    category: 'ข้องอ',
    badge: 'PROMO',
    stock: 500,
    imageUrl: createSvgDataUrl('elbow', 'TC-75', 'ข้องอ TOTO 75mm', '#F8FAFC', 'TOTO'),
    description: 'ข้องอ 90° TOTO 75mm ชิ้นละ 19 บาท ยกลัง 20 ชิ้นเพียง 350 บาท (ตกชิ้นละ 17.50 บาท)',
    dimensions: 'มุม 90° ราง 75mm',
    material: 'PVC',
    unit: 'ชิ้น',
    boxQty: 20,
    boxPrice: 350.00,
    bulkUnitPrice: 17.50,
    isDailyEssential: true
  },
  {
    id: 'toto-td100',
    name: 'รางครอบท่อแอร์ TOTO ขนาด 100 มิล - JUMBO (ยกลัง 5 เส้น)',
    brand: 'TOTO',
    series: 'TOTO Trunking 100mm',
    modelCode: 'TOTO TD-100',
    grade: 'JUMBO SIZE',
    price: 143.00,
    size: '100mm',
    color: 'ขาว',
    category: 'รางตรง',
    badge: 'BEST SELLER',
    stock: 120,
    imageUrl: createSvgDataUrl('straight', 'TD-100', 'ราง TOTO 100mm', '#F8FAFC', 'TOTO'),
    description: 'รางครอบท่อแอร์ไซส์ใหญ่พิเศษ 100mm TOTO สำหรับแอร์ใหญ่หรือเดินท่อคู่ ยกลัง 5 เส้น เหลือเส้นละ 131 บาท',
    dimensions: 'กว้าง 100mm x ยาว 2000mm',
    material: 'Heavy PVC',
    unit: 'เส้น',
    boxQty: 5,
    boxPrice: 655.00,
    bulkUnitPrice: 131.00,
    isDailyEssential: true
  },

  // ========================================================
  // 6. YAZAKI & THAI UNION - สายไฟช่างแอร์ (CABLES)
  // ========================================================
  {
    id: 'yazaki-thw-1x25-blue',
    name: 'สายไฟ YAZAKI THW 1x2.5 ตร.มม. สีฟ้า (100 เมตร)',
    brand: 'YAZAKI',
    series: 'Yazaki THW Wire',
    modelCode: 'YAZAKI THW 1x2.5 BLUE',
    grade: 'ทองแดงแท้ 100% มอก.',
    price: 1461.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'สายไฟ&เบรกเกอร์',
    badge: 'BEST SELLER',
    stock: 90,
    imageUrl: createSvgDataUrl('wire', 'THW-2.5', 'YAZAKI 1x2.5', '#3B82F6', 'YAZAKI'),
    description: 'สายไฟ THW YAZAKI ขนาด 1x2.5 มม. สีฟ้า ม้วนละ 100 เมตร สายไฟมาตรฐานมอก. ทองแดงเต็ม100%',
    dimensions: '1x2.5 sq.mm. x 100 เมตร',
    material: 'Copper Conductor + PVC Insulation',
    unit: 'ม้วน',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'thaiunion-thw-1x25-green',
    name: 'สายไฟ THAI UNION THW 1x2.5 ตร.มม. สีเขียว (100 เมตร)',
    brand: 'THAI UNION',
    series: 'Thai Union Wire',
    modelCode: 'THAI UNION THW 1x2.5 GREEN',
    grade: 'มอก. สายดิน',
    price: 729.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'สายไฟ&เบรกเกอร์',
    badge: 'IN STOCK',
    stock: 110,
    imageUrl: createSvgDataUrl('wire', 'TU-2.5G', 'THAI UNION 1x2.5', '#22C55E', 'THAI UNION'),
    description: 'สายไฟ THW THAI UNION 1x2.5 มม. สีเขียว สำหรับสายดิน ราคาสุดคุ้มม้วนละ 729 บาท',
    dimensions: '1x2.5 sq.mm. x 100 เมตร',
    material: 'Copper + PVC',
    unit: 'ม้วน',
    boxQty: 1,
    isDailyEssential: true
  },

  // ========================================================
  // 7. น้ำยาแอร์ & เคมีภัณฑ์ (REFRIGERANTS, SEALANTS, BRAZING)
  // ========================================================
  {
    id: 'ref-r32-3kg',
    name: 'น้ำยาแอร์ R-32 บรรจุถัง 3 กิโลกรัม (ถังพกพา)',
    brand: 'อื่นๆ',
    series: 'Refrigerant Tank',
    modelCode: 'R-32 3KG',
    grade: 'ความบริสุทธิ์ 99.9%',
    price: 1208.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'น้ำยาแอร์&เคมีภัณฑ์',
    badge: 'BEST SELLER',
    stock: 150,
    imageUrl: createSvgDataUrl('refrigerant', 'R-32', 'R-32 (3KG)', '#10B981', 'R-32'),
    description: 'น้ำยาแอร์ R-32 ถังขนาดพกพา 3 กก. น้ำหนักเบา หิ้วขึ้นที่สูงเติมแอร์บ้านสะดวกมาก',
    dimensions: 'บรรจุสุทธิ 3 กก.',
    material: 'R32 Refrigerant Gas 99.9%',
    unit: 'ถัง',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'ref-r410a-28kg',
    name: 'น้ำยาแอร์ R-410a บรรจุถัง 2.8 กิโลกรัม',
    brand: 'อื่นๆ',
    series: 'Refrigerant Tank',
    modelCode: 'R-410a 2.8KG',
    grade: 'ความบริสุทธิ์ 99.9%',
    price: 1040.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'น้ำยาแอร์&เคมีภัณฑ์',
    badge: 'IN STOCK',
    stock: 100,
    imageUrl: createSvgDataUrl('refrigerant', 'R410A', 'R-410a (2.8KG)', '#EC4899', 'R-410a'),
    description: 'น้ำยาแอร์ R410a ถังบรรจุ 2.8 กิโลกรัม สำหรับงานซ่อมบำรุงและเติมระบบแอร์อินเวอร์เตอร์',
    dimensions: 'บรรจุสุทธิ 2.8 กก.',
    material: 'R410a Gas',
    unit: 'ถัง',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'bravo-sealant-700',
    name: 'อะคริลิคซีลแลนท์ BRAVO 430 กรัม สีขาว (ยกลัง 25 หลอด)',
    brand: 'BRAVO',
    series: 'Bravo Acrylic Sealant',
    modelCode: 'BRAVO-700',
    grade: 'เกรดช่างติดตั้ง',
    originalPrice: 35.00,
    price: 35.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'น้ำยาแอร์&เคมีภัณฑ์',
    badge: 'ยกลังถูกกว่า',
    stock: 500,
    imageUrl: createSvgDataUrl('sealant', 'BRAVO-700', 'อะคริลิค BRAVO', '#F1F5F9', 'BRAVO'),
    description: 'แด๊ป / อะคริลิคซีลแลนท์ BRAVO สีขาว อุดรอยต่อราง ยึดเกาะแน่น ยกลัง 25 หลอด เพียง 800 บาท (ตกหลอดละ 32 บาท)',
    dimensions: '430 กรัม / หลอด',
    material: 'Acrylic Polymer Water-Based',
    unit: 'หลอด',
    boxQty: 25,
    boxPrice: 800.00,
    bulkUnitPrice: 32.00,
    isDailyEssential: true
  },
  {
    id: 'huaguang-braze-flat',
    name: 'ลวดเชื่อมทองแดง HUAGUANG แบบแบน (ห่อ 63 เส้น) (ยกลัง 12 ห่อ)',
    brand: 'อื่นๆ',
    series: 'Huaguang Copper Rods',
    modelCode: 'HUAGUANG BRAZING FLAT',
    grade: 'เชื่อมติดง่าย ไหลดี',
    price: 14.00,
    size: 'ทั้งหมด',
    color: 'ดำ',
    category: 'น้ำยาแอร์&เคมีภัณฑ์',
    badge: 'BEST SELLER',
    stock: 400,
    imageUrl: createSvgDataUrl('sealant', 'HG-FLAT', 'ลวดเชื่อมแบน', '#D97706', 'HUAGUANG'),
    description: 'ลวดเชื่อมทองแดงชนิดแบน HUAGUANG เชื่อมรอยต่อท่อทองแดงแน่นหนา ไม่รั่วซึม เส้นละ 14 บาท ยกลัง 756 บาท',
    dimensions: 'ความยาวมาตรฐาน 50 ซม.',
    material: 'Phosphor Copper Alloy',
    unit: 'เส้น',
    boxQty: 63,
    boxPrice: 756.00,
    bulkUnitPrice: 12.00,
    isDailyEssential: true
  },

  // ========================================================
  // 8. ขายาง, ขาแขวน & อุปกรณ์ประกอบ (BRACKETS)
  // ========================================================
  {
    id: 'cmetal-cdu50',
    name: 'ขาแขวนคอยล์ร้อนติดผนัง C-METAL 50 ซม. หนาพิเศษ (ยกลัง 10 ชุด)',
    brand: 'C-METAL',
    series: 'C-Metal Wall Bracket',
    modelCode: 'C-METAL CDU-50',
    grade: 'เหล็กหนาพิเศษ อบสีพาวเดอร์โค้ท',
    price: 105.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'ขายาง&ขาแขวน',
    badge: 'BEST SELLER',
    stock: 180,
    imageUrl: createSvgDataUrl('bracket', 'CDU-50', 'ขาแขวน 50cm', '#94A3B8', 'C-METAL'),
    description: 'ขาแขวนคอนเดนซิ่งแอร์ C-METAL ขนาด 50 ซม. พ่นสีอบทนสนิม ยกลัง 10 ชุด 1,000 บาท (ตกชุดละ 100 บาท)',
    dimensions: 'ยาว 50 ซม. รับน้ำหนักได้ 120 กก.',
    material: 'Heavy Gauge Steel Powder Coated',
    unit: 'ชุด',
    boxQty: 10,
    boxPrice: 1000.00,
    bulkUnitPrice: 100.00,
    isDailyEssential: true
  },
  {
    id: 'khayang-3in',
    name: 'ขายางรองคอยล์ร้อน สูง 3 นิ้ว (ชุด 4 ชิ้น) (ยกลัง 35 ชุด)',
    brand: 'อื่นๆ',
    series: 'Rubber Dampers',
    modelCode: 'KHAYANG 3',
    grade: 'ซับแรงสั่นสะเทือน เสียงเงียบ',
    price: 29.00,
    size: 'ทั้งหมด',
    color: 'ดำ',
    category: 'ขายาง&ขาแขวน',
    badge: 'BEST SELLER',
    stock: 300,
    imageUrl: createSvgDataUrl('bracket', 'KY-3', 'ขายาง 3 นิ้ว', '#1E293B', 'KHAYANG'),
    description: 'ขายางรองขาคอยล์ร้อนสูง 3 นิ้ว ลดเสียงและแรงสั่นสะเทือน ยกลัง 35 ชุด เหลือชุดละ 25 บาท!',
    dimensions: 'สูง 3 นิ้ว (บรรจุชุดละ 4 ชิ้น)',
    material: 'Heavy Duty Vulcanized Rubber',
    unit: 'ชุด',
    boxQty: 35,
    boxPrice: 875.00,
    bulkUnitPrice: 25.00,
    isDailyEssential: true
  },

  // ========================================================
  // 9. เครื่องมือช่าง (TOOLS - VALUE, GIANT KINGKONG, NANO)
  // ========================================================
  {
    id: 'value-vbt3',
    name: 'เบนเดอร์ดัดท่อทองแดง VALUE ขนาด 5/8" รุ่น VBT-3',
    brand: 'VALUE',
    series: 'VALUE Professional Tools',
    modelCode: 'VALUE VBT-3',
    grade: 'เกรดพรีเมียม ดัดท่อไม่ลีบ',
    price: 1212.00,
    size: '5/8"',
    color: 'ขาว',
    category: 'เครื่องมือช่าง',
    badge: 'IN STOCK',
    stock: 25,
    imageUrl: createSvgDataUrl('tools', 'VBT-3', 'เบนเดอร์ 5/8"', '#0284C7', 'VALUE'),
    description: 'เครื่องมือดัดท่อทองแดงดัดแป๊บ VALUE รุ่น VBT-3 ขนาด 5/8" ดัดลื่น ไม่ทำให้ท่อลีบหรือบิดตัว',
    dimensions: 'สำหรับท่อทองแดง 5/8 นิ้ว',
    material: 'Forged Steel & Aluminum Alloy',
    unit: 'ตัว',
    boxQty: 1
  },
  {
    id: 'value-vtc70',
    name: 'คัตเตอร์ตัดแป๊บท่อทองแดง VALUE 1/4" - 2-5/8" รุ่น VTC-70',
    brand: 'VALUE',
    series: 'VALUE Tube Cutter',
    modelCode: 'VALUE VTC-70',
    grade: 'ใบมีดคมกริบ ไร้คมเสี้ยน',
    price: 937.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'เครื่องมือช่าง',
    badge: 'BEST SELLER',
    stock: 45,
    imageUrl: createSvgDataUrl('tools', 'VTC-70', 'คัตเตอร์ตัดท่อ', '#0284C7', 'VALUE'),
    description: 'คัตเตอร์ตัดท่อทองแดง VALUE รุ่น VTC-70 ตัดท่อได้กว้างตั้งแต่ 1/4 ถึง 2-5/8 นิ้ว หมุนลื่น ตัดขาดคมกริบ',
    dimensions: 'ระยะตัด 1/4" - 2-5/8" (6-67mm)',
    material: 'Alloy Steel Cutting Wheel',
    unit: 'ตัว',
    boxQty: 1,
    isDailyEssential: true
  },
  {
    id: 'ccs-breaker-20a',
    name: 'เซฟตี้เบรกเกอร์ MCCB CCS ขนาด 20A (ยกลัง 200 อัน)',
    brand: 'อื่นๆ',
    series: 'CCS Breaker',
    modelCode: 'CCS CM6-32 20A',
    grade: '220V มอก.',
    price: 41.00,
    size: 'ทั้งหมด',
    color: 'ขาว',
    category: 'สายไฟ&เบรกเกอร์',
    badge: 'ยกลังถูกกว่า',
    stock: 500,
    imageUrl: createSvgDataUrl('breaker', 'CCS-20A', 'เบรกเกอร์ 20A', '#334155', 'CCS'),
    description: 'เซฟตี้เบรกเกอร์ CCS 20A ป้องกันกระแสไฟเกินและไฟฟ้าลัดวงจร ยกลัง 200 อัน 7,200 บาท (ชิ้นละ 36 บาท)',
    dimensions: 'ขนาดมาตรฐาน 2P 20A',
    material: 'Flame Retardant Housing',
    unit: 'อัน',
    boxQty: 200,
    boxPrice: 7200.00,
    bulkUnitPrice: 36.00,
    isDailyEssential: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8841',
    date: '01 ส.ค. 2026, 14:30 น.',
    items: [
      { productName: 'ท่อทองแดง KMCT แบบม้วน 1/4" x 0.71 mm', modelCode: 'KMCT 1/4x0.71', qty: 2, price: 885.00 },
      { productName: 'รางครอบท่อแอร์ HARU ขนาด 75 มิล', modelCode: 'HARU SD-75', qty: 10, price: 53.00 },
      { productName: 'ฉนวนยางดำ AEROFLEX หนา 1/2" รุ่น 1214', modelCode: 'AEROFLEX 1214', qty: 10, price: 40.00 }
    ],
    totalAmount: 2700.00,
    status: 'กำลังจัดส่ง',
    trackingNo: 'TH01928493821',
    shippingAddress: 'โครงการ เดอะปาล์ม เรสซิเดนซ์ อาคาร A ชั้น 3 ถนนสุขุมวิท 71 แขวงคลองตันเหนือ เขตวัฒนา กทม. 10110'
  },
  {
    id: 'ORD-2026-7730',
    date: '28 ก.ค. 2026, 09:15 น.',
    items: [
      { productName: 'ท่อแอร์ชุดสำเร็จรูป DAIKIN 3/8 + 1/4"', modelCode: 'RA-CN', qty: 2, price: 989.00 },
      { productName: 'น้ำยาแอร์ R-32 บรรจุถัง 3 กิโลกรัม', modelCode: 'R-32 3KG', qty: 1, price: 1208.00 }
    ],
    totalAmount: 3186.00,
    status: 'สำเร็จ',
    trackingNo: 'TH08372645100',
    shippingAddress: 'ร้านเย็นสบายการช่าง 45/12 ถนนบางนา-ตราด กม.5 อ.บางพลี จ.สมุทรปราการ 10540'
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'สมชาย ชัยเจริญ (ช่างโอดแอร์)',
  companyName: 'สมชายเครื่องเย็น & HVAC คอนแทรคติ้ง',
  taxId: '0105562098172',
  phone: '081-987-6543',
  email: 'somchai.hvac@gmail.com',
  address: '88/9 หมู่ 4 ต.บางกระสอ อ.เมือง จ.นนทบุรี 11000',
  tier: 'ช่าง VIP (ส่วนลด 5%)'
};

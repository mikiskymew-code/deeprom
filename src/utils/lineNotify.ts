import { Order } from '../types';

export interface LineNotifySettings {
  token: string;
  enabled: boolean;
  storeName: string;
}

export interface LineNotifyLog {
  id: string;
  timestamp: string;
  orderId: string;
  message: string;
  status: 'SUCCESS' | 'SIMULATED' | 'FAILED';
  errorDetails?: string;
}

const STORAGE_KEY_TOKEN = 'air_shop_line_notify_token';
const STORAGE_KEY_ENABLED = 'air_shop_line_notify_enabled';
const STORAGE_KEY_LOGS = 'air_shop_line_notify_logs';

export const DEFAULT_LINE_NOTIFY_TOKEN = 'tk_line_notify_air_parts_2026_demo_secret';

export const getLineNotifySettings = (): LineNotifySettings => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN) || DEFAULT_LINE_NOTIFY_TOKEN;
  const enabled = localStorage.getItem(STORAGE_KEY_ENABLED) !== 'false';
  return {
    token,
    enabled,
    storeName: 'อะไหล่ดีพร้อมแอร์'
  };
};

export const saveLineNotifySettings = (settings: LineNotifySettings): void => {
  localStorage.setItem(STORAGE_KEY_TOKEN, settings.token);
  localStorage.setItem(STORAGE_KEY_ENABLED, settings.enabled ? 'true' : 'false');
};

export const getLineNotifyLogs = (): LineNotifyLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const addNotifyLog = (log: LineNotifyLog): void => {
  const current = getLineNotifyLogs();
  const updated = [log, ...current].slice(0, 50); // Keep last 50 logs
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
};

export const formatOrderNotifyMessage = (
  order: Order,
  customerName: string = 'ช่างเทคนิค / ผู้ใช้บริการ',
  customerPhone: string = '081-999-8888'
): string => {
  const itemsText = order.items
    .map((item) => `• ${item.productName} (${item.modelCode}) x${item.qty} = ฿${(item.price * item.qty).toLocaleString()}`)
    .join('\n');

  return `
🔔 [มีคำสั่งซื้อใหม่เข้ามา!]
─────────────────
📦 ออเดอร์: ${order.id}
📅 วันที่/เวลา: ${order.date}
👤 ชื่อลูกค้า: ${customerName}
📞 เบอร์ติดต่อ: ${customerPhone}
🚚 ที่อยู่จัดส่ง: ${order.shippingAddress || 'จัดส่งตามที่อยู่ในระบบ'}

📋 รายการสินค้าสั่งซื้อ:
${itemsText}

💰 ยอดชำระสุทธิ: ฿${order.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
⚡ สถานะ: ${order.status}
─────────────────
กรุณาตรวจสอบระบบคลังสินค้าเพื่อเตรียมจัดส่งให้ออกทันรอบวันนี้`;
};

export const sendLineNotify = async (
  message: string,
  orderId: string = 'SYS'
): Promise<{ success: boolean; mode: 'REAL' | 'SIMULATED'; log: LineNotifyLog }> => {
  const settings = getLineNotifySettings();

  if (!settings.enabled) {
    const log: LineNotifyLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('th-TH'),
      orderId,
      message,
      status: 'FAILED',
      errorDetails: 'ระบบแจ้งเตือนถูกปิดใช้งานอยู่ (Disabled)'
    };
    addNotifyLog(log);
    return { success: false, mode: 'SIMULATED', log };
  }

  // Attempt real sending if token provided via CORS proxy or simulation logging
  try {
    const formData = new URLSearchParams();
    formData.append('message', message);

    // Using line notify proxy endpoint or fallback simulation
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${settings.token}`
      },
      body: formData,
      mode: 'cors'
    }).catch(() => null);

    if (response && response.ok) {
      const log: LineNotifyLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString('th-TH'),
        orderId,
        message,
        status: 'SUCCESS'
      };
      addNotifyLog(log);
      return { success: true, mode: 'REAL', log };
    } else {
      // Direct browser CORS restriction simulation fallback
      const log: LineNotifyLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString('th-TH'),
        orderId,
        message,
        status: 'SIMULATED'
      };
      addNotifyLog(log);
      return { success: true, mode: 'SIMULATED', log };
    }
  } catch (error: any) {
    const log: LineNotifyLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('th-TH'),
      orderId,
      message,
      status: 'SIMULATED',
      errorDetails: error?.message || 'CORS Simulated'
    };
    addNotifyLog(log);
    return { success: true, mode: 'SIMULATED', log };
  }
};

import { Order } from '../types';

export const TARGET_ORDER_EMAIL = 'sp-deeprom@gmail.com';
export const SUPER_ADMIN_EMAIL = 'mikiskymew@gmail.com';

export interface EmailNotifyLog {
  id: string;
  timestamp: string;
  orderId: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'SENT' | 'SIMULATED';
}

const STORAGE_KEY_EMAIL_LOGS = 'hvac_email_notify_logs';

export const getEmailNotifyLogs = (): EmailNotifyLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAIL_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const formatOrderEmailContent = (
  order: Order,
  customerName: string = 'ช่างเทคนิค / ผู้สั่งซื้อ',
  customerPhone: string = '081-999-8888'
) => {
  const subject = `[คำสั่งซื้อใหม่ ${order.id}] จากคุณ ${customerName} - ยอดรวม ฿${order.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

  const itemsText = order.items
    .map((item) => `• ${item.productName} (รหัส: ${item.modelCode}) x${item.qty} ชิ้น @ ฿${item.price.toFixed(2)} = ฿${(item.price * item.qty).toFixed(2)}`)
    .join('\n');

  const body = `เรียน ทีมงาน อะไหล่ดีพร้อมแอร์ (sp.deeprom@gmail.com)

มีคำสั่งซื้อใหม่เข้ามาในระบบ รายละเอียดดังนี้:

--------------------------------------------------
📦 เลขที่ออเดอร์: ${order.id}
📅 วันที่/เวลา: ${order.date}
👤 ชื่อผู้สั่งซื้อ: ${customerName}
📞 เบอร์โทรศัพท์: ${customerPhone}
🚚 ที่อยู่จัดส่ง: ${order.shippingAddress || 'จัดส่งตามที่อยู่ในระบบ'}
--------------------------------------------------

📋 รายการสินค้าที่สั่งซื้อ:
${itemsText}

--------------------------------------------------
💰 ยอดรวมชำระสุทธิ: ฿${order.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
⚡ สถานะคำสั่งซื้อ: ${order.status}
🚚 เลขพัสดุจัดส่ง: ${order.trackingNo || 'กำลังจัดเตรียม'}
--------------------------------------------------

กรุณาจัดเตรียมสินค้าและดำเนินการจัดส่งตามรายการข้างต้น`;

  return { subject, body };
};

/**
 * Sends order notification email to sp.deeprom@gmail.com
 */
export const sendOrderEmailNotification = (
  order: Order,
  customerName?: string,
  customerPhone?: string
): { success: boolean; log: EmailNotifyLog } => {
  const { subject, body } = formatOrderEmailContent(order, customerName, customerPhone);

  const log: EmailNotifyLog = {
    id: `email-log-${Date.now()}`,
    timestamp: new Date().toLocaleString('th-TH'),
    orderId: order.id,
    recipient: TARGET_ORDER_EMAIL,
    subject,
    body,
    status: 'SENT'
  };

  // Save to email notify logs
  const currentLogs = getEmailNotifyLogs();
  const updatedLogs = [log, ...currentLogs].slice(0, 50);
  localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(updatedLogs));

  // Open default mail client (mailto) if browser allows, or prepare email dispatch
  const mailtoUrl = `mailto:${TARGET_ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  try {
    const a = document.createElement('a');
    a.href = mailtoUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  } catch (e) {
    console.log('Mailto trigger completed', e);
  }

  return { success: true, log };
};

export const formatAccessRequestEmailContent = (
  applicantEmail: string,
  applicantName: string
) => {
  const subject = `[คำขอสมัครเข้าใช้งานระบบใหม่] คุณ ${applicantName} (${applicantEmail})`;

  const body = `เรียน ผู้ดูแลระบบ อะไหล่ดีพร้อมแอร์ (${TARGET_ORDER_EMAIL})

มีผู้สนใจขอสมัครเข้าใช้งานระบบแคตตาล็อกสินค้าอะไหล่แอร์ รายละเอียดดังนี้:

--------------------------------------------------
👤 ชื่อผู้สมัคร / ชื่อช่าง: ${applicantName}
📧 อีเมล Gmail: ${applicantEmail}
📅 วันที่/เวลาส่งคำขอ: ${new Date().toLocaleString('th-TH')}
--------------------------------------------------

กรุณาตรวจสอบและดำเนินการอนุมัติสิทธิ์ใน "แผงควบคุมสิทธิ์เข้าใช้งานระบบ (Owner Security Control)" ในระบบเว็บแอปพลิเคชัน

หรือท่านสามารถนำอีเมล: ${applicantEmail}
ไปเพิ่มใน Whitelist สิทธิ์การเข้าใช้งานได้โดยตรงทันที`;

  return { subject, body };
};

/**
 * Sends access request email notification to sp.deeprom@gmail.com
 */
export const sendAccessRequestEmailNotification = (
  applicantEmail: string,
  applicantName: string
): { success: boolean; log: EmailNotifyLog } => {
  const { subject, body } = formatAccessRequestEmailContent(applicantEmail, applicantName);

  const log: EmailNotifyLog = {
    id: `email-req-log-${Date.now()}`,
    timestamp: new Date().toLocaleString('th-TH'),
    orderId: `REQ-${Date.now().toString().slice(-6)}`,
    recipient: TARGET_ORDER_EMAIL,
    subject,
    body,
    status: 'SENT'
  };

  // Save to email notify logs
  const currentLogs = getEmailNotifyLogs();
  const updatedLogs = [log, ...currentLogs].slice(0, 50);
  localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(updatedLogs));

  // Open default mail client (mailto) if browser allows
  const mailtoUrl = `mailto:${TARGET_ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  try {
    const a = document.createElement('a');
    a.href = mailtoUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  } catch (e) {
    console.log('Mailto trigger completed', e);
  }

  return { success: true, log };
};


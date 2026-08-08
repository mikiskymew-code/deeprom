import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, CartItem, FilterState, TabType, Order, UserProfile, AuthUser, AccessRequest, UserRole } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USER } from './data/products';
import { LayoutGrid, List, CheckCircle, BellRing, KeyRound } from 'lucide-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { NotifyModal } from './components/NotifyModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FilterDrawer } from './components/FilterDrawer';
import { HomeView } from './components/HomeView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { DailyEssentialsView } from './components/DailyEssentialsView';
import { DataImporterModal } from './components/DataImporterModal';
import { GmailAuthModal } from './components/GmailAuthModal';
import { AccessManagementModal } from './components/AccessManagementModal';
import { EditProductModal } from './components/EditProductModal';
import { AccessDeniedView } from './components/AccessDeniedView';
import { DailySalesReportModal } from './components/DailySalesReportModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { AdminPinModal } from './components/AdminPinModal';
import { sendOrderEmailNotification, sendAccessRequestEmailNotification, TARGET_ORDER_EMAIL } from './utils/emailNotify';
import {
  subscribeProducts,
  saveProductToFirestore,
  saveAllProductsToFirestore,
  deleteProductFromFirestore,
  subscribeAllowedEmails,
  saveAllowedEmailsToFirestore,
  subscribeAccessRequests,
  addAccessRequestToFirestore,
  updateAccessRequestStatusInFirestore,
  subscribeOrders,
  saveOrderToFirestore,
  subscribeSecurityPin
} from './utils/firebaseStore';

const SUPER_OWNER_EMAIL = 'mikiskymew@gmail.com';
const ADMIN_EMAILS = ['sp-deeprom@gmail.com', 'sp.deeprom@gmail.com', 'mikiskymew@gmail.com'];
const OWNER_EMAIL = 'mikiskymew@gmail.com';

const isSuperOwnerEmail = (email: string) => {
  if (!email) return false;
  return email.toLowerCase().trim() === SUPER_OWNER_EMAIL.toLowerCase();
};

const isAdminEmail = (email: string) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.some((a) => a.toLowerCase() === clean);
};

// BroadcastChannel for instant local tab sync
const dbSyncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('hvac_realtime_db_channel')
  : null;

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [orderToastMsg, setOrderToastMsg] = useState<string | null>(null);

  // Helper to trigger broadcast sync
  const notifyDatabaseChange = () => {
    if (dbSyncChannel) {
      try { dbSyncChannel.postMessage('sync'); } catch (e) { /* ignore */ }
    }
  };

  // Data States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hvac_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('hvac_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return { 'p1': 1 };
  });

  useEffect(() => {
    localStorage.setItem('hvac_cart', JSON.stringify(cart));
    notifyDatabaseChange();
  }, [cart]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hvac_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_ORDERS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hvac_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem('hvac_user_profile', JSON.stringify(user));
    notifyDatabaseChange();
  }, [user]);

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hvac_favorite_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return ['p1', 'p2', 'p5'];
  });

  useEffect(() => {
    localStorage.setItem('hvac_favorite_ids', JSON.stringify(favoriteIds));
    notifyDatabaseChange();
  }, [favoriteIds]);

  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Allowed Emails
  const [allowedEmails, setAllowedEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('hvac_allowed_emails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 0) {
          return [...new Set([...parsed, SUPER_OWNER_EMAIL, ...ADMIN_EMAILS, 'somchai.hvac@gmail.com'])];
        }
      } catch (e) { /* fallback */ }
    }
    return [SUPER_OWNER_EMAIL, ...ADMIN_EMAILS, 'somchai.hvac@gmail.com'];
  });

  // Access Requests
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const prevPendingCountRef = useRef<number>(0);

  // Security PIN state
  const [securityPin, setSecurityPin] = useState<string>('8888');

  // Pending Admin Login Challenge State (for PIN verification)
  const [pendingAdminAuth, setPendingAdminAuth] = useState<{
    email: string;
    name: string;
    roleName: string;
  } | null>(null);

  // Realtime Firestore Subscriptions
  useEffect(() => {
    const unsubProducts = subscribeProducts((remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setProducts(remoteProds);
        localStorage.setItem('hvac_products', JSON.stringify(remoteProds));
      }
    });

    const unsubAllowed = subscribeAllowedEmails((remoteEmails) => {
      if (remoteEmails && remoteEmails.length > 0) {
        const merged = [...new Set([...remoteEmails, SUPER_OWNER_EMAIL, ...ADMIN_EMAILS])];
        setAllowedEmails(merged);
        localStorage.setItem('hvac_allowed_emails', JSON.stringify(merged));
      }
    });

    const unsubRequests = subscribeAccessRequests((remoteReqs) => {
      setAccessRequests(remoteReqs);
      localStorage.setItem('hvac_access_requests', JSON.stringify(remoteReqs));

      const pending = remoteReqs.filter((r) => r.status === 'PENDING');
      if (pending.length > prevPendingCountRef.current && prevPendingCountRef.current !== 0) {
        const newest = pending[0];
        setOrderToastMsg(`🔔 มีคำขออนุมัติใหม่จากคุณ ${newest?.name || 'ช่างใหม่'} (${newest?.email})!`);
      }
      prevPendingCountRef.current = pending.length;
    });

    const unsubOrders = subscribeOrders((remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
        localStorage.setItem('hvac_orders', JSON.stringify(remoteOrders));
      }
    });

    const unsubPin = subscribeSecurityPin((pin) => {
      setSecurityPin(pin);
    });

    return () => {
      unsubProducts();
      unsubAllowed();
      unsubRequests();
      unsubOrders();
      unsubPin();
    };
  }, []);

  // Current logged in Gmail user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('hvac_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null;
  });

  // Security Auth Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccessManagementOpen, setIsAccessManagementOpen] = useState(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);

  // Sync Current User & Role Check
  useEffect(() => {
    if (currentUser) {
      let currentRole: UserRole = 'PENDING';
      const cleanUserEmail = currentUser.email.toLowerCase().trim();

      if (isSuperOwnerEmail(cleanUserEmail)) {
        currentRole = 'OWNER';
      } else if (isAdminEmail(cleanUserEmail)) {
        currentRole = 'ADMIN';
      } else if (allowedEmails.some((e) => e.toLowerCase().trim() === cleanUserEmail)) {
        currentRole = 'AUTHORIZED';
      } else {
        const req = accessRequests.find((r) => r.email.toLowerCase().trim() === cleanUserEmail);
        if (req && req.status === 'REJECTED') {
          currentRole = 'REJECTED';
        } else {
          currentRole = 'PENDING';
        }
      }

      if (currentUser.role !== currentRole) {
        const updatedUser = { ...currentUser, role: currentRole };
        setCurrentUser(updatedUser);
        localStorage.setItem('hvac_current_user', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('hvac_current_user', JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem('hvac_current_user');
    }
  }, [currentUser, allowedEmails, accessRequests]);

  // Handle Login Request - If Super Owner or Admin, prompt PIN Verification
  const handleLogin = (email: string, name?: string) => {
    const cleanEmail = email.toLowerCase().trim();

    if (isSuperOwnerEmail(cleanEmail) || isAdminEmail(cleanEmail)) {
      // Trigger PIN Modal Protection!
      setPendingAdminAuth({
        email: cleanEmail,
        name: name || (isSuperOwnerEmail(cleanEmail) ? 'เจ้าของระบบ' : 'แอดมินดีพร้อม'),
        roleName: isSuperOwnerEmail(cleanEmail) ? 'SUPER OWNER' : 'ADMIN'
      });
      return;
    }

    // Regular User direct check against Firestore Allowed List
    let role: UserRole = 'PENDING';
    if (allowedEmails.some((e) => e.toLowerCase().trim() === cleanEmail)) {
      role = 'AUTHORIZED';
    }

    const newUser: AuthUser = {
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      role
    };

    setCurrentUser(newUser);
    setUser((prev) => ({
      ...prev,
      email: cleanEmail,
      name: name || prev.name
    }));

    if (role === 'AUTHORIZED') {
      setOrderToastMsg(`ยินดีต้อนรับคุณ ${newUser.name} เข้าสู่ระบบดีพร้อมแอร์`);
      setTimeout(() => setOrderToastMsg(null), 4000);
    }
  };

  // Confirm Admin PIN Verification
  const handleConfirmAdminPinSuccess = () => {
    if (!pendingAdminAuth) return;

    const role: UserRole = isSuperOwnerEmail(pendingAdminAuth.email) ? 'OWNER' : 'ADMIN';
    const newUser: AuthUser = {
      email: pendingAdminAuth.email,
      name: pendingAdminAuth.name,
      role
    };

    setCurrentUser(newUser);
    setUser((prev) => ({
      ...prev,
      email: pendingAdminAuth.email,
      name: pendingAdminAuth.name
    }));

    setOrderToastMsg(`🔐 ปลดล็อกรหัสความปลอดภัยสำเร็จ! เข้าใช้งานเป็น ${pendingAdminAuth.roleName}`);
    setTimeout(() => setOrderToastMsg(null), 5000);

    setPendingAdminAuth(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Owner Approve Access Request
  const handleApproveRequest = async (requestId: string) => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (req) {
      const cleanEmail = req.email.toLowerCase().trim();
      const updatedAllowed = [...new Set([...allowedEmails, cleanEmail])];
      setAllowedEmails(updatedAllowed);
      
      // Update Firestore
      await updateAccessRequestStatusInFirestore(requestId, 'APPROVED');
      await saveAllowedEmailsToFirestore(updatedAllowed);

      setOrderToastMsg(`✅ อนุมัติสิทธิ์ให้คุณ "${req.name}" (${cleanEmail}) เรียบร้อยแล้ว (ซิงค์ทุกอุปกรณ์)`);
      setTimeout(() => setOrderToastMsg(null), 6000);
    }
  };

  // Owner Reject Access Request
  const handleRejectRequest = async (requestId: string) => {
    await updateAccessRequestStatusInFirestore(requestId, 'REJECTED');
  };

  // Owner Add Allowed Email Directly
  const handleAddAllowedEmail = async (email: string) => {
    const clean = email.toLowerCase().trim();
    if (!clean || !clean.includes('@')) return;

    const updatedAllowed = [...new Set([...allowedEmails, clean])];
    setAllowedEmails(updatedAllowed);
    await saveAllowedEmailsToFirestore(updatedAllowed);

    // Also approve pending request if matching
    const matchingReq = accessRequests.find((r) => r.email.toLowerCase().trim() === clean);
    if (matchingReq) {
      await updateAccessRequestStatusInFirestore(matchingReq.id, 'APPROVED');
    }

    setOrderToastMsg(`เพิ่มอีเมล ${clean} เข้าสู่ระบบ Whitelist เรียบร้อยแล้ว`);
    setTimeout(() => setOrderToastMsg(null), 5000);
  };

  // Owner Remove Allowed Email
  const handleRemoveAllowedEmail = async (email: string) => {
    const clean = email.toLowerCase().trim();
    const updatedAllowed = allowedEmails.filter((e) => e.toLowerCase().trim() !== clean);
    setAllowedEmails(updatedAllowed);
    await saveAllowedEmailsToFirestore(updatedAllowed);

    setOrderToastMsg(`ยกเลิกสิทธิ์การเข้าใช้งานของอีเมล ${clean} เรียบร้อยแล้ว`);
    setTimeout(() => setOrderToastMsg(null), 4000);
  };

  // User Request Access
  const handleRequestAccess = async (email: string, name: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name || cleanEmail.split('@')[0];

    const newReq: AccessRequest = {
      id: `req-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      requestedAt: new Date().toLocaleString('th-TH'),
      status: 'PENDING'
    };

    // Save to Firestore
    await addAccessRequestToFirestore(newReq);

    // Trigger Email Notification targeting sp.deeprom@gmail.com
    sendAccessRequestEmailNotification(cleanEmail, cleanName);

    setOrderToastMsg(`ยื่นคำขออนุมัติของ ${cleanEmail} ถึงผู้ดูแลระบบเรียบร้อยแล้ว รอการอนุมัติ`);
    setTimeout(() => setOrderToastMsg(null), 7000);
  };

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

  // Handle Save or Create Product (Syncs to Firestore)
  const handleSaveProduct = async (updatedProduct: Product) => {
    const updatedList = products.some((p) => p.id === updatedProduct.id)
      ? products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      : [updatedProduct, ...products];

    setProducts(updatedList);
    await saveProductToFirestore(updatedProduct);

    setOrderToastMsg(`บันทึกข้อมูลสินค้า ${updatedProduct.name} ลงสู่ฐานข้อมูลเรียบร้อยแล้ว`);
    setTimeout(() => setOrderToastMsg(null), 4000);
  };

  // Handle Import Multiple Excel Products (Syncs to Firestore)
  const handleImportProducts = async (newProducts: Product[]) => {
    const combined = [...newProducts, ...products];
    setProducts(combined);
    await saveAllProductsToFirestore(combined);

    setOrderToastMsg(`นำเข้าสินค้าใหม่จำนวน ${newProducts.length} รายการ จาก Excel สู่ระบบเรียบร้อยแล้ว (ซิงค์มือถือแล็ปท็อป)`);
    setTimeout(() => setOrderToastMsg(null), 6000);
  };

  // Handle Delete Single Product
  const handleDeleteProduct = async (productId: string) => {
    const filtered = products.filter((p) => p.id !== productId);
    setProducts(filtered);
    await deleteProductFromFirestore(productId);
  };

  // Handle Clear All Products
  const handleDeleteAllProducts = async () => {
    setProducts([]);
    await saveAllProductsToFirestore([]);
  };

  // Handle Reset Default Products
  const handleResetDefaultProducts = async () => {
    if (window.confirm('คุณต้องการรีเซ็ตคืนค่าสินค้าเป็นชุดเริ่มต้นใช่หรือไม่?')) {
      setProducts(INITIAL_PRODUCTS);
      await saveAllProductsToFirestore(INITIAL_PRODUCTS);
    }
  };

  // Quick Filter Pill State
  const [activeFilterPill, setActiveFilterPill] = useState<string>('all');
  
  // View Mode State ('grid' or 'list')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search and Advanced Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    size: 'ทั้งหมด',
    category: 'ทั้งหมด',
    color: 'ทั้งหมด',
    searchQuery: '',
    inStockOnly: false,
    sortBy: 'popular'
  });

  // Modal & Drawer Trigger States
  const [selectedNotifyProduct, setSelectedNotifyProduct] = useState<Product | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);

  // Quantity handler
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // Convert cart state map to array
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .filter((entry): entry is [string, number] => (entry[1] as number) > 0)
      .map(([id, quantity]) => {
        const product = products.find((p) => p.id === id)!;
        return { product, quantity };
      })
      .filter((item) => item.product !== undefined);
  }, [cart, products]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Handle Quick Filter Pill clicks
  const handleSelectFilterPill = (pillId: string) => {
    setActiveFilterPill(pillId);
    if (pillId === 'all') {
      setFilters((prev) => ({ ...prev, size: 'ทั้งหมด', category: 'ทั้งหมด', color: 'ทั้งหมด' }));
    } else if (pillId === '75mm') {
      setFilters((prev) => ({ ...prev, size: '75mm' }));
    } else if (pillId === '100mm') {
      setFilters((prev) => ({ ...prev, size: '100mm' }));
    } else if (pillId === 'white') {
      setFilters((prev) => ({ ...prev, color: 'ขาว' }));
    } else if (pillId === 'elbow') {
      setFilters((prev) => ({ ...prev, category: 'ข้องอ' }));
    } else if (pillId === 'joint') {
      setFilters((prev) => ({ ...prev, category: 'ข้อต่อ' }));
    } else if (pillId === 'wall') {
      setFilters((prev) => ({ ...prev, category: 'ฝาครอบ' }));
    } else if (pillId === 'flex') {
      setFilters((prev) => ({ ...prev, category: 'ท่อยืดหยุ่น' }));
    } else if (pillId === 'cream') {
      setFilters((prev) => ({ ...prev, color: 'ครีม' }));
    } else if (pillId === 'gray') {
      setFilters((prev) => ({ ...prev, color: 'เทา' }));
    }
  };

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesModel = product.modelCode.toLowerCase().includes(q);
        const matchesSeries = product.series.toLowerCase().includes(q);
        if (!matchesName && !matchesModel && !matchesSeries) return false;
      }

      // Brand Filter
      if (filters.brand && filters.brand !== 'ALL' && product.brand !== filters.brand) {
        return false;
      }

      // Size Filter
      if (filters.size !== 'ทั้งหมด' && product.size !== filters.size) {
        return false;
      }

      // Color Filter
      if (filters.color !== 'ทั้งหมด' && product.color !== filters.color) {
        return false;
      }

      // Category Filter
      if (filters.category !== 'ทั้งหมด' && product.category !== filters.category) {
        return false;
      }

      // In Stock Only
      if (filters.inStockOnly && (product.isSoldOut || product.stock <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, filters]);

  // Handle Order Placement with Email Notification to sp.deeprom@gmail.com
  const handlePlaceOrder = async (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('th-TH'),
      items: items.map((i) => ({
        productName: i.product.name,
        modelCode: i.product.modelCode,
        qty: i.quantity,
        price: i.product.price
      })),
      totalAmount: total,
      status: 'ชำระเงินแล้ว',
      trackingNo: `TH${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      shippingAddress: user.address
    };

    setOrders((prev) => [newOrder, ...prev]);
    await saveOrderToFirestore(newOrder);

    // Trigger Email Notification targeting sp.deeprom@gmail.com
    sendOrderEmailNotification(newOrder, user.name, user.phone);

    // Show Toast Confirmation
    setOrderToastMsg(`ส่งข้อมูลคำสั่งซื้อ ${newOrder.id} ไปยังระบบเรียบร้อยแล้ว`);
    setTimeout(() => {
      setOrderToastMsg(null);
    }, 6000);
  };

  // Security Authorization Check:
  const isUserAuthorized = currentUser && (
    currentUser.role === 'OWNER' ||
    currentUser.role === 'ADMIN' ||
    currentUser.role === 'AUTHORIZED'
  );
  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#191C1E] font-sans antialiased flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* App Main Shell */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col pb-28">
        {/* Header is always visible so user can see security status and Gmail login */}
        <Header
          totalItems={filteredProducts.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          currentCategoryName={filters.brand && filters.brand !== 'ALL' ? `ยี่ห้อ ${filters.brand}` : "อุปกรณ์แอร์"}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAccessManagement={() => setIsAccessManagementOpen(true)}
          pendingRequestsCount={pendingRequestsCount}
          onOpenImporterModal={() => setIsImporterOpen(true)}
          onOpenSalesReportModal={() => setIsSalesReportOpen(true)}
          onOpenGoogleDriveModal={() => setIsGoogleDriveOpen(true)}
          onLogout={handleLogout}
        />

        {/* Realtime Order/Request Toast Banner */}
        {orderToastMsg && (
          <div 
            onClick={() => {
              if (orderToastMsg.includes('คำขออนุมัติ') && (currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN')) {
                setIsAccessManagementOpen(true);
              }
            }}
            className="mx-4 mt-3 bg-[#18181B] text-white p-3.5 rounded-2xl border-2 border-amber-400 shadow-xl flex items-center justify-between cursor-pointer animate-in slide-in-from-top-3 duration-300"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shrink-0">
                <BellRing className="w-4 h-4 text-black animate-bounce" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-amber-400 truncate">
                  แจ้งเตือนระบบดีพร้อมแอร์
                </p>
                <p className="text-[11px] text-neutral-200 font-medium truncate">
                  {orderToastMsg}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOrderToastMsg(null);
              }}
              className="text-neutral-400 hover:text-white px-2 py-1 text-xs font-bold"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Security Gate Check */}
        {!isUserAuthorized ? (
          <AccessDeniedView
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onRequestAccess={handleRequestAccess}
            onLoginDirect={handleLogin}
            ownerEmail={OWNER_EMAIL}
            hasPendingRequest={
              currentUser
                ? accessRequests.some(
                    (r) => r.email.toLowerCase() === currentUser.email.toLowerCase() && r.status === 'PENDING'
                  )
                : false
            }
          />
        ) : (
          <>
            {activeTab === 'catalog' && (
              <main className="flex-1 flex flex-col">
                {/* Horizontal Filter Pill Bar */}
                <FilterBar
                  activeFilter={activeFilterPill}
                  onSelectFilter={handleSelectFilterPill}
                />

                {/* View Mode & Item Count Bar */}
                <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700 flex items-center space-x-1">
                    <span>สินค้าทั้งหมด</span>
                    <span className="bg-amber-200/80 text-amber-950 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                      {filteredProducts.length} รายการ
                    </span>
                  </span>

                  <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-xl text-neutral-600 font-bold border border-neutral-300/40">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                        viewMode === 'grid'
                          ? 'bg-[#1C1C1E] text-amber-400 shadow-2xs font-extrabold'
                          : 'hover:text-neutral-900'
                      }`}
                      title="มุมมองตาราง (รูปภาพใหญ่เต็มตา)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="text-[11px]">ตาราง</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                        viewMode === 'list'
                          ? 'bg-[#1C1C1E] text-amber-400 shadow-2xs font-extrabold'
                          : 'hover:text-neutral-900'
                      }`}
                      title="มุมมองรายการ (ประหยัดพื้นที่)"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="text-[11px]">รายการ</span>
                    </button>
                  </div>
                </div>

                {/* Product Cards Container (Grid or List Mode) */}
                <div className={`px-4 py-2 flex-1 ${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3' 
                    : 'space-y-2.5'
                }`}>
                  {filteredProducts.length === 0 ? (
                    <div className={`bg-white rounded-2xl p-8 text-center space-y-2 border border-neutral-200/60 my-4 shadow-2xs ${
                      viewMode === 'grid' ? 'col-span-2' : ''
                    }`}>
                      <p className="text-sm font-bold text-neutral-800">ไม่พบอุปกรณ์ที่ตรงกับการค้นหา</p>
                      <p className="text-xs text-neutral-500">ลองเปลี่ยนขนาดหรือหมวดหมู่ตัวกรอง</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          handleSelectFilterPill('all');
                          setFilters({ size: 'ทั้งหมด', category: 'ทั้งหมด', color: 'ทั้งหมด', searchQuery: '', inStockOnly: false, sortBy: 'popular' });
                        }}
                        className="mt-2 bg-[#1C1C1E] text-amber-400 text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        ล้างการค้นหา
                      </button>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart[product.id] || 0}
                        onUpdateQuantity={handleUpdateQuantity}
                        onOpenNotifyModal={setSelectedNotifyProduct}
                        onOpenDetailModal={setSelectedDetailProduct}
                        isFavorite={favoriteIds.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onDeleteProduct={handleDeleteProduct}
                        canManageProduct={currentUser?.role === 'OWNER'}
                        viewMode={viewMode}
                      />
                    ))
                  )}
                </div>
              </main>
            )}

            {activeTab === 'home' && (
              <HomeView
                onNavigateToCatalog={(cat, brand) => {
                  if (brand) {
                    setFilters((prev) => ({ ...prev, brand, category: 'ทั้งหมด' }));
                  } else if (cat) {
                    setFilters((prev) => ({ ...prev, category: cat as any, brand: 'ALL' }));
                  } else {
                    setFilters((prev) => ({ ...prev, category: 'ทั้งหมด', brand: 'ALL' }));
                  }
                  setActiveTab('catalog');
                }}
                featuredProducts={products}
                orders={orders}
                products={products}
                onOpenDetailModal={setSelectedDetailProduct}
                onUpdateQuantity={handleUpdateQuantity}
                cartQuantities={cart}
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'daily' && (
              <main className="flex-1 px-4 py-3">
                <DailyEssentialsView
                  products={products}
                  cartQuantities={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onOpenNotifyModal={setSelectedNotifyProduct}
                  onOpenDetailModal={setSelectedDetailProduct}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectTab={setActiveTab}
                />
              </main>
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                onOpenSalesReportModal={() => setIsSalesReportOpen(true)}
              />
            )}

            {activeTab === 'profile' && <ProfileView user={user} onUpdateUser={setUser} />}
          </>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        favoriteCount={favoriteIds.length}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart({})}
        user={user}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Admin PIN Protection Verification Modal */}
      <AdminPinModal
        isOpen={Boolean(pendingAdminAuth)}
        targetEmail={pendingAdminAuth?.email || ''}
        targetRoleName={pendingAdminAuth?.roleName || ''}
        expectedPin={securityPin}
        onClose={() => setPendingAdminAuth(null)}
        onConfirmSuccess={handleConfirmAdminPinSuccess}
      />

      {/* Stock Notification Signup Modal */}
      <NotifyModal
        product={selectedNotifyProduct}
        onClose={() => setSelectedNotifyProduct(null)}
      />

      {/* Engineering Technical Spec Drawer */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={(p) => handleUpdateQuantity(p.id, 1)}
        isFavorite={selectedDetailProduct ? favoriteIds.includes(selectedDetailProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilters={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        onResetFilters={() => {
          setActiveFilterPill('all');
          setFilters({ size: 'ทั้งหมด', category: 'ทั้งหมด', color: 'ทั้งหมด', searchQuery: '', inStockOnly: false, sortBy: 'popular' });
        }}
      />

      {/* Gmail Auth Login Modal */}
      <GmailAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        ownerEmail={OWNER_EMAIL}
      />

      {/* Owner Access Security Whitelist Management Modal */}
      <AccessManagementModal
        isOpen={isAccessManagementOpen}
        onClose={() => setIsAccessManagementOpen(false)}
        allowedEmails={allowedEmails}
        accessRequests={accessRequests}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onAddAllowedEmail={handleAddAllowedEmail}
        onRemoveAllowedEmail={handleRemoveAllowedEmail}
        products={products}
        onOpenImporterModal={() => setIsImporterOpen(true)}
        onDeleteProduct={handleDeleteProduct}
        onDeleteAllProducts={handleDeleteAllProducts}
        onResetDefaultProducts={handleResetDefaultProducts}
        onEditProduct={(p) => {
          setEditingProduct(p);
          setIsEditProductModalOpen(true);
        }}
        onAddNewProduct={() => {
          setEditingProduct(null);
          setIsEditProductModalOpen(true);
        }}
        currentUser={currentUser}
      />

      {/* Edit or Add Product Modal */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        product={editingProduct}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
      />

      {/* PDF/CSV Data Importer Modal */}
      <DataImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportProducts={handleImportProducts}
      />

      {/* Daily Sales Report & Google Sheets / Excel Export Modal */}
      <DailySalesReportModal
        isOpen={isSalesReportOpen}
        onClose={() => setIsSalesReportOpen(false)}
        orders={orders}
      />

      {/* Google Drive Cloud Integration Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        products={products}
        orders={orders}
        onImportProducts={handleImportProducts}
      />
    </div>
  );
}

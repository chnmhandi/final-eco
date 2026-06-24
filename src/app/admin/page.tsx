"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { api } from "@/utils/api";
import { 
  Shield, Plus, Edit2, Trash2, LogOut, Image as ImageIcon, Loader2, 
  TrendingUp, DollarSign, ShoppingBag, AlertTriangle, Search, Filter, 
  X, Package, ClipboardList, CheckCircle2, Truck, Eye, ArrowUpRight, 
  Lock, Upload, RefreshCw, Layers
} from "lucide-react";

export default function AdminPage() {
  const { isLoggedIn, userRole, login, logout, showToast } = useShop();

  // Authentication Local States
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Administrative Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products">("dashboard");

  // Filter & Search States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // Interaction Modal/Drawer States
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    category: "",
    category_slug: "",
    price: 0,
    original_price: 0,
    stock: 0,
    description: "",
    long_description: "",
    images: [] as string[],
    colors: [] as { name: string; hex: string }[],
    sizes: [] as string[],
    specs: [] as { label: string; value: string }[],
    is_featured: false,
    is_trending: false,
    is_bestseller: false,
    tag: ""
  });

  // Color & Spec Sub-Form Inputs
  const [tempColor, setTempColor] = useState({ name: "", hex: "#000000" });
  const [tempSpec, setTempSpec] = useState({ label: "", value: "" });
  const [isUploading, setIsUploading] = useState(false);

  // Shipment Simulator States
  const [courierName, setCourierName] = useState("DHL Express");
  const [customTracking, setCustomTracking] = useState("");
  const [isShipping, setIsShipping] = useState(false);

  // Fetch admin console data
  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      const ordersData = await api.get<any[]>("/admin/orders");
      const productsData = await api.get<any[]>("/products");
      const categoriesData = await api.get<any[]>("/categories");
      setOrders(ordersData || []);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error: any) {
      showToast(error.message || "Failed to retrieve administration records.", "error");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userRole === "admin") {
      fetchAdminData();
    }
  }, [isLoggedIn, userRole]);

  // Auth Submit Action
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      showToast("Please provide both email and password.", "error");
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(adminEmail, adminPassword);
      showToast("Welcome back, Administrator.", "success");
    } catch (error: any) {
      showToast(error.message || "Authentication rejected.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Orders Management Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}.`, "success");
      
      // Update local state smoothly
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update order status.", "error");
    }
  };

  const handleShipOrder = async (orderId: string) => {
    setIsShipping(true);
    try {
      const tracking = customTracking.trim() || `TRK-${Math.floor(Math.random() * 900000000) + 100000000}`;
      await api.post(`/shipping/orders/${orderId}/shipment`, {
        courier: courierName,
        tracking_number: tracking
      });
      showToast(`Order marked as Shipped via ${courierName}. Tracking: ${tracking}`, "success");
      
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: "Shipped", 
        tracking_number: tracking,
        courier_name: courierName,
        shipping_status: "Shipped"
      } : o));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => prev ? { 
          ...prev, 
          status: "Shipped", 
          tracking_number: tracking,
          courier_name: courierName,
          shipping_status: "Shipped"
        } : null);
      }
      
      setCustomTracking("");
    } catch (error: any) {
      showToast(error.message || "Failed to ship order.", "error");
    } finally {
      setIsShipping(false);
    }
  };

  const handleUpdateShipmentStatus = async (trackingNumber: string, nextStatus: string) => {
    try {
      await api.put(`/shipping/shipments/${trackingNumber}/status`, {
        status: nextStatus
      });
      showToast(`Shipment status transitioned to ${nextStatus}.`, "success");
      
      setOrders(prev => prev.map(o => o.tracking_number === trackingNumber || o.trackingNumber === trackingNumber ? { 
        ...o, 
        status: nextStatus,
        shipping_status: nextStatus
      } : o));
      
      if (selectedOrder && (selectedOrder.tracking_number === trackingNumber || selectedOrder.trackingNumber === trackingNumber)) {
        setSelectedOrder((prev: any) => prev ? { 
          ...prev, 
          status: nextStatus,
          shipping_status: nextStatus
        } : null);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update shipment status.", "error");
    }
  };

  // Products Management Actions
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" (${productId})?`)) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      showToast("Product deleted successfully.", "success");
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error: any) {
      showToast(error.message || "Failed to remove product catalog entry.", "error");
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      id: "",
      name: "",
      category: "",
      category_slug: "",
      price: 0,
      original_price: 0,
      stock: 0,
      description: "",
      long_description: "",
      images: [],
      colors: [],
      sizes: [],
      specs: [],
      is_featured: false,
      is_trending: false,
      is_bestseller: false,
      tag: ""
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      category_slug: product.category_slug || "",
      price: Number(product.price),
      original_price: product.original_price ? Number(product.original_price) : 0,
      stock: product.stock || 0,
      description: product.description || "",
      long_description: product.long_description || "",
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      specs: product.specs || [],
      is_featured: !!product.is_featured,
      is_trending: !!product.is_trending,
      is_bestseller: !!product.is_bestseller,
      tag: product.tag || ""
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.id || !productForm.name || !productForm.category || productForm.price <= 0) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    try {
      const payload = {
        ...productForm,
        category_slug: productForm.category_slug || productForm.category.toLowerCase().replace(/\s+/g, "-"),
        original_price: productForm.original_price > 0 ? productForm.original_price : null,
      };

      if (editingProduct) {
        // Update product
        const updated = await api.put<any>(`/admin/products/${editingProduct.id}`, payload);
        showToast("Product updated successfully.", "success");
      } else {
        // Create product
        const created = await api.post<any>("/admin/products", payload);
        showToast("Product cataloged successfully.", "success");
      }
      setIsProductModalOpen(false);
      fetchAdminData(); // Refresh complete catalog
    } catch (error: any) {
      showToast(error.message || "Failed to commit product changes.", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post<{ url: string }>("/admin/upload", formData);
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, res.url]
      }));
      showToast("Image uploaded and hosted successfully.", "success");
    } catch (error: any) {
      showToast(error.message || "Image upload rejected.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper additions for custom arrays
  const addColor = () => {
    if (!tempColor.name.trim()) return;
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, tempColor]
    }));
    setTempColor({ name: "", hex: "#000000" });
  };

  const removeColor = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const addSpec = () => {
    if (!tempSpec.label.trim() || !tempSpec.value.trim()) return;
    setProductForm(prev => ({
      ...prev,
      specs: [...prev.specs, tempSpec]
    }));
    setTempSpec({ label: "", value: "" });
  };

  const removeSpec = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size: string) => {
    setProductForm(prev => {
      const exists = prev.sizes.includes(size);
      const updatedSizes = exists
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  // Metric Calculation variables
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;

  // Filter functions
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.shipping_address?.fullName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.shipping_address?.phone || "").toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(productSearch.toLowerCase());
    
    const matchesCategory = productCategoryFilter === "all" || p.category === productCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Render Login Panel for non-admin accounts
  if (!isLoggedIn || userRole !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-accent to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center font-serif text-3xl font-extrabold text-white tracking-wider">
            AURA
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400 font-medium">
            Administrative Console Access
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
          <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 backdrop-blur-xl bg-opacity-70">
            <form className="space-y-6" onSubmit={handleAdminLogin}>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                  Administrator Email
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@aura.design"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                  Console Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl bg-accent hover:bg-orange-600 disabled:bg-orange-600/50 text-white text-sm font-semibold tracking-wider transition shadow-lg shadow-orange-500/10 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Authorize Credentials"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Render complete Administrator dashboard console
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-accent/15 text-accent uppercase border border-accent/20">
                Authorized Admin
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mt-2">AURA Administrative Console</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-3 rounded-xl border border-slate-800 hover:bg-slate-900 transition text-slate-400 hover:text-white"
              title="Sync Data"
            >
              <RefreshCw className={`h-5 w-5 ${isLoadingData ? "animate-spin text-accent" : ""}`} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 py-3 px-5 rounded-xl border border-slate-800 hover:bg-rose-950/20 hover:border-rose-900/30 text-slate-400 hover:text-rose-400 text-sm font-semibold transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </header>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-900 mb-8 space-x-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-4 text-sm font-medium tracking-wider uppercase border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === "dashboard"
                ? "border-accent text-accent"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 text-sm font-medium tracking-wider uppercase border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "border-accent text-accent"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Orders Management</span>
            {orders.length > 0 && (
              <span className="bg-slate-850 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-300">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 text-sm font-medium tracking-wider uppercase border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === "products"
                ? "border-accent text-accent"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Product Catalog</span>
            {products.length > 0 && (
              <span className="bg-slate-850 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-300">
                {products.length}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-slate-950 opacity-10">
                  <DollarSign className="h-28 w-28" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sales Volume</h3>
                <p className="text-3xl font-serif font-bold text-white mt-4">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-emerald-500 mt-2 text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Platform Aggregate</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-slate-950 opacity-10">
                  <ShoppingBag className="h-28 w-28" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders Placed</h3>
                <p className="text-3xl font-serif font-bold text-white mt-4">{totalOrdersCount}</p>
                <div className="text-slate-400 mt-2 text-xs font-medium">
                  Across registered clients
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-slate-950 opacity-10">
                  <TrendingUp className="h-28 w-28" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Order Value</h3>
                <p className="text-3xl font-serif font-bold text-white mt-4">${averageOrderValue}</p>
                <div className="text-slate-400 mt-2 text-xs font-medium">
                  Per customer transaction
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-slate-950 opacity-10">
                  <AlertTriangle className="h-28 w-28" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Low Stock Warnings</h3>
                <p className={`text-3xl font-serif font-bold mt-4 ${lowStockCount > 0 ? "text-amber-500" : "text-white"}`}>
                  {lowStockCount}
                </p>
                <div className="flex items-center gap-1 text-slate-400 mt-2 text-xs font-medium">
                  <span>Below 5 unit threshold</span>
                </div>
              </div>
            </div>

            {/* Sub-panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders List */}
              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold text-white">Recent Transactions</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 text-sm">
                      No customer transactions logged yet.
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{order.shipping_address?.fullName || "AURA Client"}</p>
                          <p className="text-xs text-slate-500 mt-1">{order.id} | {order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === "Delivered" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                            order.status === "Shipped" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                            order.status === "Processing" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                            "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-bold text-white">${order.total}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6">
                <h3 className="font-serif text-lg font-bold text-white mb-6">Restock Alerts</h3>
                
                <div className="space-y-4">
                  {products.filter(p => (p.stock || 0) < 5).length === 0 ? (
                    <div className="py-10 text-center text-slate-500 text-sm">
                      All catalog items fully stocked.
                    </div>
                  ) : (
                    products.filter(p => (p.stock || 0) < 5).slice(0, 6).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-900"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <img
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-900 border border-slate-850 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate max-w-[150px]">{product.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-500">{product.stock} units left</span>
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="block text-[10px] text-accent hover:underline mt-1 font-semibold cursor-pointer"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Filter and Search controls */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-850">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search orders by ID, recipient name or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-850 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <Filter className="h-4.5 w-4.5 text-slate-500 ml-2" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full md:w-48 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table list */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-medium text-xs tracking-wider uppercase">
                      <th className="py-4.5 px-6">Order ID</th>
                      <th className="py-4.5 px-6">Customer / Contact</th>
                      <th className="py-4.5 px-6">Order Date</th>
                      <th className="py-4.5 px-6">Shipment Method</th>
                      <th className="py-4.5 px-6">Total Amount</th>
                      <th className="py-4.5 px-6">Status</th>
                      <th className="py-4.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-sm">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-500 font-medium bg-slate-900">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-950/20 transition group">
                          <td className="py-4 px-6 font-semibold text-white">{order.id}</td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-slate-200">{order.shipping_address?.fullName || "Client Name"}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{order.shipping_address?.phone || "No phone"}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-300">{order.date}</td>
                          <td className="py-4 px-6 text-slate-400 text-xs">{order.delivery_method}</td>
                          <td className="py-4 px-6 font-bold text-white">${order.total}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              order.status === "Delivered" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                              order.status === "Shipped" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                              order.status === "Processing" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                              "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                                title="Inspect Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-slate-950 border border-slate-850 text-xs rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent text-slate-300 cursor-pointer"
                              >
                                <option value="Placed">Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
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

        {/* Products Tab Content */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Action panel & search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-slate-850 w-full md:flex-1">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search product catalog by name, model ID..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-850 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <Filter className="h-4.5 w-4.5 text-slate-500 ml-2" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full md:w-48 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
                  >
                    <option value="all">All Categories</option>
                    {Array.from(new Set(products.map(p => p.category))).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full md:w-auto flex items-center justify-center gap-2 py-4 px-6 rounded-3xl bg-accent hover:bg-orange-600 text-white text-sm font-semibold tracking-wider transition shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 font-medium text-xs tracking-wider uppercase">
                      <th className="py-4.5 px-6">Product details</th>
                      <th className="py-4.5 px-6">Model ID</th>
                      <th className="py-4.5 px-6">Category</th>
                      <th className="py-4.5 px-6">Retail price</th>
                      <th className="py-4.5 px-6">Stock level</th>
                      <th className="py-4.5 px-6">Tags</th>
                      <th className="py-4.5 px-6 text-right">Edit / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-sm">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-500 font-medium bg-slate-900">
                          No products found in catalog.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-950/20 transition group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl object-cover bg-slate-950 border border-slate-850 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-200 truncate max-w-[200px]">{product.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-400 text-xs">{product.id}</td>
                          <td className="py-4 px-6 text-slate-300">{product.category}</td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-white">${product.price}</span>
                            {product.originalPrice ? (
                              <span className="text-xs text-slate-500 line-through ml-2">${product.originalPrice}</span>
                            ) : product.original_price ? (
                              <span className="text-xs text-slate-500 line-through ml-2">${product.original_price}</span>
                            ) : null}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`font-semibold ${
                              product.stock === 0 ? "text-rose-500" :
                              product.stock < 5 ? "text-amber-500" :
                              "text-slate-300"
                            }`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                              {product.isFeatured && <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-orange-950/40 text-orange-400 border border-orange-900/30">Featured</span>}
                              {product.tag && <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-850 text-slate-300 border border-slate-800">{product.tag}</span>}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(product)}
                                className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-2 bg-slate-950 border border-slate-850 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-xl transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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

      {/* Order Inspection Modal Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative z-10 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Order Analysis</h3>
                <p className="text-xs text-slate-500 mt-0.5">Reference ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Delivery info */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Client Destination</h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1.5 text-sm">
                  <p className="font-bold text-white">{selectedOrder.shipping_address?.fullName}</p>
                  <p className="text-slate-350">{selectedOrder.shipping_address?.street}</p>
                  <p className="text-slate-350">
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zipCode}
                  </p>
                  <p className="text-slate-350">{selectedOrder.shipping_address?.country}</p>
                  <p className="text-slate-400 text-xs mt-3">Phone: {selectedOrder.shipping_address?.phone}</p>
                </div>
              </div>

              {/* Status and Logistics */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Logistics Action</h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-850 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent text-white"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Carrier & Details</h4>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1.5 text-xs text-slate-400 mb-3">
                    <p><span className="text-slate-500">Method:</span> {selectedOrder.delivery_method}</p>
                    <p><span className="text-slate-500">Tracking:</span> {selectedOrder.tracking_number || selectedOrder.trackingNumber || "Awaiting allocation"}</p>
                    <p><span className="text-slate-500">Scheduled:</span> {selectedOrder.estimated_delivery || selectedOrder.estimatedDelivery || "Calculating..."}</p>
                    {selectedOrder.shipping_status && (
                      <p><span className="text-slate-500">Shipment Status:</span> <span className="font-bold text-accent">{selectedOrder.shipping_status}</span></p>
                    )}
                  </div>

                  {/* Simulator Control Center */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 border-orange-500/20 text-xs space-y-3">
                    <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-accent animate-pulse" />
                      <span>Fulfillment Simulator (Phase 5)</span>
                    </h5>
                    
                    {!(selectedOrder.tracking_number || selectedOrder.trackingNumber) ? (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Courier</label>
                          <input 
                            type="text"
                            value={courierName}
                            onChange={(e) => setCourierName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-white text-[11px] rounded-lg px-2 py-1.5 focus:outline-none"
                            placeholder="DHL Express"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Custom Tracking (Optional)</label>
                          <input 
                            type="text"
                            value={customTracking}
                            onChange={(e) => setCustomTracking(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-white text-[11px] rounded-lg px-2 py-1.5 focus:outline-none"
                            placeholder="Auto-generate if empty"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleShipOrder(selectedOrder.id)}
                          disabled={isShipping}
                          className="w-full bg-accent hover:bg-orange-600 text-white py-2 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer text-center"
                        >
                          {isShipping ? "Fulfilling..." : "Generate Shipment & Ship"}
                        </button>
                      </div>
                    ) : selectedOrder.status === "Shipped" || selectedOrder.shipping_status === "Shipped" ? (
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 font-medium">Shipment generated. Transition status to test delivery notification flow:</p>
                        <button
                          type="button"
                          onClick={() => handleUpdateShipmentStatus(selectedOrder.tracking_number || selectedOrder.trackingNumber, "Delivered")}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition cursor-pointer text-center"
                        >
                          Complete Delivery (Delivered)
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-[10px] italic">Order is fully delivered. Invoice receipt and tracking history finalized.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cart Contents</h4>
              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden divide-y divide-slate-850">
                {(selectedOrder.items || []).map((item: any) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center justify-between text-sm">
                    <div className="min-w-0 flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                        alt={item.product?.name || "Product"}
                        className="h-10 w-10 rounded-lg object-cover bg-slate-900 border border-slate-850 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[250px]">{item.product?.name || "Item Catalogue"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Color: {item.selected_color || item.selectedColor} 
                          {item.selected_size || item.selectedSize ? ` | Size: ${item.selected_size || item.selectedSize}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-white">${item.price}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown summary */}
            <div className="border-t border-slate-850 pt-4 flex flex-col items-end space-y-1.5 text-sm text-slate-300">
              <div className="flex justify-between w-64">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between w-64">
                <span>Shipping:</span>
                <span>${selectedOrder.shipping}</span>
              </div>
              <div className="flex justify-between w-64 border-b border-slate-850 pb-2">
                <span>Tax (8%):</span>
                <span>${selectedOrder.tax}</span>
              </div>
              <div className="flex justify-between w-64 text-base font-bold text-white pt-1">
                <span>Grand Total:</span>
                <span>${selectedOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Drawer Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingProduct ? `Edit Catalog Product: ${editingProduct.id}` : "Publish New Product"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product code ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Unique Product ID (Model Reference) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={productForm.id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="e.g. prod-11"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Silk Lounging Robe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Category Display Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Accessories"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Category URL Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Category Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={productForm.category_slug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_slug: e.target.value }))}
                    placeholder="e.g. accessories"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Retail Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Retail Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="250.00"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Original/Discount comparison price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Original Price ($ USD Comparison)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.original_price || ""}
                    onChange={(e) => setProductForm(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                    placeholder="Compare to: 320.00"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Inventory level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Inventory Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock || 0}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Marketing tag */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Marketing Banner Tag
                  </label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g. Limited Release, New Season"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Core Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Card Overview Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Sleek summary description for catalog cards..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Full Detail Specification (Product Page Story) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={productForm.long_description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Detailed paragraph explaining craftsmanship, origin and aesthetic values..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Product Sizing Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Sizing Parameters (Applicable for Clothing/Apparel)
                </label>
                <div className="flex flex-wrap gap-3">
                  {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((sz) => {
                    const active = productForm.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          active 
                            ? "bg-accent/15 border-accent text-accent" 
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Color Palette Manager */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Aesthetic Color Options
                </label>
                
                {/* Colors list */}
                <div className="flex flex-wrap gap-2">
                  {productForm.colors.length === 0 ? (
                    <span className="text-xs text-slate-650">No color options defined yet.</span>
                  ) : (
                    productForm.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
                        <span className="h-3 w-3 rounded-full border border-slate-700" style={{ backgroundColor: c.hex }} />
                        <span className="text-slate-300">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(i)}
                          className="ml-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add color sub-form */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="text"
                    value={tempColor.name}
                    onChange={(e) => setTempColor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Color Name (e.g. Space Grey)"
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-700 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="color"
                      value={tempColor.hex}
                      onChange={(e) => setTempColor(prev => ({ ...prev, hex: e.target.value }))}
                      className="h-8 w-12 bg-transparent border-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                      Add Color
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Technical Specs Manager */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Specifications & Craftsmanship Parameters
                </label>

                {/* Specs list */}
                <div className="space-y-2">
                  {productForm.specs.length === 0 ? (
                    <span className="text-xs text-slate-650">No specifications declared.</span>
                  ) : (
                    productForm.specs.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-400 mr-2">{s.label}:</span>
                          <span className="text-slate-200">{s.value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpec(i)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add spec subform */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="text"
                    value={tempSpec.label}
                    onChange={(e) => setTempSpec(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Parameter (e.g. Movement, Material)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-700 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempSpec.value}
                    onChange={(e) => setTempSpec(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Details (e.g. Japanese Quartz, 100% Cashmere)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSpec}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Add Specification
                  </button>
                </div>
              </div>

              {/* Dynamic Image Hosting Zone */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Product Imagery (Hosted Assets)
                </label>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {productForm.images.map((img, i) => (
                    <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                      <img src={img} alt="Product preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 border border-slate-850 hover:bg-rose-950 text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button zone */}
                  <label className={`aspect-square border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
                    isUploading 
                      ? "border-slate-800 bg-slate-950 pointer-events-none" 
                      : "border-slate-800 hover:border-accent bg-slate-950/50 hover:bg-slate-950"
                  }`}>
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-accent animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-400 font-medium">Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Marketing Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-850 p-5 rounded-2xl bg-slate-950">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-850 text-accent focus:ring-accent bg-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Featured item</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_trending}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_trending: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-850 text-accent focus:ring-accent bg-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Trending item</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_bestseller}
                    onChange={(e) => setProductForm(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-850 text-accent focus:ring-accent bg-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-350 uppercase tracking-wider">Best Seller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-950/60 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-accent hover:bg-orange-600 text-white font-semibold transition cursor-pointer shadow-lg shadow-orange-500/10"
                >
                  Commit Product Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

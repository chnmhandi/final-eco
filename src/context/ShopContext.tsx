"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, mockProducts } from "@/data/products";
import { Category, mockCategories } from "@/data/categories";
import { api, mapBackendProduct, mapBackendCategory, getToken, setToken } from "@/utils/api";

export interface CartItem {
  id: string; // unique item composite key (e.g. prod-1_Matte-Black_M)
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  deliveryMethod: string;
  status: "Placed" | "Processing" | "Shipped" | "Delivered";
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  avatarUrl: string;
  memberSince: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  recentSearches: string[];
  orders: Order[];
  profile: UserProfile;
  toasts: Toast[];
  products: Product[];
  categories: Category[];
  isLoggedIn: boolean;
  isLoading: boolean;
  userRole: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  addToCart: (product: Product, quantity: number, color: string, size?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  placeOrder: (
    shippingAddress: UserProfile,
    deliveryMethod: string,
    speedPrice: number,
    couponCode?: string,
    razorpayDetails?: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) => Promise<string>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  dismissToast: (id: string) => void;
  notifications: any[];
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  fullName: "Alexander Sterling",
  email: "alexander.sterling@aura.design",
  phone: "+1 (555) 019-2834",
  street: "128 Luxury Vista Lane",
  city: "San Francisco",
  state: "CA",
  zipCode: "94107",
  country: "United States",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  memberSince: "November 2024"
};

const initialOrders: Order[] = [
  {
    id: "AUR-92834",
    date: "June 14, 2026",
    items: [
      {
        id: "prod-1_Matte-Black",
        product: {
          id: "prod-1",
          name: "The Meridian Chronograph Watch",
          category: "Accessories",
          price: 345,
          rating: 4.8,
          reviewCount: 124,
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"],
          description: "An elegant, precision-crafted timepiece.",
          longDescription: "",
          colors: [{ name: "Matte Black", hex: "#1A1A1A" }],
          specs: [],
          reviews: [],
          stock: 10
        },
        quantity: 1,
        selectedColor: "Matte Black",
        price: 345
      }
    ],
    subtotal: 345,
    shipping: 0,
    tax: 27.6,
    total: 372.6,
    shippingAddress: initialProfile,
    deliveryMethod: "Express Concierge Delivery",
    status: "Delivered",
    trackingNumber: "TRK-882736152",
    estimatedDelivery: "June 16, 2026"
  }
];

const decodeTokenRole = (token: string): string => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role || "user";
  } catch {
    return "user";
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("user");

  // Toast dispatchers
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const rawOrders = await api.get<any[]>("/orders");
      const mappedOrders: Order[] = rawOrders.map((o: any) => ({
        id: o.id,
        date: o.date,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        tax: Number(o.tax),
        total: Number(o.total),
        shippingAddress: {
          fullName: o.shipping_address?.fullName || o.shipping_address?.full_name || "",
          street: o.shipping_address?.street || "",
          city: o.shipping_address?.city || "",
          state: o.shipping_address?.state || "",
          zipCode: o.shipping_address?.zipCode || o.shipping_address?.zip_code || "",
          country: o.shipping_address?.country || "",
          phone: o.shipping_address?.phone || "",
          avatarUrl: "",
          memberSince: ""
        },
        deliveryMethod: o.delivery_method,
        status: o.status,
        trackingNumber: o.tracking_number || "",
        estimatedDelivery: o.estimated_delivery || "",
        items: (o.items || []).map((item: any) => ({
          id: String(item.id),
          product: item.product ? mapBackendProduct(item.product) : {} as Product,
          quantity: item.quantity,
          selectedColor: item.selected_color,
          selectedSize: item.selected_size,
          price: Number(item.price)
        }))
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Failed to fetch orders from backend:", error);
    }
  };

  // Sync guest cart to backend
  const syncGuestCart = async (guestCart: CartItem[]) => {
    if (!guestCart || guestCart.length === 0) return;
    try {
      for (const item of guestCart) {
        await api.post("/cart", {
          product_id: item.product.id,
          quantity: item.quantity,
          selected_color: item.selectedColor,
          selected_size: item.selectedSize || null
        });
      }
    } catch (error) {
      console.error("Failed to sync guest cart to backend:", error);
    }
  };

  // Load backend data for logged in user
  const fetchUserData = async (guestCartToSync?: CartItem[]) => {
    try {
      // 1. Fetch Profile
      const rawProfile = await api.get<any>("/auth/profile");
      const userProfile: UserProfile = {
        fullName: rawProfile.full_name || "",
        email: rawProfile.email,
        phone: rawProfile.phone || "",
        street: rawProfile.street || "",
        city: rawProfile.city || "",
        state: rawProfile.state || "",
        zipCode: rawProfile.zip_code || "",
        country: rawProfile.country || "",
        avatarUrl: rawProfile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        memberSince: new Date(rawProfile.member_since).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      };
      setProfile(userProfile);

      // 2. Sync guest cart
      if (guestCartToSync && guestCartToSync.length > 0) {
        await syncGuestCart(guestCartToSync);
        if (typeof window !== "undefined") {
          localStorage.removeItem("aura_cart");
        }
      }

      // 3. Fetch Cart
      const rawCart = await api.get<any[]>("/cart");
      const mappedCart: CartItem[] = rawCart.map((item: any) => ({
        id: item.id,
        product: mapBackendProduct(item.product),
        quantity: item.quantity,
        selectedColor: item.selected_color,
        selectedSize: item.selected_size
      }));
      setCart(mappedCart);

      // 4. Fetch Wishlist
      const rawWishlist = await api.get<any[]>("/wishlist");
      const mappedWishlist: Product[] = rawWishlist.map((item: any) => mapBackendProduct(item.product));
      setWishlist(mappedWishlist);

      // 5. Fetch Orders
      await fetchOrders();

      // 6. Fetch Notifications
      try {
        const rawNotifications = await api.get<any[]>("/notifications");
        setNotifications(rawNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    } catch (error) {
      console.error("Failed to load user data from backend API:", error);
      // Clean invalid token
      logout();
    }
  };

  // Auth Functions
  const login = async (email: string, password: string) => {
    const data = await api.post<{ access_token: string; role: string }>("/auth/login", { email, password });
    setToken(data.access_token);
    setIsLoggedIn(true);
    setUserRole(data.role);
    
    // Save token state
    if (typeof window !== "undefined") {
      localStorage.setItem("aura_is_logged_in", "true");
    }

    // Get current guest cart to sync
    let guestCart: CartItem[] = [];
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("aura_cart");
      if (storedCart) guestCart = JSON.parse(storedCart);
    }

    await fetchUserData(guestCart);
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const data = await api.post<{ access_token: string; role: string }>("/auth/signup", {
      email,
      password,
      full_name: fullName
    });
    setToken(data.access_token);
    setIsLoggedIn(true);
    setUserRole(data.role);
    
    // Save token state
    if (typeof window !== "undefined") {
      localStorage.setItem("aura_is_logged_in", "true");
    }

    // Sync guest cart
    let guestCart: CartItem[] = [];
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("aura_cart");
      if (storedCart) guestCart = JSON.parse(storedCart);
    }

    await fetchUserData(guestCart);
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setUserRole("user");
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setNotifications([]);
    setProfile(initialProfile);
    if (typeof window !== "undefined") {
      localStorage.removeItem("aura_cart");
      localStorage.removeItem("aura_wishlist");
      localStorage.removeItem("aura_orders");
      localStorage.removeItem("aura_profile");
      localStorage.removeItem("aura_is_logged_in");
    }
    showToast("Signed out successfully.", "info");
  };

  // Initialize
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      
      // Load static catalogs from API if available
      try {
        const rawProducts = await api.get<any[]>("/products");
        if (rawProducts && rawProducts.length > 0) {
          setProducts(rawProducts.map(mapBackendProduct));
        }
        
        const rawCategories = await api.get<any[]>("/categories");
        if (rawCategories && rawCategories.length > 0) {
          setCategories(rawCategories.map(mapBackendCategory));
        }
      } catch (e) {
        console.warn("Failed to fetch product catalogs from backend API. Falling back to mock local data.", e);
      }

      // Check auth status
      const token = getToken();
      if (token) {
        setIsLoggedIn(true);
        setUserRole(decodeTokenRole(token));
        await fetchUserData();
      } else {
        // Load Guest Mode from LocalStorage
        if (typeof window !== "undefined") {
          const storedCart = localStorage.getItem("aura_cart");
          if (storedCart) setCart(JSON.parse(storedCart));

          const storedWishlist = localStorage.getItem("aura_wishlist");
          if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

          const storedProfile = localStorage.getItem("aura_profile");
          if (storedProfile) setProfile(JSON.parse(storedProfile));
          
          setOrders(initialOrders);
        }
      }
      
      // Load searches
      if (typeof window !== "undefined") {
        const storedSearches = localStorage.getItem("aura_searches");
        if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
      }
      
      setIsLoading(false);
    };

    initApp();
  }, []);

  // Save to LocalStorage helper (used only for guest mode)
  const saveToLocal = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  // Cart Functions
  const addToCart = async (product: Product, quantity: number, color: string, size?: string) => {
    if (isLoggedIn) {
      try {
        const rawItem = await api.post<any>("/cart", {
          product_id: product.id,
          quantity,
          selected_color: color,
          selected_size: size || null
        });
        
        // Refresh local cart from backend to ensure consistent state
        const rawCart = await api.get<any[]>("/cart");
        const mappedCart: CartItem[] = rawCart.map((item: any) => ({
          id: item.id,
          product: mapBackendProduct(item.product),
          quantity: item.quantity,
          selectedColor: item.selected_color,
          selectedSize: item.selected_size
        }));
        setCart(mappedCart);
      } catch (error: any) {
        showToast(error.message || "Failed to add item to bag.", "error");
        return;
      }
    } else {
      // Guest local storage cart
      const itemKey = `${product.id}_${color.replace(/\s+/g, "-")}_${size || "NoSize"}`;
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((item) => item.id === itemKey);
        let newCart;
        if (existingItemIndex > -1) {
          newCart = [...prevCart];
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart = [...prevCart, { id: itemKey, product, quantity, selectedColor: color, selectedSize: size }];
        }
        saveToLocal("aura_cart", newCart);
        return newCart;
      });
    }

    showToast(`Added ${quantity}x ${product.name} (${color}${size ? `, ${size}` : ""}) to your bag.`, "success");
  };

  const removeFromCart = async (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    
    if (isLoggedIn) {
      try {
        await api.delete(`/cart/${cartItemId}`);
        setCart((prevCart) => prevCart.filter((i) => i.id !== cartItemId));
      } catch (error: any) {
        showToast(error.message || "Failed to remove item.", "error");
        return;
      }
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.filter((i) => i.id !== cartItemId);
        saveToLocal("aura_cart", newCart);
        return newCart;
      });
    }

    if (item) {
      showToast(`Removed ${item.product.name} from your bag.`, "info");
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (isLoggedIn) {
      try {
        await api.put(`/cart/${cartItemId}`, { quantity });
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          )
        );
      } catch (error: any) {
        showToast(error.message || "Failed to update quantity.", "error");
      }
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        saveToLocal("aura_cart", newCart);
        return newCart;
      });
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await api.delete("/cart/clear/all");
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    }
    setCart([]);
    saveToLocal("aura_cart", []);
  };

  // Wishlist Functions
  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    
    if (isLoggedIn) {
      try {
        if (exists) {
          await api.delete(`/wishlist/${product.id}`);
          setWishlist((prev) => prev.filter((p) => p.id !== product.id));
          showToast(`Removed ${product.name} from your wishlist.`, "info");
        } else {
          await api.post(`/wishlist/${product.id}`);
          setWishlist((prev) => [...prev, product]);
          showToast(`Saved ${product.name} to your wishlist.`, "success");
        }
      } catch (error: any) {
        showToast(error.message || "Failed to update wishlist.", "error");
      }
    } else {
      setWishlist((prevWishlist) => {
        let newWishlist;
        if (exists) {
          newWishlist = prevWishlist.filter((p) => p.id !== product.id);
          showToast(`Removed ${product.name} from your wishlist.`, "info");
        } else {
          newWishlist = [...prevWishlist, product];
          showToast(`Saved ${product.name} to your wishlist.`, "success");
        }
        saveToLocal("aura_wishlist", newWishlist);
        return newWishlist;
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Search Functions
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q !== query);
      const updated = [query, ...filtered].slice(0, 5);
      saveToLocal("aura_searches", updated);
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    saveToLocal("aura_searches", []);
  };

  // Checkout & Profile Update
  const placeOrder = async (
    shippingAddress: UserProfile,
    deliveryMethod: string,
    speedPrice: number,
    couponCode?: string,
    razorpayDetails?: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ): Promise<string> => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === "AURA10") {
      discount = subtotal * 0.1;
    }
    const total = Math.round((subtotal + speedPrice + tax - discount) * 100) / 100;

    const shippingAddressJson = {
      fullName: shippingAddress.fullName,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone
    };

    if (isLoggedIn) {
      try {
        const orderRes = await api.post<any>("/orders", {
          subtotal,
          shipping: speedPrice,
          tax,
          total,
          shipping_address: shippingAddressJson,
          delivery_method: deliveryMethod,
          razorpay_order_id: razorpayDetails?.razorpay_order_id || null,
          razorpay_payment_id: razorpayDetails?.razorpay_payment_id || null,
          razorpay_signature: razorpayDetails?.razorpay_signature || null
        });
        
        // Fetch fresh orders
        const rawOrders = await api.get<any[]>("/orders");
        const mappedOrders: Order[] = rawOrders.map((o: any) => ({
          id: o.id,
          date: o.date,
          subtotal: Number(o.subtotal),
          shipping: Number(o.shipping),
          tax: Number(o.tax),
          total: Number(o.total),
          shippingAddress: {
            fullName: o.shipping_address?.fullName || o.shipping_address?.full_name || "",
            street: o.shipping_address?.street || "",
            city: o.shipping_address?.city || "",
            state: o.shipping_address?.state || "",
            zipCode: o.shipping_address?.zipCode || o.shipping_address?.zip_code || "",
            country: o.shipping_address?.country || "",
            phone: o.shipping_address?.phone || "",
            avatarUrl: "",
            memberSince: ""
          },
          deliveryMethod: o.delivery_method,
          status: o.status,
          trackingNumber: o.tracking_number || "",
          estimatedDelivery: o.estimated_delivery || "",
          items: (o.items || []).map((item: any) => ({
            id: String(item.id),
            product: item.product ? mapBackendProduct(item.product) : {} as Product,
            quantity: item.quantity,
            selectedColor: item.selected_color,
            selectedSize: item.selected_size,
            price: Number(item.price)
          }))
        }));
        setOrders(mappedOrders);
        setCart([]);
        showToast("Order placed successfully! Custom tracking number generated.", "success");
        return orderRes.id;
      } catch (error: any) {
        showToast(error.message || "Failed to place order.", "error");
        throw error;
      }
    } else {
      // Local Order placement (fallback guest mode)
      const orderId = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderItems: OrderItem[] = cart.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price: item.product.price
      }));

      const dateToday = new Date();
      const formattedDate = dateToday.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      const estDeliveryDate = new Date();
      estDeliveryDate.setDate(dateToday.getDate() + (speedPrice > 15 ? 2 : 4));
      const formattedEstDelivery = estDeliveryDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      const newOrder: Order = {
        id: orderId,
        date: formattedDate,
        items: orderItems,
        subtotal,
        shipping: speedPrice,
        tax,
        total,
        shippingAddress,
        deliveryMethod,
        status: "Placed",
        trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
        estimatedDelivery: formattedEstDelivery
      };

      setOrders((prevOrders) => {
        const updated = [newOrder, ...prevOrders];
        saveToLocal("aura_orders", updated);
        return updated;
      });

      clearCart();
      showToast("Order placed successfully! Custom tracking number generated.", "success");
      return orderId;
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (isLoggedIn) {
      try {
        const rawProfile = await api.put<any>("/auth/profile", {
          full_name: updatedProfile.fullName,
          phone: updatedProfile.phone,
          avatar_url: updatedProfile.avatarUrl
        });

        // Backend only updates metadata, merge with existing state fields (like addresses)
        setProfile((prev) => {
          const updated = {
            ...prev,
            fullName: rawProfile.full_name || prev.fullName,
            phone: rawProfile.phone || prev.phone,
            avatarUrl: rawProfile.avatar_url || prev.avatarUrl,
            street: updatedProfile.street || prev.street,
            city: updatedProfile.city || prev.city,
            state: updatedProfile.state || prev.state,
            zipCode: updatedProfile.zipCode || prev.zipCode,
            country: updatedProfile.country || prev.country
          };
          saveToLocal("aura_profile", updated);
          return updated;
        });
      } catch (error: any) {
        showToast(error.message || "Failed to update profile.", "error");
        return;
      }
    } else {
      setProfile((prev) => {
        const updated = { ...prev, ...updatedProfile };
        saveToLocal("aura_profile", updated);
        return updated;
      });
    }
    showToast("Profile settings updated successfully.", "success");
  };

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      const data = await api.get<any[]>("/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        recentSearches,
        orders,
        profile,
        toasts,
        products,
        categories,
        isLoggedIn,
        isLoading,
        userRole,
        login,
        signup,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addRecentSearch,
        clearRecentSearches,
        placeOrder,
        updateProfile,
        showToast,
        dismissToast,
        notifications,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        fetchOrders
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

"use client";

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Menu, ChevronRight, ChevronLeft, ShieldCheck, Zap,
  Smartphone, Sparkles, X, Trash2, User, ChevronDown, Package, Truck, CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from './useCartStore';
// 1. IMPORT YOUR LIVE ACTION
import { getProducts } from './lib/actions';

// --- Brand Theme ---
const BRAND_YELLOW = '#fbea27';

// --- Banner Data (Kept exactly as original) ---
const BANNERS = [
  {
    id: 1,
    title: "MEGA GLASS SALE",
    subtitle: "BUY 2 GET 1 FREE",
    desc: "Premium 9H protection for all iPhone & Samsung models. Limited time offer.",
    cta: "Shop The Deal",
    img: "https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80&w=1200",
    color: "#000000"
  },
  {
    id: 2,
    title: "WELCOME OFFER",
    subtitle: "FLAT 20% OFF",
    desc: "Use code FIRSTCAPITOL at checkout. Valid on your first order of display armor.",
    cta: "Claim Discount",
    img: "https://images.unsplash.com/photo-1556656793-062ff987b50d?q=80&w=1200",
    color: BRAND_YELLOW
  },
  {
    id: 3,
    title: "ULTIMATE COMBO",
    subtitle: "SAVE ₹500",
    desc: "Get Tempered Glass + Camera Lens Protector bundle starting at just ₹999.",
    cta: "View Bundles",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
    color: "#232f3e"
  }
];

const TABS_DATA = {
  categories: [
    { id: 1, name: 'Tempered Glass', count: '150+ Models', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400' },
    { id: 2, name: 'Camera Guard', count: '90+ Models', img: 'https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80&w=400' },
    { id: 3, name: 'Back ScreenGuard', count: '40+ Models', img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400' },
    { id: 4, name: 'Combo', count: '200+ Designs', img: 'https://images.unsplash.com/photo-1603313011101-31c726a55d4c?q=80&w=400' },
  ],
  brands: [
    { id: 1, name: 'Apple iPhone', count: 'iPhone 11 - 15 Pro Max', img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400' },
    { id: 2, name: 'Samsung Galaxy', count: 'S & M Series', img: 'https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80&w=400' },
    { id: 3, name: 'Google Pixel', count: 'Pixel 6 - 8 Pro', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400' },
    { id: 4, name: 'OnePlus', count: '9 - 12 Series', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400' },
  ]
};

export default function EcommerceSite() {
  const [mounted, setMounted] = React.useState(false);
  // 2. NEW STATE: To store live database products
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // 3. FETCH DATA on mount from Atlas
    const fetchFromAtlas = async () => {
      const data = await getProducts();
      setLiveProducts(data);
    };
    fetchFromAtlas();
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { items, addToCart, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [activeSubCategory, setActiveSubCategory] = useState<'screen' | 'camera' | 'back' | 'combo'>('screen');

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const SCREEN_PROTECTION_MODES = [
    { name: 'Basic Clear', desc: 'HD Transparency', img: 'https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80&w=100' },
    { name: 'Matte Finish', desc: 'Anti-Glare Tech', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=100' },
    { name: 'Privacy Shield', desc: 'Anti-Spy Filter', img: 'https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80&w=100' },
  ];

  const DEVICE_BRANDS = [
    { brand: 'Apple', models: ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 16'], img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=100' },
    { brand: 'Samsung', models: ['Galaxy S24', 'S23 Ultra', 'Z Fold'], img: 'https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80&w=100' },
    { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 7a', 'Pixel 6'], img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=100' },
  ];

  const TICKER_ITEMS = [
    { icon: <ShieldCheck size={16} />, text: "9H Hardness Certified" },
    { icon: <Truck size={16} />, text: "Free Delivery Above ₹499" },
    { icon: <Zap size={16} />, text: "Bubble-Free Installation" },
    { icon: <Smartphone size={16} />, text: "100+ Models Supported" },
    { icon: <CreditCard size={16} />, text: "Secure Payment Gateways" },
    { icon: <Package size={16} />, text: "7-Day Easy Replacements" },
  ];

  const categoryMap = {
    screen: 'Tempered Glass',
    camera: 'Camera Guard',
    back: 'Back ScreenGuard',
    combo: 'Combo'
  };

  // This filters products by name, brand, or category
  const searchResults = liveProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayment = async () => {
    try {
      const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const orderData = await response.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Cover Capitol",
        description: "Premium Display Protection",
        order_id: orderData.id,
        handler: function (response: any) {
          alert("Payment Successful! ID: " + response.razorpay_payment_id);
        },
        prefill: { name: "Vinay", email: "test@example.com", contact: "9999999999" },
        theme: { color: "#fbea27" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => console.error(response.error.description));
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#F2F2F2]" />;


  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#131921] font-sans overflow-x-hidden">

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleCart} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[201] shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-[#232f3e] text-white">
                <h2 className="text-lg font-bold">Shopping Cart ({totalItems()})</h2>
                <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium text-black">Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm text-black">
                      <img src={item.images[0]} className="w-20 h-20 object-cover rounded-md" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-orange-700 font-bold text-sm mt-1">₹{item.price}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg self-start transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-600">Subtotal:</span>
                  <span className="text-xl font-bold text-[#B12704]">
                    ₹{items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                  </span>
                </div>
                <button
                  onClick={handlePayment}
                  style={{ backgroundColor: BRAND_YELLOW }}
                  className="w-full py-4 rounded-lg font-bold text-sm shadow-sm hover:brightness-95 transition-all text-black"
                >
                  Proceed to Buy
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="fixed top-0 w-full z-[100] bg-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div style={{ backgroundColor: BRAND_YELLOW }} className="w-8 h-8 rounded-full flex items-center justify-center"><span className="text-black font-black text-xl italic">C</span></div>
            <h1 className="text-xl font-black tracking-tight italic hidden sm:block">COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span></h1>
          </div>
          <div className="flex-1 flex h-10 overflow-hidden rounded-md group">
            <div className="hidden lg:flex items-center px-4 bg-gray-100 text-gray-600 text-xs border-r border-gray-300 cursor-pointer hover:bg-gray-200">All <ChevronDown size={14} className="ml-1" /></div>
            <input
              type="text"
              placeholder="Search for screen guards, privacy glass..."
              className="flex-1 px-4 text-sm text-black outline-none bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={{ backgroundColor: BRAND_YELLOW }} className="px-5 text-black hover:brightness-90 transition-all"><Search size={20} /></button>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative cursor-pointer flex items-center gap-1 group" onClick={toggleCart}>
              <div className="relative">
                <ShoppingBag size={24} style={{ color: BRAND_YELLOW }} />
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems()}</span>
              </div>
              <span className="text-xs font-bold self-end hidden sm:block">Cart</span>
            </div>
          </div>
        </div>
        <div className="bg-[#232f3e] border-t border-white/5 overflow-x-auto">
          <nav className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center gap-8 text-xs font-bold whitespace-nowrap">
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2" onMouseEnter={() => setActiveMenu('screen')} onMouseLeave={() => setActiveMenu(null)}>Screen Protection <ChevronDown size={12} /></div>
            <a href="#" className="hover:text-[#fbea27] transition-colors">Camera Guard</a>
            <a href="#" className="hover:text-[#fbea27] transition-colors">Back ScreenGuard</a>
            <a href="#" className="hover:text-[#fbea27] transition-colors">Combo</a>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2" onMouseEnter={() => setActiveMenu('device')} onMouseLeave={() => setActiveMenu(null)}>Shop By Device <ChevronDown size={12} /></div>
            <a href="#" className="hover:text-[#fbea27] transition-colors">Best Sellers</a>
            <a href="#" className="hover:text-[#fbea27] transition-colors text-orange-400">Deals</a>
          </nav>
        </div>

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onMouseEnter={() => setActiveMenu(activeMenu)}
              onMouseLeave={() => setActiveMenu(null)}
              className="fixed top-26 left-0 w-full bg-white shadow-2xl border-b border-gray-200 z-[99]"
            >
              <div className="max-w-7xl mx-auto p-8 grid grid-cols-4 gap-8">
                {activeMenu === 'screen' ? SCREEN_PROTECTION_MODES.map(item => (
                  <div key={item.name} className="flex flex-col gap-3 group cursor-pointer">
                    <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="text-black font-bold text-sm">{item.name}</h4>
                  </div>
                )) : DEVICE_BRANDS.map(item => (
                  <div key={item.brand} className="flex flex-col gap-2">
                    <h4 className="text-black font-black text-sm uppercase border-b pb-2">{item.brand}</h4>
                    {item.models.map(m => <p key={m} className="text-gray-500 text-xs hover:text-black cursor-pointer py-1">{m}</p>)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ... Header ends here ... */}

      <main className="pt-[104px]">
        {searchQuery.length > 0 ? (
          /* --- SEARCH RESULTS VIEW: NOW INTERACTIVE --- */
          <section className="py-20 max-w-7xl mx-auto px-6 min-h-screen">
            <h2 className="text-3xl font-black uppercase mb-8 text-black">
              Results for: <span style={{ color: BRAND_YELLOW }}>{searchQuery}</span>
            </h2>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map((prod) => (
                  <div key={prod.id} className="bg-white border p-4 rounded-2xl shadow-sm text-black flex flex-col group transition-all hover:shadow-xl">

                    {/* --- WRAPPER LINK START --- */}
                    <Link href={`/product/${prod.id}`} className="cursor-pointer">
                      <div className="aspect-4/5 overflow-hidden rounded-xl mb-4 bg-gray-50">
                        <img
                          src={prod.images?.[0]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={prod.name}
                        />
                      </div>
                      <h5 className="font-bold text-sm truncate group-hover:text-blue-600 transition-colors">
                        {prod.name}
                      </h5>
                      <p className="text-lg font-black text-[#B12704] mb-4">₹{prod.price}</p>
                    </Link>
                    {/* --- WRAPPER LINK END --- */}

                    <button
                      onClick={() => { addToCart(prod); toggleCart(); }}
                      style={{ backgroundColor: BRAND_YELLOW }}
                      className="mt-auto py-2 rounded-md text-[10px] font-bold text-black border border-black/10 active:scale-95 transition-all uppercase"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 font-bold uppercase italic">No products found for "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          /* --- NORMAL HOME PAGE VIEW (Your existing sections) --- */
          <>

            <section className="relative h-screen flex flex-col bg-white pt-[104px] overflow-hidden">
              <div className="flex-1 flex items-center max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600 mb-4 block">New Launch 2026</span>
                    <h2 className="text-5xl lg:text-8xl font-black leading-none mb-6 text-black">UNBREAKABLE <br /> DISPLAY <span style={{ color: BRAND_YELLOW, WebkitTextStroke: '2px black' }}>STYLE.</span></h2>
                    <p className="text-gray-600 text-lg max-w-md mb-8 leading-relaxed font-medium">Join 50k+ customers using India's #1 Diamond-Grade Protection Glass.</p>
                    <div className="flex gap-4">
                      <button className="bg-black text-white px-8 py-4 rounded-lg font-bold text-sm hover:brightness-125 transition-all shadow-lg">Shop iPhone 15 Glass</button>
                      <button className="bg-white border-2 border-black px-8 py-4 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all text-black">All Models</button>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative flex justify-center">
                    <div style={{ backgroundColor: BRAND_YELLOW }} className="absolute inset-0 rounded-full blur-[120px] opacity-20" />
                    <div className="relative bg-gradient-to-tr from-gray-100 to-white p-8 rounded-[3rem] border shadow-2xl overflow-hidden group">
                      <img src="https://images.unsplash.com/photo-1556656793-062ff987b50d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                  </motion.div>
                </div>
              </div>
              <div style={{ backgroundColor: BRAND_YELLOW }} className="w-full h-14 flex items-center overflow-hidden border-t border-black/5 shrink-0">
                <div className="flex whitespace-nowrap animate-ticker">
                  {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-10 text-black font-black text-[10px] uppercase tracking-widest">{item.icon} {item.text}</div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-black">Shop Your Preference</h3>
                <div className="flex bg-white rounded-lg border p-1 shadow-sm">
                  <button onClick={() => setActiveTab('categories')} className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'categories' ? 'bg-[#232f3e] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Category</button>
                  <button onClick={() => setActiveTab('brands')} className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'brands' ? 'bg-[#232f3e] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Brand</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TABS_DATA[activeTab].map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-lg border shadow-sm group cursor-pointer hover:shadow-md transition-all">
                    <h4 className="font-bold text-lg mb-4 text-black">{item.name}</h4>
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4"><img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                    <p style={{ color: 'black' }} className="text-xs font-black uppercase bg-black/5 p-2 rounded inline-block">{item.count}</p>
                    <Link href={`/category/${item.name.toLowerCase().replace(/ /g, '-')}`}><p className="mt-4 text-xs font-bold text-blue-600 hover:text-orange-700 hover:underline cursor-pointer">Shop Now</p></Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-10 max-w-7xl mx-auto px-4 overflow-hidden">
              <div className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl bg-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBanner}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="absolute inset-0">
                      <img src={BANNERS[currentBanner].img} className="w-full h-full object-cover opacity-60" alt={BANNERS[currentBanner].title} />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 px-10 md:px-20 max-w-2xl">
                      <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white font-black text-xs uppercase tracking-[0.4em] mb-4 block">{BANNERS[currentBanner].title}</motion.span>
                      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: currentBanner === 1 ? '#000000' : BRAND_YELLOW }} className={`text-5xl md:text-7xl font-black mb-6 leading-none ${currentBanner === 1 ? 'bg-[#fbea27] px-4 py-2 inline-block rounded-lg' : ''}`}>{BANNERS[currentBanner].subtitle}</motion.h2>
                      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-300 text-lg mb-10 font-medium">{BANNERS[currentBanner].desc}</motion.p>
                      <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} style={{ backgroundColor: BRAND_YELLOW }} className="px-10 py-4 rounded-xl font-black text-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"> {BANNERS[currentBanner].cta} </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button onClick={() => setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[#fbea27] hover:text-black transition-all"> <ChevronLeft size={24} /> </button>
                <button onClick={() => setCurrentBanner((prev) => (prev + 1) % BANNERS.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[#fbea27] hover:text-black transition-all"> <ChevronRight size={24} /> </button>
              </div>
            </section>

            {/* --- BEST SELLERS: NOW USING LIVE DATA --- */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <h3 className="text-2xl font-bold mb-8 text-black">Best Sellers in Screen Protection</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {liveProducts.filter(p => p.tag === 'Best Seller').map(prod => (
                    <div key={prod.id} className="border p-4 rounded hover:shadow-lg transition-all flex flex-col group text-black">
                      <Link href={`/product/${prod.id}`}>
                        <div className="aspect-[4/5] bg-gray-100 rounded mb-4 overflow-hidden">
                          <img src={prod.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <h5 className="font-medium text-xs line-clamp-2 h-8 mb-2 group-hover:text-blue-600 text-black">{prod.name}</h5>
                        <p className="text-lg font-black text-[#B12704] mb-4">₹{prod.price}</p>
                      </Link>
                      <button onClick={() => addToCart(prod)} style={{ backgroundColor: BRAND_YELLOW }} className="mt-auto py-2 rounded-md text-[10px] font-bold text-black border border-black/10 active:scale-95 transition-all uppercase">Add to Cart</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- ALL PRODUCTS: NOW USING LIVE DATA --- */}
            <section className="py-20 max-w-7xl mx-auto px-6">
              <div className="mb-12">
                <h2 className="text-3xl font-black uppercase italic mb-8 text-black">All Products</h2>
                <div className="flex gap-8 border-b border-gray-200 overflow-x-auto pb-4 no-scrollbar">
                  {[{ id: 'screen', label: 'Screen Protection' }, { id: 'camera', label: 'Camera Protection' }, { id: 'back', label: 'Back Protection' }, { id: 'combo', label: 'Combo' }].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveSubCategory(tab.id as any)} className={`text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all relative pb-4 ${activeSubCategory === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                      {tab.label}
                      {activeSubCategory === tab.id && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: BRAND_YELLOW }} />}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6"
                >
                  {liveProducts.filter(p => p.category === categoryMap[activeSubCategory]).map((prod) => (
                    <div key={prod.id} className="bg-white border p-4 rounded-2xl hover:shadow-lg transition-all flex flex-col group text-black">

                      {/* --- WRAPPER LINK START --- */}
                      <Link href={`/product/${prod.id}`} className="cursor-pointer">
                        <div className="relative aspect-[4/5] bg-gray-50 rounded-xl mb-4 overflow-hidden">
                          <span className="absolute top-2 left-2 z-10 bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {prod.tag}
                          </span>
                          <img
                            src={prod.images?.[0]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={prod.name}
                          />
                          {/* Note: The 'Add to Bag' button overlay is still visible on hover but we keep it separate from the link below */}
                        </div>
                        <h5 className="font-bold text-sm mb-1 truncate text-black group-hover:text-blue-600 transition-colors">
                          {prod.name}
                        </h5>
                        <p className="text-lg font-black text-[#B12704] mb-4">₹{prod.price}</p>
                      </Link>
                      {/* --- WRAPPER LINK END --- */}

                      {/* Keeping the 'Add to Bag' button separate so it doesn't trigger navigation */}
                      <div className="relative">
                        <button
                          onClick={() => { addToCart(prod); toggleCart(); }}
                          style={{ backgroundColor: BRAND_YELLOW }}
                          className="w-full py-3 rounded-xl text-[11px] font-black uppercase text-black shadow-xl active:scale-95 transition-all"
                        >
                          Add to Bag
                        </button>
                      </div>

                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </section>

          </>
        )}
      </main>

      <footer className="bg-[#131921] text-white py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-white">
          <div><h2 className="text-xl font-black italic mb-6">COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span></h2><p className="text-gray-400 text-sm leading-relaxed">India's leading brand for high-conversion protection tech.</p></div>
          <div><h4 className="font-bold mb-6 text-[#fbea27] uppercase text-xs tracking-widest">Shop</h4><ul className="text-sm text-gray-400 space-y-3"><li>iPhone Glass</li><li>Samsung Glass</li><li>Privacy Shields</li></ul></div>
          <div className="bg-[#232f3e] p-8 rounded-2xl"><h4 className="font-bold mb-4">Join the Capitol</h4><div className="flex bg-white rounded-lg p-1 overflow-hidden"><input type="text" placeholder="Email" className="flex-1 px-4 text-black text-xs outline-none" /><button style={{ backgroundColor: BRAND_YELLOW }} className="px-6 py-2 rounded-md text-black font-bold text-xs">GO</button></div></div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
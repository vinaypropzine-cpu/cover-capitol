"use client";

import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import {
  ShoppingBag, Search, Menu, ChevronRight, ChevronLeft, ShieldCheck, Zap,
  Smartphone, Sparkles, X, Trash2, User, ChevronDown, Package, Truck, CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from './useCartStore';
import { getProducts, getBanners, getCategoryTiles, getPromoBanners } from './lib/actions';
import { useAuth } from './context/AuthContext';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { buildSearchIndex, searchDocs } from './lib/search';

// --- Brand Theme ---
const BRAND_YELLOW = '#fbea27';

const REVIEWS = [
  { user: "Arjun V.", model: "iPhone 15 Pro", comment: "Dropped my phone from a moving bike. The Cover Capitol glass shattered but my screen is FLAWLESS. Ordering my 2nd one now!", rating: 5 },
  { user: "Sneha M.", model: "Galaxy S24 Ultra", comment: "The Privacy Shield is insane. Nobody can see my texts in the metro anymore. 10/10 recommendation.", rating: 5 },
  { user: "Rohan S.", model: "Pixel 8 Pro", comment: "Installation was so easy. Literally zero bubbles. Best ₹799 I've ever spent on my phone.", rating: 5 },
  { user: "Priya K.", model: "iPhone 13", comment: "Matte finish feels like butter. Amazing for gaming, no fingerprints at all!", rating: 5 },
  { user: "Rohan S.", model: "Pixel 8 Pro", comment: "Installation was so easy. Literally zero bubbles. Best ₹799 I've ever spent on my phone.", rating: 5 },
  { user: "Priya K.", model: "iPhone 13", comment: "Matte finish feels like butter. Amazing for gaming, no fingerprints at all!", rating: 5 },
];

const TABS_DATA = {
  categories: [
    { id: 1, name: 'Tempered Glass', count: '150+ Models', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400' },
    { id: 2, name: 'Camera Guard', count: '90+ Models', img: 'https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80&w=400' },
    { id: 3, name: 'Back ScreenGuard', count: '40+ Models', img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=400' },
    { id: 4, name: 'Combo', count: '200+ Designs', img: 'https://images.unsplash.com/photo-1603313011101-31c726a55d4c?q=80&w=400' },
  ],
};

export default function EcommerceSite() {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  
  // --- NEW STATES FOR HERO BANNERS ---
  const [dbBanners, setDbBanners] = useState<any[]>([]);
  const [dbCategoryTiles, setDbCategoryTiles] = useState<any[]>([]);

  // --- OFFER ANNOUNCEMENT SLIDESHOW (between preference & best sellers) ---
  const [dbPromoBanners, setDbPromoBanners] = useState<any[]>([]);
  const [promoEmblaRef, promoEmblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [promoSelectedIndex, setPromoSelectedIndex] = useState(0);
  const [heroEmblaRef, heroEmblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  // CONNECTED TO FIREBASE AUTH
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    const fetchFromAtlas = async () => {
      const data = await getProducts();
      setLiveProducts(data);
      // Fetch dynamic banners from MongoDB
      const fetchedBanners = await getBanners();
      setDbBanners(fetchedBanners);
      // Fetch the "Shop Your Preference" blocks (admin-managed images)
      const fetchedTiles = await getCategoryTiles();
      setDbCategoryTiles(fetchedTiles);
      // Fetch the clickable offer announcement banners
      const fetchedPromos = await getPromoBanners();
      setDbPromoBanners(fetchedPromos);
      setIsLoading(false);
    };
    fetchFromAtlas();
  }, []);

  // --- EMBLA DOT NAVIGATION TRACKER ---
  useEffect(() => {
    if (!heroEmblaApi) return;
    const onSelect = () => setSelectedIndex(heroEmblaApi.selectedScrollSnap());
    heroEmblaApi.on('select', onSelect);
    onSelect();
  }, [heroEmblaApi]);

  useEffect(() => {
    if (!promoEmblaApi) return;
    const onSelect = () => setPromoSelectedIndex(promoEmblaApi.selectedScrollSnap());
    promoEmblaApi.on('select', onSelect);
    onSelect();
  }, [promoEmblaApi]);

  const [searchQuery, setSearchQuery] = useState("");
  const { items, addToCart, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [activeSubCategory, setActiveSubCategory] = useState<'screen' | 'camera' | 'back' | 'combo'>('screen');
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

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

  // Unique brands derived from the products the admin has uploaded
  const liveBrands = [...new Set(liveProducts.map((p) => p.brand).filter(Boolean))].sort() as string[];
  // Brands whose /brands/<slug>.svg logo failed to load fall back to a monogram
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  // Build the search index once per product set (cheap re-search on every keystroke).
  const searchIndex = useMemo(() => buildSearchIndex(liveProducts), [liveProducts]);
  // useDeferredValue keeps typing snappy while results recompute without blocking input.
  const deferredQuery = useDeferredValue(searchQuery);
  const searchResults = useMemo(() => searchDocs(searchIndex, deferredQuery), [searchIndex, deferredQuery]);

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

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#131921] font-sans overflow-x-hidden">

      {/* 1. REUSABLE NAVBAR COMPONENT (Purged old hardcoded header) */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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

      <main className="pt-[150px] sm:pt-[104px]">
        {searchQuery.length > 0 ? (
          /* --- SEARCH RESULTS VIEW: FIXED DUPLICATE KEY ERRORS --- */
          <section className="py-16 max-w-7xl mx-auto px-6 min-h-screen">
            <div className="mb-8 border-b-4 border-black pb-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
                Results for “<span style={{ color: '#000' }}>{searchQuery}</span>”
              </h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {searchResults.map((prod, idx) => (
                  <ProductCard key={`${prod.id}-${idx}`} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
                <Search size={40} className="mx-auto text-zinc-300 mb-4" />
                <p className="text-black font-black uppercase">No products found for “{searchQuery}”</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Try a device name, brand, or protection type</p>
              </div>
            )}
          </section>
        ) : !mounted || isLoading ? (
          /* --- HIGH-FIDELITY SKELETON LOADING VIEW --- */
          <div className="w-full animate-pulse min-h-screen bg-[#F2F2F2]">
            <section className="relative w-full h-[calc(100vh-150px)] sm:h-[calc(100vh-104px)] flex flex-col bg-white overflow-hidden">
              <div className="flex-1 bg-zinc-200"></div>
              <div style={{ backgroundColor: BRAND_YELLOW }} className="w-full h-14 flex items-center overflow-hidden border-t border-black/5 shrink-0 z-10 relative opacity-50"></div>
            </section>
            
            <section className="py-20 max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-64 bg-zinc-200 rounded-md"></div>
                <div className="h-10 w-48 bg-zinc-100 rounded-lg border border-zinc-200"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="h-6 w-32 bg-zinc-200 rounded mb-4"></div>
                    <div className="aspect-square bg-zinc-100 rounded-lg mb-4"></div>
                    <div className="h-6 w-16 bg-zinc-200 rounded"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* --- NORMAL HOME PAGE VIEW --- */
          <>
            <section className="relative w-full h-[calc(100vh-150px)] sm:h-[calc(100vh-104px)] flex flex-col bg-white overflow-hidden">
              {/* 1. EMBLA CAROUSEL (Takes all remaining vertical space) */}
              <div className="flex-1 overflow-hidden relative bg-zinc-100" ref={heroEmblaRef}>
                <div className="flex h-full">
                  {dbBanners.length > 0 ? (
                    dbBanners.map((banner, idx) => (
                      <div key={banner._id || idx} className="relative flex-[0_0_100%] h-full">
                        {/* Browser picks the artwork matching the screen size; phones fall back to desktop art if no mobile image is set */}
                        <picture className="block w-full h-full">
                          {banner.mobileImageUrl && (
                            <source media="(max-width: 639px)" srcSet={banner.mobileImageUrl} />
                          )}
                          <img
                            src={banner.imageUrl}
                            className="w-full h-full object-cover"
                            alt={`Hero Slide ${idx + 1}`}
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>
                    ))
                  ) : (
                     <div className="relative flex-[0_0_100%] h-full flex flex-col items-center justify-center bg-zinc-100">
                       <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No Banners Active</p>
                     </div>
                  )}
                </div>

                {/* DOT NAVIGATION */}
                {dbBanners.length > 1 && (
                  <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3 z-10">
                    {dbBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => heroEmblaApi?.scrollTo(idx)}
                        className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                          selectedIndex === idx ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 2. THE ANCHORED TICKER TAPE (Preserved perfectly) */}
              <div style={{ backgroundColor: BRAND_YELLOW }} className="w-full h-14 flex items-center overflow-hidden border-t border-black/5 shrink-0 z-10 relative shadow-[0px_-4px_15px_rgba(0,0,0,0.15)]">
                <div className="flex whitespace-nowrap animate-ticker">
                  {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-10 text-black font-black text-[10px] uppercase tracking-widest">{item.icon} {item.text}</div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- BEST SELLERS (moved directly below the hero) --- */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-end justify-between gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Most Loved</p>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">Best Sellers</h2>
                  </div>
                  <Link href="/best-sellers" className="shrink-0 text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-[#fbea27] pb-1 hover:border-black transition-all flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {liveProducts.filter(p => p.tag === 'best seller')
                    .slice(0, 5)
                    .map((prod, idx) => (
                      <ProductCard key={`${prod.id}-${idx}`} product={prod} />
                    ))}
                </div>
              </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold text-black">Shop Your Preference</h3>
                <div className="flex bg-white rounded-lg border p-1 shadow-sm">
                  <button onClick={() => setActiveTab('categories')} className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'categories' ? 'bg-[#232f3e] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Category</button>
                  <button onClick={() => setActiveTab('brands')} className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'brands' ? 'bg-[#232f3e] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Brand</button>
                </div>
              </div>
              {activeTab === 'categories' ? (
                /* Compact circular category icons (admin-managed) */
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-8">
                  {(dbCategoryTiles.length > 0 ? dbCategoryTiles : TABS_DATA.categories).map((item: any) => (
                    <Link
                      key={item._id || item.id}
                      href={`/shop?category=${encodeURIComponent(item.name)}`}
                      className="group flex flex-col items-center gap-3 w-24 sm:w-32"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-zinc-100 border-2 border-transparent shadow-sm group-hover:border-black group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                        <img src={item.imageUrl || item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-center text-zinc-700 group-hover:text-black transition-colors leading-tight">{item.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Compact circular brand logos derived from admin-uploaded products */
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-8">
                  {liveBrands.map((brand) => {
                    const slug = brand.toLowerCase().replace(/ /g, '-');
                    return (
                      <Link
                        key={brand}
                        href={`/brand/${slug}`}
                        className="group flex flex-col items-center gap-3 w-24 sm:w-32"
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white border-2 border-black/10 shadow-sm group-hover:border-black group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex items-center justify-center p-6">
                          {failedLogos[slug] ? (
                            <span className="text-2xl font-black text-black">{brand.charAt(0).toUpperCase()}</span>
                          ) : (
                            <img
                              src={`/brands/${slug}.svg`}
                              alt={`${brand} logo`}
                              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                              onError={() => setFailedLogos((prev) => ({ ...prev, [slug]: true }))}
                            />
                          )}
                        </div>
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-center text-zinc-700 group-hover:text-black transition-colors leading-tight">{brand}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* --- CLICKABLE OFFER ANNOUNCEMENT SLIDESHOW (admin-managed) --- */}
            {dbPromoBanners.length > 0 && (
              <section className="pb-20 max-w-7xl mx-auto px-4">
                <div className="relative overflow-hidden rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" ref={promoEmblaRef}>
                  <div className="flex">
                    {dbPromoBanners.map((banner, idx) => (
                      <Link
                        key={banner._id || idx}
                        href={banner.linkUrl || '/'}
                        className="relative flex-[0_0_100%] block group"
                      >
                        <img
                          src={banner.imageUrl}
                          className="w-full h-[22rem] md:h-[30rem] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          alt={`Offer announcement ${idx + 1}`}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* DOT NAVIGATION */}
                  {dbPromoBanners.length > 1 && (
                    <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 z-10 pointer-events-none">
                      {dbPromoBanners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => promoEmblaApi?.scrollTo(idx)}
                          className={`w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-300 pointer-events-auto ${
                            promoSelectedIndex === idx ? 'bg-white scale-125' : 'bg-transparent hover:bg-white/50'
                          }`}
                          aria-label={`Go to offer ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* --- ALL PRODUCTS --- */}
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Browse The Full Range</p>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 text-black">All Products</h2>
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
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {liveProducts
                    .filter(p => p.category === categoryMap[activeSubCategory])
                    .slice(0, 4)
                    .map((prod, idx) => (
                      <ProductCard key={`${prod.id}-${idx}`} product={prod} />
                    ))}
                </motion.div>
              </AnimatePresence>
              <div className="mt-12 flex justify-center">
                <Link href={`/shop?category=${encodeURIComponent(categoryMap[activeSubCategory])}`} className="px-10 py-3 border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  View All {categoryMap[activeSubCategory]}
                </Link>
              </div>
            </section>

            {/* --- TOP RATED SECTION --- */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Community Favorites</p>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">Top Rated Protection</h2>
                  </div>
                  <Link href="/shop?tag=top%20rated" className="shrink-0 text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-[#fbea27] pb-1 hover:border-black transition-all flex items-center gap-1">
                    Explore All <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                  {liveProducts
                    .filter(p => p.tag === 'top rated')
                    .slice(0, 4)
                    .map((prod, idx) => (
                      <ProductCard key={`${prod.id}-${idx}`} product={prod} />
                    ))}
                </div>
              </div>
            </section>

            {/* --- BIGGEST DEALS (sorted by real MRP savings) --- */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white px-3 py-1.5 rounded-md font-black uppercase text-[11px] tracking-widest">Deals</span>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">Biggest Savings</h2>
                  </div>
                  <Link href="/best-sellers" className="shrink-0 text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-red-600 pb-1 hover:border-black transition-all flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                  {liveProducts
                    .filter(p => Number(p.compareAtPrice) > Number(p.price) && p.tag !== 'test product')
                    .sort((a, b) => (Number(b.compareAtPrice) - Number(b.price)) - (Number(a.compareAtPrice) - Number(a.price)))
                    .slice(0, 4)
                    .map((prod, idx) => (
                      <ProductCard key={`${prod.id}-${idx}`} product={prod} />
                    ))}
                </div>
              </div>
            </section>

            {/* --- TRUST / GUARANTEE BAND --- */}
            <section className="py-16 bg-[#131921] text-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: <ShieldCheck size={28} />, title: '9H Hardness', desc: 'Military-grade tempered glass built to survive drops.' },
                    { icon: <Zap size={28} />, title: 'Bubble-Free Fit', desc: 'Precision-cut for a flawless, bubble-free install.' },
                    { icon: <Package size={28} />, title: '7-Day Replacement', desc: 'Not happy? Hassle-free replacement, no questions.' },
                    { icon: <Truck size={28} />, title: 'Free Delivery ₹499+', desc: 'Fast express shipping with Cash on Delivery.' },
                  ].map((item) => (
                    <div key={item.title} className="flex flex-col items-center text-center gap-3">
                      <div style={{ color: BRAND_YELLOW }} className="w-14 h-14 rounded-full border-2 border-white/15 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h4 className="font-black uppercase text-sm tracking-wide">{item.title}</h4>
                      <p className="text-[11px] font-medium text-zinc-400 leading-relaxed max-w-[180px]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 bg-white border-t-4 border-black overflow-hidden relative group">
              <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                  <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">What Our Citizens Say</p>
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-black">
                    OUR <span className="bg-[#fbea27] px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">TESTIMONIALS</span>
                  </h2>
                </div>
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-5 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#fbea27] transition-all -translate-x-1/2 hidden md:flex items-center justify-center active:translate-y-[-48%] active:shadow-none"
                >
                  <ChevronLeft size={28} className="text-black" />
                </button>
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-5 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#fbea27] transition-all translate-x-1/2 hidden md:flex items-center justify-center active:translate-y-[-48%] active:shadow-none"
                >
                  <ChevronRight size={28} className="text-black" />
                </button>
                <div className="overflow-hidden cursor-grab active:cursor-grabbing px-4" ref={emblaRef}>
                  <div className="flex gap-8">
                    {REVIEWS.map((rev, idx) => (
                      <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_33.33%] min-w-0 px-4">
                        <div className="h-full bg-white border-2 border-black/10 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                          <div>
                            <span className="text-5xl font-serif text-[#fbea27] leading-none italic select-none">“</span>
                            <p className="text-zinc-700 font-medium text-lg leading-relaxed mt-[-10px]">
                              {rev.comment}
                            </p>
                          </div>
                          <div className="mt-10 pt-6 border-t border-zinc-100 flex items-center justify-between">
                            <div>
                              <h4 className="text-black font-black uppercase text-sm">{rev.user}</h4>
                              <p className="text-zinc-400 font-bold text-[9px] uppercase tracking-widest">{rev.model}</p>
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Sparkles key={i} size={14} fill={BRAND_YELLOW} className="text-black" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* REUSABLE FOOTER ENGINES */}
      <Footer />

      <style jsx global>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
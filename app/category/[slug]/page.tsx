'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ShieldCheck, Zap, X, Trash2, Package, ShoppingBag
} from 'lucide-react';
import { useCartStore } from '@/app/useCartStore';
import { getProducts } from '@/app/lib/actions';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const BRAND_YELLOW = '#fbea27';

const SLUG_TO_CATEGORY: Record<string, string> = {
  'tempered-glass': 'Tempered Glass',
  'camera-guard': 'Camera Guard',
  'back-screenguard': 'Back ScreenGuard',
  'combo': 'Combo'
};

export default function CategoryListingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // --- ADDED LOADING STATE ---
  const [isLoading, setIsLoading] = useState(true);

  const { items, addToCart, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;
      setCategoryName(SLUG_TO_CATEGORY[slug] || slug);
      
      const products = await getProducts();
      setAllProducts(products || []);
      // --- TURN OFF LOADING WHEN DATA ARRIVES ---
      setIsLoading(false);
    };
    loadProducts();
  }, [params]);

  const handleDeviceToggle = (device: string) => {
    setSelectedDevices(prev => 
      prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device]
    );
  };

  const handleSubCatToggle = (subCat: string) => {
    setSelectedSubCats(prev => 
      prev.includes(subCat) ? prev.filter(s => s !== subCat) : [...prev, subCat]
    );
  };

  const handlePriceToggle = (maxPrice: number) => {
    setSelectedPrices(prev => 
      prev.includes(maxPrice) ? prev.filter(p => p !== maxPrice) : [...prev, maxPrice]
    );
  };

  const filteredProducts = allProducts.filter((p: any) => {
    const matchesCategory = p.category?.toLowerCase() === categoryName.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "";
    const matchesDevice = selectedDevices.length === 0 || 
      selectedDevices.some(d => p.deviceType?.toLowerCase() === d.toLowerCase());
    const matchesSubCat = selectedSubCats.length === 0 || 
      selectedSubCats.some(s => p.subCategory?.toLowerCase() === s.toLowerCase());
    const matchesPrice = selectedPrices.length === 0 || 
      selectedPrices.some(maxPrice => Number(p.price) <= maxPrice);

    return matchesCategory && matchesSearch && matchesDevice && matchesSubCat && matchesPrice;
  });

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
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleCart} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[201] shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-[#131921] text-white">
                <h2 className="text-lg font-bold">Shopping Cart ({totalItems()})</h2>
                <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm text-black">
                      <img src={item.images[0]} className="w-20 h-20 object-cover rounded-md" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-red-600 font-black text-sm mt-1">₹{item.price}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold uppercase text-[10px] tracking-widest text-zinc-400">Subtotal:</span>
                  <span className="text-xl font-black text-black">
                    ₹{items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                  </span>
                </div>
                <button onClick={handlePayment} style={{ backgroundColor: BRAND_YELLOW }} className="w-full py-4 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-0 transition-all text-black">Proceed to Buy</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-44 sm:pt-40 pb-20 flex flex-col md:flex-row gap-10">

        {/* LEFT SIDEBAR: Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 border-r-2 border-black/5 pr-0 md:pr-8 flex flex-col gap-10 text-left">
          <div className="border-b-4 border-black pb-2 mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Refine Collection</h3>
          </div>

          <div>
            <h4 className="text-[9px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Device Type</h4>
            <div className="flex flex-col gap-3">
              {[
                { id: "Mobile", label: "Mobile" },
                { id: "Tablet", label: "Tablet" },
                { id: "Smartwatch", label: "Smartwatch" }
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedDevices.includes(item.id)}
                    onChange={() => handleDeviceToggle(item.id)}
                    className="w-4 h-4 border-2 border-black rounded-none accent-black cursor-pointer" 
                  />
                  <span className={`text-xs font-bold transition-all uppercase ${selectedDevices.includes(item.id) ? 'text-black font-black' : 'text-zinc-500 group-hover:text-black'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Category Type</h4>
            <div className="flex flex-col gap-3">
              {[
                { id: "Normal", label: "Normal" },
                { id: "UV", label: "UV" },
                { id: "Edge to Edge Membrane", label: "Edge to Edge Membrane" }
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedSubCats.includes(item.id)}
                    onChange={() => handleSubCatToggle(item.id)}
                    className="w-4 h-4 border-2 border-black rounded-none accent-black cursor-pointer" 
                  />
                  <span className={`text-xs font-bold transition-all uppercase ${selectedSubCats.includes(item.id) ? 'text-black font-black' : 'text-zinc-500 group-hover:text-black'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Price Filter</h4>
            <div className="flex flex-col gap-3">
              {[
                { val: 199, label: "Under ₹199" },
                { val: 299, label: "Under ₹299" },
                { val: 399, label: "Under ₹399" },
                { val: 499, label: "Under ₹499" }
              ].map((tier) => (
                <label key={tier.val} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedPrices.includes(tier.val)}
                    onChange={() => handlePriceToggle(tier.val)}
                    className="w-4 h-4 border-2 border-black rounded-none accent-black cursor-pointer" 
                  />
                  <span className={`text-xs font-bold transition-all uppercase ${selectedPrices.includes(tier.val) ? 'text-black font-black' : 'text-zinc-500 group-hover:text-black'}`}>
                    {tier.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Product Grid */}
        <main className="flex-1 text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b-4 border-black pb-4 gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">
                {categoryName} <span className="text-[#fbea27] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Vault</span>
              </h2>
              {!isLoading && (
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  {filteredProducts.length} Premium items identified
                </p>
              )}
            </div>
          </div>

          {/* --- CONDITIONAL RENDERING: SKELETON VS ACTUAL DATA --- */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border-2 border-black/5 p-4 bg-white">
                  <div className="aspect-[4/5] bg-zinc-200 mb-4 rounded-sm"></div>
                  <div className="h-4 w-3/4 bg-zinc-200 mb-2 rounded-sm"></div>
                  <div className="h-5 w-1/4 bg-zinc-300 mb-4 rounded-sm"></div>
                  <div className="h-10 w-full bg-zinc-200 rounded-sm"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod, idx) => (
                <div key={`${prod.id}-${idx}`} className="group border-2 border-black/5 p-4 hover:border-black transition-all bg-white relative shadow-sm">
                  <Link href={`/product/${prod.id}`} className="block aspect-[4/5] bg-zinc-50 mb-4 overflow-hidden relative border border-black/5">
                    <span className="absolute top-2 left-2 z-10 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">{prod.tag || 'In Stock'}</span>
                    <img src={prod.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={prod.name} />
                  </Link>
                  <h4 className="font-black uppercase text-[11px] mb-1 truncate tracking-tight text-black">{prod.name}</h4>
                  <p className="text-lg font-black text-red-600 mb-4">₹{prod.price}</p>
                  <button onClick={() => { addToCart(prod); toggleCart(); }} style={{ backgroundColor: BRAND_YELLOW }} className="w-full py-3 font-black uppercase text-[10px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-black">Add To Cart</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-zinc-50 border-2 border-dashed border-zinc-200">
              <Package size={48} className="mx-auto text-zinc-300 mb-4" />
              <p className="font-black uppercase text-zinc-400 text-xs">The Vault is empty for current parameters</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
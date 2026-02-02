'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, ChevronDown, Filter,
  ShieldCheck, Zap, ChevronRight, X, Trash2
} from 'lucide-react';
// 1. Importing the same Cart Store used on the Home Page
import { useCartStore } from '@/app/useCartStore';
import { getProducts } from '@/app/lib/actions'; //

const BRAND_YELLOW = '#fbea27';

const SLUG_TO_CATEGORY: Record<string, string> = {
  'tempered-glass': 'Tempered Glass',
  'camera-guard': 'Camera Guard',
  'back-screenguard': 'Back ScreenGuard',
  'combo': 'Combo'
};

const SCREEN_PROTECTION_MODES = [
  { name: 'Tempered Glass', img: '/tempered-glass.jpg' },
  { name: 'Camera Guard', img: '/camera-guard.jpg' },
  { name: 'Back ScreenGuard', img: '/back-screenguard.jpg' },
  { name: 'Combo', img: '/combo.jpg' }
];

const DEVICE_BRANDS = [
  { brand: 'Apple', models: ['iPhone 15', 'iPhone 14', 'iPhone 13'] },
  { brand: 'Samsung', models: ['Galaxy S24', 'Galaxy S23', 'Galaxy A54'] },
  { brand: 'OnePlus', models: ['OnePlus 12', 'OnePlus 11', 'OnePlus 10'] },
  { brand: 'Xiaomi', models: ['Redmi Note 13', 'Mi 14', 'Poco X5'] }
];

// Next.js 15 requires params to be handled as a Promise
export default function CategoryListingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { items, addToCart, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [categoryName, setCategoryName] = React.useState<string>('');

  React.useEffect(() => {
    const loadProducts = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;
      setCategoryName(SLUG_TO_CATEGORY[slug] || slug);
      const products = await getProducts();
      setAllProducts(products || []);
    };
    loadProducts();
  }, [params]);

  // 3. Filter with case-insensitive check to avoid string mismatches
  const filteredProducts = allProducts.filter((p: any) =>
    p.category?.toLowerCase() === categoryName.toLowerCase()
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

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#131921] font-sans">

      {/* Announcement Bar */}
      <div style={{ backgroundColor: BRAND_YELLOW }} className="py-2 text-center border-b border-black/5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center justify-center gap-2">
          <ShieldCheck size={14} />
          Free express delivery on all orders above ₹499
          <Zap size={14} fill="black" />
        </p>
      </div>

      {/* Navigation */}
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
            <input type="text" placeholder="Search for screen guards, privacy glass..." className="flex-1 px-4 text-sm text-black outline-none bg-white" />
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

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex gap-4" style={{ marginBottom: '100px' }}>
        <button className="flex items-center gap-2 bg-white px-6 py-2 rounded-lg border text-xs font-bold shadow-sm">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 bg-white px-6 py-2 rounded-lg border text-xs font-bold shadow-sm">
          Sort By <ChevronDown size={14} />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-20 min-h-[400px]">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod: any) => (
              <div key={prod.id} className="bg-white border p-4 rounded-2xl hover:shadow-xl transition-all flex flex-col group">
                <Link href={`/product/${prod.id}`} className="relative aspect-[4/5] bg-gray-50 rounded-xl mb-4 overflow-hidden">
                  <span className="absolute top-2 left-2 z-10 bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {prod.tag || 'New'}
                  </span>
                  <img src={prod.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={prod.name} />
                </Link>
                <h5 className="font-bold text-sm mb-1 truncate text-black">{prod.name}</h5>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-black text-[#B12704]">₹{prod.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹1,299</span>
                </div>
                <button onClick={() => addToCart(prod)} style={{ backgroundColor: BRAND_YELLOW }} className="mt-auto py-2 rounded-md text-[10px] font-bold text-black border border-black/10 active:scale-95 transition-all uppercase">Add to Cart</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No products found</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
              We couldn't find any items in <span className="font-bold text-black">{categoryName}</span>.
              Check your Admin Dashboard to ensure products are assigned this category.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-[#131921] text-white py-20 border-t border-white/10 mt-10 " style={{ marginTop: '40px' }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div><h2 className="text-xl font-black italic mb-6">COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span></h2></div>
        </div>
      </footer>
    </div>
  );
}

// Simple internal icon component if Lucide's PackageSearch isn't imported
function PackageSearch({ size, className }: any) {
  return <div className={className} style={{ fontSize: size }}>📦</div>;
}
"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, ChevronDown, ShieldCheck, Zap, X, Trash2, Menu 
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useCartStore } from '../useCartStore'; // Adjust path if needed

const BRAND_YELLOW = '#fbea27';

const DEVICE_BRANDS = [
  { brand: 'Apple', models: ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 16'] },
  { brand: 'Samsung', models: ['Galaxy S24', 'S23 Ultra', 'Z Fold'] },
  { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 7a', 'Pixel 6'] },
];

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { items, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();

  return (
    <header className="fixed top-0 w-full z-[100] bg-[#131921] text-white">
      {/* 1. Announcement Bar */}
      <div style={{ backgroundColor: BRAND_YELLOW }} className="py-2 text-center border-b border-black">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> FREE EXPRESS DELIVERY ON ALL ORDERS ABOVE ₹499 <Zap size={14} fill="black" />
        </p>
      </div>

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 md:gap-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <img src="/logo.svg" alt="Cover Capital Logo" className="w-11 h-11 object-contain" />
          <h1 className="text-xl font-black tracking-tight italic">COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span></h1>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex h-10 overflow-hidden rounded-md">
          <input
            type="text"
            placeholder="Search for screen guards..."
            className="flex-1 px-4 text-sm text-black outline-none bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={{ backgroundColor: BRAND_YELLOW }} className="px-5 text-black hover:brightness-90 transition-all">
            <Search size={20} />
          </button>
        </div>

        {/* Clerk & Cart Buttons */}
        <div className="flex items-center gap-4 md:gap-6">
          <SignedOut>
            <SignInButton mode="modal" appearance={{
              elements: {
                formButtonPrimary: 'bg-[#fbea27] text-black font-black uppercase rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all',
                card: 'border-4 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]',
                headerTitle: 'font-black uppercase italic text-2xl',
              }
            }}>
              <button className="text-[10px] font-black uppercase border-2 border-white px-5 py-2 hover:bg-[#fbea27] hover:text-black hover:border-[#fbea27] transition-all">
                login / signup
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="hidden md:block text-right">
                <p className="text-[8px] font-black uppercase text-[#fbea27]">Citizen Verified</p>
                <p className="text-[10px] font-bold">MY ACCOUNT</p>
              </div>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "border-2 border-[#fbea27] w-9 h-9" } }} />
            </div>
          </SignedIn>

          <div className="relative cursor-pointer flex items-center gap-1 group" onClick={toggleCart}>
            <ShoppingBag size={24} style={{ color: BRAND_YELLOW }} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems()}</span>
            <span className="text-xs font-bold self-end hidden sm:block">Cart</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Nav Navigation */}
      <div className="bg-[#232f3e] border-t border-white/5 overflow-x-auto">
        <nav className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center gap-8 text-xs font-bold whitespace-nowrap">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2" onMouseEnter={() => setActiveMenu('screen')} onMouseLeave={() => setActiveMenu(null)}>
            Screen Protection <ChevronDown size={12} />
          </div>
          <Link href="/category/camera-guard" className="hover:text-[#fbea27] transition-colors uppercase">Camera Guard</Link>
          <Link href="/category/back-screenguard" className="hover:text-[#fbea27] transition-colors uppercase">Back ScreenGuard</Link>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2" onMouseEnter={() => setActiveMenu('device')} onMouseLeave={() => setActiveMenu(null)}>
            Shop By Device <ChevronDown size={12} />
          </div>
          <Link href="/best-sellers" className="hover:text-[#fbea27] transition-colors uppercase">Best Sellers</Link>
        </nav>
      </div>

      {/* Dropdown Menu Logic (Ported from page.tsx) */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setActiveMenu(activeMenu)} onMouseLeave={() => setActiveMenu(null)}
            className="fixed top-[104px] left-0 w-full bg-white shadow-2xl border-b-4 border-black z-[99]"
          >
            <div className="max-w-7xl mx-auto p-10 grid grid-cols-3 gap-12 text-black">
               {/* Dropdown content here (Same as your screen/device mapping) */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
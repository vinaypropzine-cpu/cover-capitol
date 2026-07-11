"use client";

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, ChevronDown, ShieldCheck, Zap, X, Trash2, Menu, User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../useCartStore';
import { useAuth } from '../context/AuthContext'; 
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'; 
import { getAnnouncement, getDeviceBrands, getScreenMenus } from '../lib/actions'; // Import the backend actions

const BRAND_YELLOW = '#fbea27';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { items, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();
  const { user, logout } = useAuth(); 

  // --- DYNAMIC ANNOUNCEMENT & DEVICE STATES ---
  const [promo, setPromo] = useState({ 
    text: "FREE EXPRESS DELIVERY ON ALL ORDERS ABOVE ₹499", 
    isActive: true 
  });
  const [dbDevices, setDbDevices] = useState<any[]>([]); // New state for devices
  const [dbScreenMenus, setDbScreenMenus] = useState<any[]>([]); // New state

  useEffect(() => {
    const fetchNavbarData = async () => {
      const promoData = await getAnnouncement();
      if (promoData) setPromo(promoData);

      const deviceData = await getDeviceBrands();
      if (deviceData) setDbDevices(deviceData);

      const screenMenuData = await getScreenMenus();
      if (screenMenuData) setDbScreenMenus(screenMenuData);
    };
    fetchNavbarData();
  }, []);

  // --- OTP LOGIN STATES ---
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState("");

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {
        console.log("Resetting verifier footprint.");
      }
      (window as any).recaptchaVerifier = null;
    }
    const { RecaptchaVerifier } = require("firebase/auth");
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => console.log("Recaptcha verified")
    });
  };

  const sendOTP = async () => {
    setError("");
    console.log("Vault API Key Check:", auth.config.apiKey);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error("Error payload traced:", err);
      setError("Failed to send code. Network endpoint rejected initialization.");
    }
  };

  // Screen Protection dropdown: navbar wording maps to product fields --
  // "Shop By Device" -> deviceType, "Shop By Type" -> subCategory,
  // "Shop By Category" -> finish (types[].name). All within Tempered Glass.
  const screenMenuHref = (menuTitle: string, item: string) => {
    const t = (menuTitle || '').toLowerCase();
    const param = t.includes('device') ? 'device' : t.includes('type') ? 'type' : 'finish';
    return `/shop?category=tempered-glass&${param}=${encodeURIComponent(item)}`;
  };

  const verifyOTP = async () => {
    setError("");
    try {
      await confirmationResult.confirm(otp);
      setShowLogin(false);
      setStep('phone');
      setPhone("");
      setOtp("");
    } catch (err: any) {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <header className="fixed top-0 w-full z-[100] bg-[#131921] text-white">
      {/* 1. DYNAMIC Announcement Bar */}
      {promo.isActive && (
        <div style={{ backgroundColor: BRAND_YELLOW }} className="py-2 px-3 text-center border-b border-black">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="shrink-0" /> <span className="truncate">{promo.text}</span> <Zap size={14} fill="black" className="shrink-0" />
          </p>
        </div>
      )}

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 md:gap-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <Image src="/logo.svg" alt="Cover Capital logo" width={40} height={40} className="h-9 w-9 sm:h-10 sm:w-10" priority />
          <h1 className="text-lg sm:text-xl font-black tracking-tight italic">COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span></h1>
        </Link>

        {/* Search Bar (desktop / tablet) */}
        <div className="hidden sm:flex flex-1 h-10 overflow-hidden rounded-md group border-2 border-transparent focus-within:border-[#fbea27] transition-all">
          <input
            type="text"
            placeholder="Search for screen guards..."
            className="flex-1 min-w-0 px-4 text-sm text-black outline-none bg-white font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={{ backgroundColor: BRAND_YELLOW }} className="px-5 text-black hover:brightness-90 transition-all flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>

        {/* Auth & Cart */}
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              aria-label="Login / Signup"
              className="relative p-1 group cursor-pointer"
            >
              <User size={26} className="text-white group-hover:text-[#fbea27] transition-colors" />
              <Zap size={15} fill={BRAND_YELLOW} className="absolute -bottom-0.5 -right-1.5 text-[#131921] rotate-[15deg]" />
            </button>
          ) : (
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="hidden md:block text-right">
                <p className="text-[8px] font-black uppercase text-[#fbea27]">Citizen Verified</p>
                <p className="text-[10px] font-bold">{user.phoneNumber}</p>
              </div>
              <button onClick={logout} className="p-2 border border-white/20 rounded-full hover:bg-red-500 hover:border-red-500 transition-all">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="relative cursor-pointer flex items-center gap-1 group" onClick={toggleCart}>
            <ShoppingBag size={24} style={{ color: BRAND_YELLOW }} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-black/10">{totalItems()}</span>
            <span className="text-xs font-bold self-end hidden sm:block">Cart</span>
          </div>
        </div>
      </div>

      {/* 2b. Mobile Search Row (full width, own line) */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex h-10 overflow-hidden rounded-md border-2 border-transparent focus-within:border-[#fbea27] transition-all">
          <input
            type="text"
            placeholder="Search for screen guards..."
            className="flex-1 min-w-0 px-4 text-sm text-black outline-none bg-white font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={{ backgroundColor: BRAND_YELLOW }} className="px-4 text-black hover:brightness-90 transition-all flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 3. Sub-Nav Navigation */}
      <div className="bg-[#232f3e] border-t border-white/5 overflow-x-auto no-scrollbar">
        <nav className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-start md:justify-center gap-6 md:gap-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2"
            onMouseEnter={() => setActiveMenu('screen')}
            onMouseLeave={() => setActiveMenu(null)}
            onClick={() => setActiveMenu(activeMenu === 'screen' ? null : 'screen')}
          >
            Screen Protection <ChevronDown size={12} />
          </div>
          <Link href="/category/camera-guard" className="hover:text-[#fbea27] transition-colors">Camera Guard</Link>
          <Link href="/category/back-screenguard" className="hover:text-[#fbea27] transition-colors">Back ScreenGuard</Link>
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-[#fbea27] transition-colors py-2"
            onMouseEnter={() => setActiveMenu('device')}
            onMouseLeave={() => setActiveMenu(null)}
            onClick={() => setActiveMenu(activeMenu === 'device' ? null : 'device')}
          >
            Shop By Device <ChevronDown size={12} />
          </div>
          <Link href="/best-sellers" className="hover:text-[#fbea27] transition-colors">Best Sellers</Link>
          <Link href="/deals" className="hover:text-orange-400 transition-colors">Deals</Link>
        </nav>
      </div>

      {/* --- DROP DOWN MENUS --- */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setActiveMenu(activeMenu)} onMouseLeave={() => setActiveMenu(null)}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-b-4 border-black z-[99] max-h-[65vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-black">
              {activeMenu === 'screen' ? (
                <>
                  {dbScreenMenus.map((menu) => (
                    <div key={menu._id || menu.title} className="flex flex-col gap-4">
                      <h4 className="font-black uppercase text-xs border-b-2 border-black pb-2 tracking-widest">{menu.title}</h4>
                      <ul className="flex flex-col gap-2">
                        {menu.items.map((item: string) => (
                          <li key={item}>
                            <Link
                              href={screenMenuHref(menu.title, item)}
                              onClick={() => setActiveMenu(null)}
                              className="block text-zinc-500 font-bold hover:text-black hover:translate-x-1 transition-all cursor-pointer uppercase text-[10px]"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              ) : (
                /* DYNAMIC DATABASE RENDER */
                dbDevices.map(brandGroup => (
                  <div key={brandGroup.brand} className="flex flex-col gap-4">
                    <Link
                      href={`/brand/${brandGroup.brand.toLowerCase().replace(/ /g, '-')}`}
                      onClick={() => setActiveMenu(null)}
                      className="font-black uppercase text-xs border-b-2 border-black pb-2 tracking-widest hover:text-zinc-600 transition-colors"
                    >
                      {brandGroup.brand}
                    </Link>
                    <ul className="flex flex-col gap-2">
                      {brandGroup.models.map((model: string) => (
                        <li key={model}>
                          <Link
                            href={`/shop?model=${encodeURIComponent(model)}`}
                            onClick={() => setActiveMenu(null)}
                            className="block text-zinc-500 font-bold hover:text-black hover:translate-x-1 transition-all cursor-pointer uppercase text-[10px]"
                          >
                            {model}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- OTP LOGIN MODAL --- */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogin(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-sm bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(251,234,39,1)]">
              <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-black hover:rotate-90 transition-all"><X size={24} /></button>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-black">Citizen <span className="text-[#fbea27] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Entry</span></h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-8">Access the display protection vault</p>

              <div id="recaptcha-container"></div>

              {step === 'phone' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-black border-r border-black/10 pr-3">+91</span>
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-black p-4 pl-16 font-bold outline-none focus:bg-zinc-50 text-black" />
                  </div>
                  {error && <p className="text-red-500 text-[10px] font-black uppercase">{error}</p>}
                  <button
                    type="button" 
                    onClick={sendOTP}
                    style={{ backgroundColor: BRAND_YELLOW }}
                    className="w-full py-4 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-black"
                  >
                    Send Verification Code
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <input type="text" placeholder="6-Digit Code" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border-2 border-black p-4 font-bold outline-none text-center text-2xl tracking-[0.5em] text-black" />
                  {error && <p className="text-red-500 text-[10px] font-black uppercase">{error}</p>}
                  <button
                    type="button" 
                    onClick={verifyOTP}
                    style={{ backgroundColor: BRAND_YELLOW }}
                    className="w-full py-4 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-black"
                  >
                    Verify & Enter
                  </button>
                  <button onClick={() => setStep('phone')} className="w-full text-[10px] font-black uppercase text-zinc-400 hover:text-black">Edit Number</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

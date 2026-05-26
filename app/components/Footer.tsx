"use client";

import React from 'react';
import Link from 'next/link';

const BRAND_YELLOW = '#fbea27';

export default function Footer() {
  return (
    <footer className="bg-[#131921] text-white py-20 border-t border-white/10 text-left w-full">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        
        {/* Brand Core Column */}
        <div>
          <h2 className="text-xl font-black tracking-tight italic mb-6 uppercase">
            COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            India's leading brand for high-conversion protection tech.
          </p>
        </div>

        {/* Shop Category Navigation Links */}
        <div>
          <h4 className="font-bold mb-6 text-[#fbea27] uppercase text-xs tracking-widest">Shop</h4>
          <ul className="text-sm text-gray-400 space-y-3 font-medium">
            <li>
              <Link href="/category/tempered-glass" className="hover:text-white transition-colors uppercase text-xs">
                iPhone Glass
              </Link>
            </li>
            <li>
              <Link href="/category/tempered-glass" className="hover:text-white transition-colors uppercase text-xs">
                Samsung Glass
              </Link>
            </li>
            <li>
              <Link href="/category/tempered-glass" className="hover:text-white transition-colors uppercase text-xs">
                Privacy Shields
              </Link>
            </li>
          </ul>
        </div>

        {/* Reusable Blank Link Column for Expansion */}
        <div>
          <h4 className="font-bold mb-6 text-[#fbea27] uppercase text-xs tracking-widest">Support</h4>
          <ul className="text-sm text-gray-400 space-y-3 font-medium">
            <li><span className="cursor-pointer hover:text-white transition-colors uppercase text-xs">Track Order</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors uppercase text-xs">Terms of Service</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors uppercase text-xs">Privacy Vault</span></li>
          </ul>
        </div>

        {/* Brutalist Newsletter Target Form Widget */}
        {/* Brutalist Newsletter Target Form Widget */}
        <div className="bg-[#232f3e] p-8 rounded-2xl border border-white/5 shadow-md">
          <h4 className="font-bold mb-4 uppercase text-sm tracking-tight">Join the Capitol</h4>
          <p className="text-xs text-gray-400 mb-4 leading-normal">Get instant alerts on premium inventory drops and flash sale deals.</p>
          
          {/* UPDATED Container: Fixed layout width clipping using clean flex properties */}
          <div className="flex w-full bg-white rounded-lg p-1 overflow-hidden border-2 border-transparent focus-within:border-[#fbea27] transition-all">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full min-w-0 px-3 text-black text-xs font-bold outline-none bg-white" 
              required
            />
            <button 
              type="button"
              style={{ backgroundColor: BRAND_YELLOW }} 
              className="min-w-[60px] px-4 py-2 rounded-md text-black font-black text-xs uppercase hover:brightness-95 active:scale-95 transition-all shrink-0 shadow-sm"
            >
              GO
            </button>
          </div>
        </div>

      </div>

      {/* Baseline Copyright Strip */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          © 2026 Cover Capitol. All Rights Reserved.
        </p>
        <p className="text-[9px] font-black uppercase tracking-widest text-[#fbea27] opacity-60">
          Premium Display Armor Spec
        </p>
      </div>
    </footer>
  );
}
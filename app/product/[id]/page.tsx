"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getProducts } from '@/app/lib/actions';
import { useCartStore } from '../../useCartStore';
import {
  ShoppingBag, Zap, CheckCircle2, ArrowRight, ChevronDown, 
  ShieldCheck, X, Trash2, Award, EyeOff, Layers, Sparkles,
  Truck, RefreshCw, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

// Reusable Navbar component
import Navbar from '@/app/components/Navbar'; 
// 1. Add this import at the very top of app/page.tsx
import Footer from '@/app/components/Footer';

const BRAND_YELLOW = '#fbea27';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedType, setSelectedType] = useState('Clear');

  const { items, addToCart, removeFromCart, isCartOpen, toggleCart, totalItems } = useCartStore();

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

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const productId = Number(params.id);
      const allItems = await getProducts(); 
      const foundProduct = allItems.find((p: any) => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        const related = allItems
          .filter((p: any) => p.model === foundProduct.model && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchProductData();
    }
  }, [params.id]);

  if (loading) return <div className="p-20 text-center font-bold animate-pulse italic text-2xl uppercase">Loading Vault...</div>;
  if (!product) return <div className="p-20 text-center font-bold uppercase tracking-tighter text-4xl italic">Product Missing</div>;

  const currentTypeData = product?.types?.find((t: any) => t.name === selectedType);
  const displayPrice = currentTypeData ? currentTypeData.price : product.price;

  const originalPrice = product.compareAtPrice || 0;
  const showDiscount = originalPrice > displayPrice;
  const discountPercentage = showDiscount 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0;

  // Render context-specific product benefits when variant choices are missing
  const renderCategoryFeatures = () => {
    const category = product.category?.toLowerCase() || "";
    
    if (category.includes("camera")) {
      return (
        <div className="bg-zinc-50 border-2 border-black p-4 mb-6 text-left">
          <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-2">Optics Specifications</p>
          <ul className="text-xs font-bold space-y-2 text-zinc-800">
            <li className="flex items-center gap-2">✓ 0.2mm Ultra-Thin Optical Clarity Profile</li>
            <li className="flex items-center gap-2">✓ Anti-Glare Coating (Zero Flash Flare-backs)</li>
            <li className="flex items-center gap-2">✓ Oleophobic Treated To Reject Fingerprint Smudges</li>
          </ul>
        </div>
      );
    }
    
    if (category.includes("back")) {
      return (
        <div className="bg-zinc-50 border-2 border-black p-4 mb-6 text-left">
          <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-2">Armor Guard Parameters</p>
          <ul className="text-xs font-bold space-y-2 text-zinc-800">
            <li className="flex items-center gap-2">✓ 3D Matrix Texture for Advanced Anti-Slip Grip</li>
            <li className="flex items-center gap-2">✓ Thermo-Polymer Self-Healing Micro Scratch Film</li>
            <li className="flex items-center gap-2">✓ Laser-Precision Edge Cutouts For 100% Case Fitment</li>
          </ul>
        </div>
      );
    }

    // Default Fallback Features for general items or combos
    return (
      <div className="bg-zinc-50 border-2 border-black p-4 mb-6 text-left">
        <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-2">Premium Packaging Standards</p>
        <ul className="text-xs font-bold space-y-2 text-zinc-800">
          <li className="flex items-center gap-2">✓ Absolute Dynamic Edge-to-Edge Full Coverage</li>
          <li className="flex items-center gap-2">✓ Heavy Duty Shock Absorption Material Matrix</li>
          <li className="flex items-center gap-2">✓ 100% Uncompromised High Fidelity Touch Responsiveness</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Cart Drawer */}
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

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12" style={{ marginTop: '96px' }}>
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible no-scrollbar">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden bg-white transition-all ${activeImage === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img src={product.images?.[activeImage]} className="w-full h-full object-contain p-8" alt={product.name} />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col text-left justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-100 text-[10px] font-bold uppercase px-3 py-1 rounded-md text-gray-600">{product.category}</span>
                {product.tag && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-md uppercase">{product.tag}</span>}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight mb-2 leading-tight">{product.name}</h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed border-l-2 border-gray-200 pl-4">{product.description}</p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-black">₹{displayPrice}</span>
                {showDiscount && (
                  <>
                    <span className="text-gray-400 line-through text-lg italic">₹{originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-green-600 font-bold text-sm uppercase">{discountPercentage}% OFF</span>
                  </>
                )}
              </div>

              {/* FINISH SELECTION BLOCK VS DYNAMIC CONTENT REPLACEMENT GATES */}
              {product.category === 'Tempered Glass' && product.types && product.types.length > 0 ? (
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Select Finish</p>
                  <div className="flex gap-3">
                    {product.types.map((typeObj: any) => (
                      <button
                        key={typeObj.name}
                        onClick={() => setSelectedType(typeObj.name)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${selectedType === typeObj.name ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                      >
                        {typeObj.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Automatically injected to cover vertical whitespace gaps for single items
                renderCategoryFeatures()
              )}

              {/* NEW TRUST STACKS HOOKED TO PREVENT COLD SPACE CONVERSION DROPS */}
              <div className="grid grid-cols-3 border-2 border-black bg-white mb-6 text-center">
                <div className="p-3 border-r-2 border-black flex flex-col items-center justify-center">
                  <Truck size={16} className="mb-1 text-black" />
                  <p className="text-[8px] font-black uppercase tracking-tighter leading-none">Express Ship</p>
                </div>
                <div className="p-3 border-r-2 border-black flex flex-col items-center justify-center">
                  <RefreshCw size={16} className="mb-1 text-black" />
                  <p className="text-[8px] font-black uppercase tracking-tighter leading-none">7-Day Swap</p>
                </div>
                <div className="p-3 flex flex-col items-center justify-center">
                  <ShieldAlert size={16} className="mb-1 text-black" />
                  <p className="text-[8px] font-black uppercase tracking-tighter leading-none">100% Secured</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={() => {
                  const productToCart = { ...product, price: displayPrice, selectedType: selectedType };
                  addToCart(productToCart);
                  toggleCart();
                }}
                style={{ backgroundColor: BRAND_YELLOW }}
                className="w-full py-4 rounded-xl font-bold text-black uppercase flex items-center justify-center gap-2 hover:brightness-95 transition-all shadow-sm"
              >
                <Zap size={18} fill="currentColor" /> Buy Now
              </button>

              <button
                onClick={() => addToCart({ ...product, price: displayPrice, selectedType: selectedType })}
                className="w-full py-4 rounded-xl font-bold text-black border-2 border-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* --- Shield Capabilities & In The Box Row --- */}
        <section className="mt-20 grid lg:grid-cols-2 gap-12 border-t border-gray-200 pt-16 text-left">
          <div>
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter italic text-black">Shield Capabilities</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Award className="mb-2 text-black" size={24} />
                <h5 className="font-black text-xs uppercase tracking-tight mb-1">9H Armor Hardness</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-normal">Certified top-tier tempered structural compound to safeguard against deep blade scratching.</p>
              </div>
              <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <EyeOff className="mb-2 text-black" size={24} />
                <h5 className="font-black text-xs uppercase tracking-tight mb-1">Oleophobic Anti-Smudge</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-normal">High-density vacuum electroplated coating layer to seamlessly reject oily fingerprint feedback.</p>
              </div>
              <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Layers className="mb-2 text-black" size={24} />
                <h5 className="font-black text-xs uppercase tracking-tight mb-1">Multi-Layer Deflection</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-normal">Engineered shock dispersion architecture designed to distribute high impact events evenly.</p>
              </div>
              <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="mb-2 text-black" size={24} />
                <h5 className="font-black text-xs uppercase tracking-tight mb-1">Zero Bubble Bonding</h5>
                <p className="text-[10px] text-gray-500 font-medium leading-normal">Premium Japanese AB adhesive underlay for immediate, clean auto-adhesion execution.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter italic text-black">In The Box Kit</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold text-black">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> 1x Premium Screen Protector Armor Shield
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> 1x High-Density Microfiber Buffing Cloth
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> 2x Wet & Dry Sanitizing Dust Prep Wipes
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-black">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> 1x Specialized Dust Extraction Alignment Sticker Kit
              </li>
            </ul>
            <div className="mt-6 bg-zinc-50 border-l-4 border-black p-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Note: Every installation bundle contains a step-by-step application manual on the interior sleeve.
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-gray-200 text-left">
            <h3 className="text-2xl font-black italic uppercase mb-8 tracking-tighter">Frequently Bought Together</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link href={`/product/${rel.id}`} key={rel.id} className="group bg-white border border-gray-200 p-4 rounded-xl hover:shadow-lg transition-all flex flex-col justify-between">
                  <div className="aspect-square bg-zinc-50 rounded-lg overflow-hidden mb-4 border border-black/5 flex items-center justify-center p-4">
                    <img src={rel.images?.[0]} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" alt={rel.name} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{rel.category}</p>
                    <p className="font-bold text-sm truncate text-black mb-2">{rel.name}</p>
                    <div className="flex justify-between items-center border-t border-zinc-100 pt-2">
                      <span className="font-black text-sm text-black">₹{rel.price}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-black" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      {/* REUSABLE FOOTER ENGINES */}
      <Footer />
    </div>
  );
}
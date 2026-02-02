"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
// 1. Swap static data for your live action
import { getProducts } from '@/app/lib/actions';
import { useCartStore } from '../../useCartStore';
import {
  ChevronLeft, ShoppingBag, Zap, CheckCircle2, ArrowRight, Search, ChevronDown, Filter,
  ShieldCheck, ChevronRight, X, Trash2
} from 'lucide-react';
import Link from 'next/link';

const BRAND_YELLOW = '#fbea27';

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

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const BRAND_YELLOW = '#fbea27';

  // 2. New states to hold live database data
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedType, setSelectedType] = useState('Clear');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
      // Ensure the ID is correctly parsed from the URL
      const productId = Number(params.id);

      const allItems = await getProducts(); //
      const foundProduct = allItems.find((p: any) => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        // Find related products based on the same model
        const related = allItems
          .filter((p: any) => p.model === foundProduct.model && p.id !== foundProduct.id)
          .slice(0, 3);
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

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans">
      {/* --- Header (Identical Design) --- */}
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

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12" style={{ marginTop: '96px' }}>
        <div className="grid lg:grid-cols-12 gap-12">

          {/* --- Image Gallery (Identical Design) --- */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg overflow-hidden bg-white transition-all ${activeImage === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img src={product.images?.[activeImage]} className="w-full h-full object-contain p-8" alt={product.name} />
            </div>
          </div>

          {/* --- Product Info (Identical Design) --- */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-100 text-[10px] font-bold uppercase px-3 py-1 rounded-md text-gray-600">{product.category}</span>
              {product.tag && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-md">{product.tag}</span>}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-2 leading-tight">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed border-l-2 border-gray-200 pl-4">{product.description}</p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-black">₹{product.price}</span>
              <span className="text-gray-400 line-through text-lg italic">₹1,299</span>
              <span className="text-green-600 font-bold text-sm uppercase">40% OFF</span>
            </div>

            {/* finish selection */}
            {product.category === 'Tempered Glass' && product.types && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Select Finish</p>
                <div className="flex gap-3">
                  {product.types.map((type: string) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${selectedType === type ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={() => { addToCart(product); router.push('/cart'); }}
                style={{ backgroundColor: BRAND_YELLOW }}
                className="w-full py-4 rounded-xl font-bold text-black uppercase flex items-center justify-center gap-2 hover:brightness-95 transition-all shadow-sm"
              >
                <Zap size={18} fill="currentColor" /> Buy Now
              </button>
              <button onClick={() => addToCart(product)} className="w-full py-4 rounded-xl font-bold text-black border-2 border-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all">
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* --- Specs & Box Details (Identical Design) --- */}
        <section className="mt-20 grid lg:grid-cols-2 gap-12 border-t border-gray-200 pt-16">
          <div>
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter italic">Technical Specifications</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {product.details && Object.entries(product.details).map(([key, value]: any) => (
                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-bold text-gray-500 uppercase text-[10px] w-1/3">{key}</td>
                    <td className="py-4 font-medium text-black">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter italic">In the Box</h3>
            <ul className="space-y-4">
              {product.packageContents?.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 size={18} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Related Products (Identical Design) --- */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-black italic uppercase mb-8 tracking-tighter">Frequently Bought Together</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <Link href={`/product/${rel.id}`} key={rel.id} className="group bg-white border border-gray-200 p-4 rounded-xl hover:shadow-lg transition-all">
                  <img src={rel.images?.[0]} className="w-full aspect-square object-contain mb-4 group-hover:scale-105 transition-transform" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{rel.category}</p>
                  <p className="font-bold text-sm truncate">{rel.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-sm">₹{rel.price}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
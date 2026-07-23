"use client";

import Link from "next/link";
import { useCartStore } from "../useCartStore";

const BRAND_YELLOW = "#fbea27";

/**
 * Single, consistent product card used across the whole store (homepage grids
 * + category / brand / shop listing pages) so every product reads the same way.
 * Surfaces the real MRP + discount from `compareAtPrice`, the store's biggest
 * trust/conversion lever.
 */
export default function ProductCard({ product }: { product: any }) {
    const { addToCart, toggleCart } = useCartStore();

    const price = Number(product.price) || 0;
    const mrp = Number(product.compareAtPrice) || 0;
    const hasDiscount = mrp > price;
    const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const showTag = product.tag && product.tag !== "test product";

    return (
        <div className="group flex flex-col bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300">
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                    {hasDiscount && (
                        <span className="absolute top-3 left-3 z-10 bg-green-600 text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide shadow-sm">
                            {discountPct}% OFF
                        </span>
                    )}
                    {showTag && (
                        <span className="hidden sm:inline-block absolute top-3 right-3 z-10 bg-black text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                            {product.tag}
                        </span>
                    )}
                    <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            <div className="flex flex-col flex-1 p-4">
                <Link href={`/product/${product.id}`}>
                    <h5 className="font-bold text-[13px] leading-snug mb-3 line-clamp-2 min-h-[2.5rem] text-black group-hover:text-blue-700 transition-colors">
                        {product.name}
                    </h5>
                </Link>

                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-4 mt-auto">
                    <span className="text-lg font-black text-black">₹{price}</span>
                    {hasDiscount && <span className="text-xs text-zinc-400 line-through">₹{mrp}</span>}
                    {hasDiscount && <span className="text-[11px] font-black text-green-600">{discountPct}% off</span>}
                </div>

                <button
                    onClick={() => { addToCart(product); toggleCart(); }}
                    style={{ backgroundColor: BRAND_YELLOW }}
                    className="w-full py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-black border border-black/10 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

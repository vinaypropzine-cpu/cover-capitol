import { create } from 'zustand';

// 1. Updated Interface to match data.ts
interface CartItem {
  id: number;
  name: string;
  price: number;     // Changed from string to number
  images: string[];  // Changed from img: string to images: string[]
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  toggleCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  addToCart: (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === product.id);

    // Normalize product data before adding to ensure it matches CartItem interface
    const normalizedProduct = {
      ...product,
      // Fallback if images array is missing, and ensure price is a number
      images: product.images || [product.img || ''],
      price: typeof product.price === 'string' 
        ? Number(product.price.replace(/[^\d.-]/g, '')) 
        : product.price
    };

    if (existingItem) {
      set({
        items: currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isCartOpen: true,
      });
    } else {
      set({
        items: [...currentItems, { ...normalizedProduct, quantity: 1 }],
        isCartOpen: true,
      });
    }
  },
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
}));
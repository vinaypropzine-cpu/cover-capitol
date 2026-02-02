// app/data.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  tag: string;
  category: 'Tempered Glass' | 'Camera Guard' | 'Back ScreenGuard' | 'Combo';
  brand: 'Apple' | 'Samsung' | 'Google' | 'OnePlus'; // Explicitly added brand field
  model: string;
  types?: string[]; 
  description: string;
  details: Record<string, string>;
  packageContents: string[];
}

export const PRODUCT_LIST: Product[] = [
  // --- TEMPERED GLASS (4 Products) ---
  { 
    id: 101, 
    name: 'Titanium Edge Glass', 
    price: 799, 
    images: ['https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80'],
    tag: 'Best Seller', // TAG 1
    category: 'Tempered Glass',
    brand: 'Apple',
    model: 'iPhone 15 Pro', 
    types: ['Clear', 'Matte', 'Privacy'], 
    description: 'Diamond-grade 9H protection with oleophobic coating. Crystal clear strength.',
    details: { "Material": "Aluminosilicate", "Hardness": "9H", "Thickness": "0.33mm" },
    packageContents: ['1x Glass', '1x Installation Kit']
  },
  { 
    id: 102, 
    name: 'Privacy Shield Pro', 
    price: 899, 
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80'],
    tag: 'New',
    category: 'Tempered Glass',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra', 
    types: ['Privacy'], 
    description: 'Advanced 28-degree privacy filter. Keeps your data safe from side-lookers.',
    details: { "Material": "Tempered Glass", "Feature": "Anti-Spy Tech" },
    packageContents: ['1x Privacy Glass', '1x Dust Absorber']
  },
  { 
    id: 103, 
    name: 'Gaming Matte Glass', 
    price: 649, 
    images: ['https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80'],
    tag: 'Gaming',
    category: 'Tempered Glass',
    brand: 'OnePlus',
    model: 'OnePlus 12', 
    types: ['Matte'], 
    description: 'Anti-glare matte finish designed for gamers. Smooth touch and zero fingerprints.',
    details: { "Finish": "Satin Matte", "Response": "Ultra-Fast Touch" },
    packageContents: ['1x Matte Glass', '1x Microfiber Cloth']
  },
  { 
    id: 104, 
    name: 'Ultra Clear Armor', 
    price: 599, 
    images: ['https://images.unsplash.com/photo-1556656793-062ff987b50d?q=80'],
    tag: 'Essential',
    category: 'Tempered Glass',
    brand: 'Google',
    model: 'Pixel 8 Pro', 
    types: ['Clear'], 
    description: 'Basic high-definition transparency. Retains original screen brightness.',
    details: { "Clarity": "99.9% HD", "Coating": "Anti-Shatter" },
    packageContents: ['1x Clear Glass', '1x Wet/Dry Wipe']
  },

  // --- CAMERA GUARD (4 Products) ---
  { 
    id: 201, 
    name: 'Sapphire Lens Guard', 
    price: 299, 
    images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80'],
    tag: 'Best Seller', // TAG 2
    category: 'Camera Guard',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    description: 'Ultra-thin sapphire coating for your lenses. Zero ghosting in photos.',
    details: { "Material": "Sapphire Glass", "Clarity": "HD" },
    packageContents: ['3x Lens Caps', '1x Cleaning Kit']
  },
  { 
    id: 202, 
    name: 'Metal Ring Protector', 
    price: 349, 
    images: ['https://images.unsplash.com/photo-1601593094911-30983cf4eadc?q=80'],
    tag: 'Durable',
    category: 'Camera Guard',
    brand: 'Samsung',
    model: 'Galaxy S23',
    description: 'Individual metal rings to protect each lens from direct impacts.',
    details: { "Material": "Aerospace Aluminum", "Design": "Individual Rings" },
    packageContents: ['5x Metal Rings', '1x Alignment Tool']
  },
  { 
    id: 203, 
    name: 'Full Lens Shield', 
    price: 249, 
    images: ['https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80'],
    tag: 'Value',
    category: 'Camera Guard',
    brand: 'Google',
    model: 'Pixel 7a',
    description: 'One-piece glass cover for the entire camera bar.',
    details: { "Material": "Tempered Glass", "Fit": "Full Coverage" },
    packageContents: ['1x Shield', '1x Microfiber Cloth']
  },
  { 
    id: 204, 
    name: 'Titanium Camera Film', 
    price: 399, 
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80'],
    tag: 'Premium',
    category: 'Camera Guard',
    brand: 'OnePlus',
    model: 'OnePlus 11',
    description: 'Military-grade film protection for the circular camera module.',
    details: { "Material": "Titanium Composite", "Self-Healing": "Yes" },
    packageContents: ['2x Modules Film', '1x Squeegee']
  },

  // --- BACK SCREENGUARD (4 Products) ---
  { 
    id: 301, 
    name: 'Carbon Fiber Skin', 
    price: 399, 
    images: ['https://images.unsplash.com/photo-1603313011101-31c726a55d4c?q=80'],
    tag: 'Sleek',
    category: 'Back ScreenGuard',
    brand: 'Apple',
    model: 'iPhone 14',
    description: 'Precision-cut carbon fiber texture. Protects from scratches.',
    details: { "Texture": "3D Carbon", "Adhesive": "3M Bubble-Free" },
    packageContents: ['1x Back Skin', '1x Install Kit']
  },
  { 
    id: 302, 
    name: 'Leather Texture Wrap', 
    price: 449, 
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80'],
    tag: 'Best Seller', // TAG 3
    category: 'Back ScreenGuard',
    brand: 'Samsung',
    model: 'S24 Ultra',
    description: 'Premium faux-leather finish for a luxurious grip and feel.',
    details: { "Finish": "Leatherette", "Grip": "High" },
    packageContents: ['1x Leather Skin', '1x Manual']
  },
  { 
    id: 303, 
    name: 'Matte Stealth Guard', 
    price: 349, 
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80'],
    tag: 'Minimal',
    category: 'Back ScreenGuard',
    brand: 'Google',
    model: 'Pixel 8',
    description: 'Invisible matte protection. Keeps the original look without the shine.',
    details: { "Finish": "Frosted Matte", "Material": "TPU" },
    packageContents: ['1x Matte Film', '1x Dust Sticker']
  },
  { 
    id: 304, 
    name: 'Transparent Shield', 
    price: 299, 
    images: ['https://images.unsplash.com/photo-1512446733611-900995478051?q=80'],
    tag: 'Classic',
    category: 'Back ScreenGuard',
    brand: 'OnePlus',
    model: 'OnePlus 12R',
    description: 'High-clarity transparent film for basic back-glass protection.',
    details: { "Clarity": "100%", "Yellowing": "Anti-Yellowing" },
    packageContents: ['1x Clear Film', '1x Cleaning Tool']
  },

  // --- COMBO (4 Products) ---
  { 
    id: 401, 
    name: 'Total Protection Combo', 
    price: 999, 
    images: ['https://images.unsplash.com/photo-1610792516307-ea5acd3c3b00?q=80'],
    tag: 'Best Seller', // TAG 4
    category: 'Combo',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    description: 'Ultimate shield. Includes top-tier front glass and lens protection.',
    details: { "Included": "Front + Camera", "Savings": "₹200 Off" },
    packageContents: ['1x Front Glass', '1x Lens Guard Set', '2x Install Kits']
  },
  { 
    id: 402, 
    name: '360 Full Body Kit', 
    price: 1299, 
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80'],
    tag: 'Full Cover',
    category: 'Combo',
    brand: 'Samsung',
    model: 'S24 Ultra',
    description: 'Complete protection. Front glass, camera rings, and back skin.',
    details: { "Pieces": "3-in-1", "Protection": "360 Degree" },
    packageContents: ['Front Glass', 'Camera Rings', 'Back Skin']
  },
  { 
    id: 403, 
    name: 'Pixel Perfection Pack', 
    price: 849, 
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80'],
    tag: 'Value Pack',
    category: 'Combo',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    description: 'Optimized for Pixel. Includes HD screen guard and camera bar protection.',
    details: { "Design": "Pixel Specific", "Bundle": "2-in-1" },
    packageContents: ['1x Screen Guard', '1x Lens Shield']
  },
  { 
    id: 404, 
    name: 'Speed & Style Combo', 
    price: 899, 
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80'],
    tag: 'Speedster',
    category: 'Combo',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    description: 'Matte glass for gaming paired with a Carbon Fiber back skin.',
    details: { "Bundle": "Matte + Carbon", "Style": "Cyberpunk" },
    packageContents: ['1x Matte Glass', '1x Back Skin']
  }
];
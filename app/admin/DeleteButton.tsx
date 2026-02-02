// app/admin/DeleteButton.tsx
"use client";

import { deleteProduct } from "../lib/actions";

export default function DeleteButton({ productId, productName }: { productId: string, productName: string }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${productName}?`);
    
    if (confirmed) {
      const result = await deleteProduct(productId);
      if (!result.success) {
        alert("Failed to delete. Check console.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="border border-black text-black text-[10px] font-bold py-1 px-3 rounded uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
    >
      DELETE
    </button>
  );
}
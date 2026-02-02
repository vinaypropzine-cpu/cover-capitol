"use client";

import { useState } from "react";
import { addProduct } from "../lib/actions";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";

export default function AddProductModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        brand: "",
        category: "",
        tag: "",
        price: "",
        image: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Explicitly mapping the payload to ensure keys match your Atlas Documents
        const productPayload = {
            id: Number(formData.id), // Forces numeric ID for consistency
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            tag: formData.tag,
            price: Number(formData.price),
            images: [formData.image], // Wraps single URL in an array
        };

        const result = await addProduct(productPayload);

        if (result.success) {
            setIsOpen(false);
            setFormData({ id: "", name: "", brand: "", category: "", tag: "", price: "", image: "" });
            // Reload ensures the page fetches the newly created record with its proper ID
            window.location.reload();
        } else {
            alert("Error adding product! Please check the console.");
        }
    };

    // Inside app/admin/AddProductModal.tsx
    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            /* Remove complex hover/transition effects here to stop the mismatch */
            className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-sm"
        >
            + Add New Product
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-black p-6 w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">New Product Entry</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Product Info Section */}
                    <div className="col-span-2"><p className="font-black uppercase text-xs mb-2">Product Info</p></div>
                    <input
                        placeholder="Product Name"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Product ID (e.g. 405)"
                        type="number"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Image URL"
                        className="col-span-2 border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        required
                    />

                    {/* Tech Specs Section */}
                    <div className="col-span-2 mt-4"><p className="font-black uppercase text-xs mb-2">Technical Specification</p></div>
                    <input
                        placeholder="Brand"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Category"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Type (Tag)"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    />
                    <input
                        placeholder="Price (INR)"
                        type="number"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        required
                    />

                    <div className="col-span-2 flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white font-black py-3 uppercase hover:bg-zinc-800 transition-all"
                        >
                            Save to Vault
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border-2 border-black font-black py-3 uppercase hover:bg-zinc-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Inside AddProductModal.tsx form */}
                    <div className="col-span-2 border-2 border-dashed border-black p-4 flex flex-col items-center justify-center bg-zinc-50">
                        <p className="font-black uppercase text-[10px] mb-2">Product Image Upload</p>

                        {formData.image ? (
                            <div className="relative w-20 h-20 border-2 border-black">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: "" })}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-black"
                                >X</button>
                            </div>
                        ) : (
                            <UploadButton<OurFileRouter, any>
                                endpoint="productImage"
                                onClientUploadComplete={(res) => {
                                    setFormData({ ...formData, image: res[0].url });
                                    alert("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
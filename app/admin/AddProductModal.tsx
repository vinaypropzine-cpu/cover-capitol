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
        description: "",
        brand: "",
        model: "",
        category: "",
        type: "",
        tag: "",
        price: "",
        images: [] as string[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productPayload = {
            id: Number(formData.id),
            name: formData.name,
            description: formData.description,
            brand: formData.brand,
            model: formData.model,
            category: formData.category,
            type: formData.category === "Tempered Glass" ? formData.type : "",
            tag: formData.tag,
            price: Number(formData.price),
            images: formData.images,
        };

        const result = await addProduct(productPayload);

        if (result.success) {
            setIsOpen(false);
            setFormData({
                id: "",
                name: "",
                description: "",
                brand: "",
                model: "",
                category: "",
                type: "",
                tag: "",
                price: "",
                images: []
            });
            window.location.reload();
        } else {
            alert("Error adding product!");
        }
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
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

                    <div className="col-span-2"><p className="font-black uppercase text-xs mb-2">Product Info</p></div>

                    <input
                        placeholder="Product Name"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <input
                        placeholder="Product ID"
                        type="number"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Product Description"
                        className="col-span-2 border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />

                    <div className="col-span-2 mt-4"><p className="font-black uppercase text-xs mb-2">Technical Specification</p></div>

                    <input
                        placeholder="Brand"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        required
                    />

                    <input
                        placeholder="Model Name"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, model: e.target.value })}
                        required
                    />

                    {/* CATEGORY DROPDOWN */}
                    <select
                        className="border-2 border-black p-2 font-bold outline-none"
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Tempered Glass">Tempered Glass</option>
                        <option value="Camera Guard">Camera Guard</option>
                        <option value="back screen guard">Back Screen Guard</option>
                        <option value="combo">Combo</option>
                    </select>

                    {/* CONDITIONAL TYPE */}
                    {formData.category === "Tempered Glass" && (
                        <select
                            className="border-2 border-black p-2 font-bold outline-none"
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="clear">Clear</option>
                            <option value="matte">Matte</option>
                            <option value="privacy">Privacy</option>
                        </select>
                    )}

                    <select
                        className="border-2 border-black p-2 font-bold outline-none"
                        onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    >
                        <option value="">Select Tag</option>
                        <option value="best seller">Best Seller</option>
                        <option value="top rated">Top Rated</option>
                    </select>

                    <input
                        placeholder="Price (INR)"
                        type="number"
                        className="border-2 border-black p-2 font-bold focus:bg-zinc-50 outline-none"
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        required
                    />

                    {/* IMAGE UPLOAD */}
                    <div className="col-span-2 border-2 border-dashed border-black p-4 flex flex-col items-center justify-center bg-zinc-50">
                        <p className="font-black uppercase text-[10px] mb-2">Product Image Upload (Max 4)</p>

                        <div className="flex gap-2 flex-wrap">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 border-2 border-black">
                                    <img src={img} className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                images: formData.images.filter((_, idx) => idx !== i)
                                            })
                                        }
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-black"
                                    >X</button>
                                </div>
                            ))}
                        </div>

                        {formData.images.length < 4 && (
                            <UploadButton<OurFileRouter, any>
                                endpoint="productImage"
                                onClientUploadComplete={(res) => {
                                    setFormData({
                                        ...formData,
                                        images: [...formData.images, res[0].url]
                                    });
                                }}
                            />
                        )}
                    </div>

                    <div className="col-span-2 flex gap-4 mt-6">
                        <button type="submit" className="flex-1 bg-black text-white font-black py-3 uppercase">
                            Save to Vault
                        </button>
                        <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border-2 border-black font-black py-3 uppercase">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

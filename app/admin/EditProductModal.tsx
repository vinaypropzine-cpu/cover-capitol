"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";
import { updateProduct } from "./page"; // Imported from your admin page actions

type EditProductFormData = {
    id: string;
    name: string;
    description: string;
    brand: string;
    model: string;
    category: string;
    deviceType: string;
    subCategory: string;
    tag: string;
    price: string;
    images: string[];
};

export default function EditProductModal({ product }: { product: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Hydrate form states directly with existing product values
    const [formData, setFormData] = useState<EditProductFormData>({
        id: product.id?.toString() || "",
        name: product.name || "",
        description: product.description || "",
        brand: product.brand || "",
        model: product.model || "",
        category: product.category || "",
        deviceType: product.deviceType || "",
        subCategory: product.subCategory || "",
        tag: product.tag || "",
        price: product.price?.toString() || "",
        images: (product.images as string[]) || []
    });

    // Extract database type mappings back into structured component states
    const [selectedTypes, setSelectedTypes] = useState<{ [key: string]: string | undefined }>(() => {
        const typesObj: { [key: string]: string | undefined } = {
            Clear: undefined,
            Matte: undefined,
            Privacy: undefined
        };
        product.types?.forEach((t: any) => {
            typesObj[t.name] = t.price?.toString();
        });
        return typesObj;
    });

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => ({
            ...prev,
            [type]: prev[type] === undefined ? "" : undefined
        }));
    };

    const handlePriceChange = (type: string, value: string) => {
        setSelectedTypes(prev => ({ ...prev, [type]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const typesArray = Object.entries(selectedTypes)
            .filter(([_, price]) => price !== undefined && price !== "")
            .map(([name, price]) => ({
                name,
                price: Number(price)
            }));

        const productPayload = {
            id: Number(formData.id),
            name: formData.name,
            description: formData.description,
            brand: formData.brand,
            model: formData.model,
            category: formData.category,
            deviceType: formData.deviceType,
            subCategory: formData.subCategory,
            types: typesArray, 
            tag: formData.tag,
            price: Number(formData.price),
            images: formData.images,
        };

        const result = await updateProduct(productPayload);

        if (result.success) {
            setIsOpen(false);
            window.location.reload(); // Refresh viewport state to lock in parameters
        } else {
            alert("Error updating database item vault values!");
        }
    };

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="border border-black text-black text-[10px] font-bold py-1 px-3 rounded uppercase hover:bg-black hover:text-white transition-all">
            EDIT
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black">
            <div className="bg-white border-4 border-black p-6 w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 text-left">Modify Product Vault</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-left">
                    <div className="col-span-2"><p className="font-black uppercase text-xs mb-2">Product Info</p></div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Name</label>
                        <input value={formData.name} className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">ID (Locked)</label>
                        <input value={formData.id} type="number" className="border-2 border-black p-2 font-bold outline-none bg-zinc-100 opacity-60 cursor-not-allowed" readOnly />
                    </div>
                    
                    <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Description</label>
                        <textarea value={formData.description} className="border-2 border-black p-2 font-bold outline-none h-24" onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>

                    <div className="col-span-2 mt-4"><p className="font-black uppercase text-xs mb-2">Categorization</p></div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Category</label>
                        <select value={formData.category} className="border-2 border-black p-2 font-bold outline-none h-[42px]" onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                            <option value="Tempered Glass">Tempered Glass</option>
                            <option value="Camera Guard">Camera Guard</option>
                            <option value="Back Screen Guard">Back Screen Guard</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Device Brand</label>
                        <input value={formData.brand} placeholder="e.g. Apple, Samsung" className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                    </div>

                    {formData.category === "Tempered Glass" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Device Type</label>
                                <select value={formData.deviceType} className="border-2 border-black p-2 font-bold outline-none h-[42px]" onChange={e => setFormData({ ...formData, deviceType: e.target.value })} required>
                                    <option value="">Device Type</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Smartwatch">Smartwatch</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400">Sub Category</label>
                                <select value={formData.subCategory} className="border-2 border-black p-2 font-bold outline-none h-[42px]" onChange={e => setFormData({ ...formData, subCategory: e.target.value })} required>
                                    <option value="">Sub Category</option>
                                    <option value="Normal">Normal</option>
                                    <option value="UV">UV</option>
                                    <option value="Edge to Edge Membrane">Edge to Edge Membrane</option>
                                </select>
                            </div>

                            <div className="col-span-2 bg-zinc-100 p-4 border-2 border-black mt-2">
                                <p className="font-black uppercase text-[10px] mb-4">Edit Finishes & Prices</p>
                                <div className="space-y-3">
                                    {["Clear", "Matte", "Privacy"].map((type) => (
                                        <div key={type} className="flex items-center gap-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedTypes[type] !== undefined} 
                                                onChange={() => handleTypeToggle(type)}
                                                className="w-5 h-5 accent-black"
                                            />
                                            <span className="font-bold text-sm w-20">{type}</span>
                                            {selectedTypes[type] !== undefined && (
                                                <input 
                                                    type="number" 
                                                    placeholder={`Price for ${type}`}
                                                    className="flex-1 border-2 border-black p-1 text-sm font-bold outline-none bg-white text-black"
                                                    value={selectedTypes[type] || ""}
                                                    onChange={(e) => handlePriceChange(type, e.target.value)}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="col-span-2 mt-4"><p className="font-black uppercase text-xs mb-2">Pricing & Tags</p></div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Base Grid Price</label>
                        <input value={formData.price} type="number" className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">System Tag</label>
                        <select value={formData.tag} className="border-2 border-black p-2 font-bold outline-none h-[42px]" onChange={e => setFormData({ ...formData, tag: e.target.value })}>
                            <option value="">Select Tag</option>
                            <option value="best seller">Best Seller</option>
                            <option value="top rated">Top Rated</option>
                        </select>
                    </div>

                    {/* REUSABLE VAULT IMAGE COMPONENT LOGIC */}
                    <div className="col-span-2 border-4 border-black p-4 bg-zinc-50 relative mt-2">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-black uppercase text-xs tracking-tighter text-black">Inventory Visuals ({formData.images.length}/4)</p>
                            {formData.images.length < 4 && !isUploading && (
                                <UploadButton<OurFileRouter, any>
                                    endpoint="productImage"
                                    appearance={{
                                        button: "bg-black text-white px-4 py-2 font-black uppercase text-[10px] rounded-none hover:bg-zinc-800 transition-all",
                                        allowedContent: "hidden"
                                    }}
                                    content={{ button: "Upload Image" }}
                                    onUploadBegin={() => setIsUploading(true)}
                                    onClientUploadComplete={(res) => {
                                        setFormData(prev => ({ ...prev, images: [...prev.images, res[0].url] }));
                                        setIsUploading(false);
                                    }}
                                    onUploadError={() => {
                                        alert("Upload Failed!");
                                        setIsUploading(false);
                                    }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative aspect-square border-2 border-black bg-white group">
                                    <img src={img} className="w-full h-full object-contain" alt="Preview" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {isUploading && (
                                <div className="aspect-square border-2 border-black border-dashed flex flex-col items-center justify-center bg-white animate-pulse">
                                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p className="font-black text-[8px] uppercase tracking-tighter">Sending...</p>
                                </div>
                            )}
                            {!isUploading && Array.from({ length: 4 - formData.images.length }).map((_, i) => (
                                <div key={i} className="aspect-square border-2 border-zinc-200 border-dashed bg-zinc-100 flex items-center justify-center">
                                    <span className="text-zinc-300 font-black text-2xl">+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 flex gap-4 mt-6">
                        <button type="submit" className="flex-1 bg-black text-white font-black py-3 uppercase hover:bg-zinc-800 transition-all">
                            Update Vault
                        </button>
                        <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border-2 border-black font-black py-3 uppercase hover:bg-zinc-100 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
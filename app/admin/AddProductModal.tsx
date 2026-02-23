"use client";

import { useState } from "react";
import { addProduct } from "../lib/actions";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";

export default function AddProductModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Initial state with new fields
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        brand: "",
        model: "",
        category: "",
        deviceType: "",      // Mobile, Tablet, Smartwatch
        subCategory: "",     // Normal, UV, Membrane
        tag: "",
        price: "",           // Base price for grid display
        images: [] as string[]
    });

    // New state to manage selected finishes and their specific prices
    const [selectedTypes, setSelectedTypes] = useState<{ [key: string]: string | undefined }>({
        Clear: "",
        Matte: "",
        Privacy: ""
    });

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => ({
            ...prev,
            [type]: prev[type] === undefined ? "" : undefined // Toggles presence
        }));
    };

    const handlePriceChange = (type: string, value: string) => {
        setSelectedTypes(prev => ({ ...prev, [type]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert the selectedTypes object into the array of objects the DB expects
        const typesArray = Object.entries(selectedTypes)
            .filter(([_, price]) => price !== undefined)
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
            price: Number(formData.price), // Main display price
            images: formData.images,
        };

        const result = await addProduct(productPayload);

        if (result.success) {
            setIsOpen(false);
            setFormData({
                id: "", name: "", description: "", brand: "", model: "",
                category: "", deviceType: "", subCategory: "", tag: "", price: "", images: []
            });
            setSelectedTypes({ Clear: "", Matte: "", Privacy: "" });
            window.location.reload();
        } else {
            alert("Error adding product!");
        }
    };

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="bg-black text-white px-6 py-2 rounded font-bold uppercase text-sm">+ Add New Product</button>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border-4 border-black p-6 w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">New Product Entry</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><p className="font-black uppercase text-xs mb-2">Product Info</p></div>

                    <input placeholder="Product Name" className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input placeholder="Product ID" type="number" className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, id: e.target.value })} required />
                    
                    <textarea placeholder="Product Description" className="col-span-2 border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, description: e.target.value })} required />

                    <div className="col-span-2 mt-4"><p className="font-black uppercase text-xs mb-2">Categorization</p></div>

                    <select className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="">Select Category</option>
                        <option value="Tempered Glass">Tempered Glass</option>
                        <option value="Camera Guard">Camera Guard</option>
                        <option value="Back Screen Guard">Back Screen Guard</option>
                    </select>

                    {/* DYNAMIC TEMPERED GLASS WORKFLOW */}
                    {formData.category === "Tempered Glass" && (
                        <>
                            <select className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, deviceType: e.target.value })} required>
                                <option value="">Device Type</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Smartwatch">Smartwatch</option>
                            </select>

                            <select className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, subCategory: e.target.value })} required>
                                <option value="">Sub Category</option>
                                <option value="Normal">Normal</option>
                                <option value="UV">UV</option>
                                <option value="Edge to Edge Membrane">Edge to Edge Membrane</option>
                            </select>

                            <div className="col-span-2 bg-zinc-100 p-4 border-2 border-black mt-2">
                                <p className="font-black uppercase text-[10px] mb-4">Select Finishes & Set Prices</p>
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
                                                    className="flex-1 border-2 border-black p-1 text-sm font-bold outline-none"
                                                    value={selectedTypes[type]}
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

                    <input placeholder="Main Display Price" type="number" className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    
                    <select className="border-2 border-black p-2 font-bold outline-none" onChange={e => setFormData({ ...formData, tag: e.target.value })}>
                        <option value="">Select Tag</option>
                        <option value="best seller">Best Seller</option>
                        <option value="top rated">Top Rated</option>
                    </select>

                    {/* IMAGE UPLOAD */}
                    {/* IMAGE UPLOAD SECTION */}
                    <div className="col-span-2 border-4 border-black p-4 bg-zinc-50 relative">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-black uppercase text-xs tracking-tighter">Inventory Visuals ({formData.images.length}/4)</p>

                            {/* CUSTOM UPLOAD TRIGGER */}
                            {formData.images.length < 4 && !isUploading && (
                                <UploadButton<OurFileRouter, any>
                                    endpoint="productImage"
                                    appearance={{
                                        button: "bg-black text-white px-4 py-2 font-black uppercase text-[10px] rounded-none hover:bg-zinc-800 transition-all",
                                        allowedContent: "hidden" // Hides the default "Images (4MB)" text
                                    }}
                                    content={{
                                        button: "Upload Image"
                                    }}
                                    onUploadBegin={() => setIsUploading(true)} // Starts animation
                                    onClientUploadComplete={(res) => {
                                        setFormData({
                                            ...formData,
                                            images: [...formData.images, res[0].url]
                                        });
                                        setIsUploading(false); // Stops animation
                                    }}
                                    onUploadError={() => {
                                        alert("Upload Failed!");
                                        setIsUploading(false);
                                    }}
                                />
                            )}
                        </div>

                        {/* PREVIEW GRID */}
                        <div className="grid grid-cols-4 gap-3">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative aspect-square border-2 border-black bg-white group">
                                    <img src={img} className="w-full h-full object-contain" alt="Preview" />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                images: formData.images.filter((_, idx) => idx !== i)
                                            })
                                        }
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 active:scale-90 transition-all"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            {/* UPLOADING ANIMATION PLACEHOLDER */}
                            {isUploading && (
                                <div className="aspect-square border-2 border-black border-dashed flex flex-col items-center justify-center bg-white animate-pulse">
                                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p className="font-black text-[8px] uppercase tracking-tighter">Sending...</p>
                                </div>
                            )}

                            {/* EMPTY SLOTS */}
                            {!isUploading && Array.from({ length: 4 - formData.images.length }).map((_, i) => (
                                <div key={i} className="aspect-square border-2 border-zinc-200 border-dashed bg-zinc-100 flex items-center justify-center">
                                    <span className="text-zinc-300 font-black text-2xl">+</span>
                                </div>
                            ))}
                        </div>
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
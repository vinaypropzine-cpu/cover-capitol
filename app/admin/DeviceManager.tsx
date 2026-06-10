"use client";

import { useState } from "react";
import { addDeviceBrand, addModelToBrand, removeModelFromBrand, deleteDeviceBrand } from "../lib/actions";
import { Trash2, Plus } from "lucide-react";

export default function DeviceManager({ initialData }: { initialData: any[] }) {
    const [newBrand, setNewBrand] = useState("");
    const [newModels, setNewModels] = useState<{ [key: string]: string }>({});

    const handleAddBrand = async () => {
        if (!newBrand.trim()) return;
        await addDeviceBrand(newBrand);
        setNewBrand("");
    };

    const handleAddModel = async (brandId: string) => {
        const model = newModels[brandId];
        if (!model || !model.trim()) return;
        await addModelToBrand(brandId, model);
        setNewModels(prev => ({ ...prev, [brandId]: "" }));
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-black">Device Menu Control</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manage the "Shop By Device" dropdown</p>
                </div>
                
                {/* Add New Brand Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        placeholder="New Brand (e.g. OnePlus)"
                        className="border-2 border-black p-2 font-bold text-xs outline-none focus:bg-zinc-50 w-48"
                    />
                    <button
                        onClick={handleAddBrand}
                        className="bg-[#fbea27] text-black border-2 border-black px-4 py-2 font-black uppercase text-xs hover:bg-black hover:text-[#fbea27] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {initialData.map((brand) => (
                    <div key={brand._id} className="border-2 border-black p-4 bg-zinc-50 relative group">
                        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                            <h3 className="font-black uppercase text-sm">{brand.brand}</h3>
                            <button
                                onClick={() => {
                                    if(confirm(`Delete ${brand.brand} and all its models?`)) deleteDeviceBrand(brand._id);
                                }}
                                className="text-zinc-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                            {brand.models.map((model: string, idx: number) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-black/10 p-2 text-xs font-bold">
                                    {model}
                                    <button
                                        onClick={() => removeModelFromBrand(brand._id, model)}
                                        className="text-zinc-300 hover:text-red-500 transition-colors"
                                    >
                                        <XIcon />
                                    </button>
                                </li>
                            ))}
                            {brand.models.length === 0 && (
                                <p className="text-[10px] uppercase font-bold text-zinc-400 italic">No models added</p>
                            )}
                        </ul>

                        {/* Add New Model to this Brand */}
                        <div className="flex gap-2 mt-auto">
                            <input
                                type="text"
                                value={newModels[brand._id] || ""}
                                onChange={(e) => setNewModels({ ...newModels, [brand._id]: e.target.value })}
                                placeholder="Add model..."
                                className="flex-1 border-2 border-black p-2 font-bold text-[10px] outline-none"
                            />
                            <button
                                onClick={() => handleAddModel(brand._id)}
                                className="bg-black text-white px-3 border-2 border-black hover:bg-[#fbea27] hover:text-black transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick helper icon component to avoid extra imports
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
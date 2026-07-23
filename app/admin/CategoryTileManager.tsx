"use client";

import { useState } from "react";
import { updateCategoryTileImage, addCategoryTile, deleteCategoryTile } from "../lib/actions";
import UploadImageButton from "./UploadImageButton";
import { Trash2, Plus } from "lucide-react";

export default function CategoryTileManager({ tiles }: { tiles: any[] }) {
    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = async () => {
        if (!newName.trim()) { alert("Enter a category name first."); return; }
        if (!newImage) { alert("Upload an image for the category first."); return; }
        setAdding(true);
        await addCategoryTile(newName.trim(), newImage);
        setNewName("");
        setNewImage("");
        setAdding(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Remove the "${name}" category from the homepage?`)) {
            await deleteCategoryTile(id);
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Shop Your Preference Categories</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Add, remove, or re-image the round category icons on the homepage. The name should match the product's category so its items show up.</p>
            </div>

            {/* ADD NEW CATEGORY */}
            <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 p-4 mb-8">
                <p className="font-black uppercase text-xs tracking-widest text-black mb-4">Add New Category</p>
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Circular preview */}
                    <div className="w-20 h-20 rounded-full border-2 border-black bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {newImage
                            ? <img src={newImage} alt="New category preview" className="w-full h-full object-cover" />
                            : <span className="text-[8px] font-black uppercase text-zinc-300 text-center px-1">No image</span>}
                    </div>
                    <input
                        type="text"
                        placeholder="Category name (e.g. Privacy Glass)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 border-2 border-black p-3 text-xs font-bold outline-none focus:bg-white bg-white text-black"
                    />
                    <div className="w-full md:w-44">
                        <UploadImageButton
                            label={newImage ? "Replace Image" : "Upload Image"}
                            onUploaded={(url) => setNewImage(url)}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={adding || !newName.trim() || !newImage}
                        className={`flex items-center justify-center gap-1 px-6 py-3 font-black uppercase text-[10px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black ${
                            adding || !newName.trim() || !newImage
                                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                                : "bg-[#fbea27] active:translate-y-1 active:shadow-none"
                        }`}
                    >
                        <Plus size={14} /> {adding ? "Adding..." : "Add"}
                    </button>
                </div>
            </div>

            {/* EXISTING CATEGORIES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {tiles.map((tile) => (
                    <div key={tile._id} className="flex flex-col items-center gap-3 border-2 border-black bg-white p-4 shadow-sm">
                        <div className="relative w-24 h-24 rounded-full border-2 border-black bg-zinc-100 overflow-hidden group">
                            <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleDelete(tile._id, tile.name)}
                                aria-label={`Delete ${tile.name}`}
                                className="absolute top-0 right-0 bg-red-600 text-white p-1.5 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-black text-center leading-tight">{tile.name}</p>
                        <UploadImageButton
                            label="Change Image"
                            onUploaded={(url) => updateCategoryTileImage(tile._id, url)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

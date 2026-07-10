"use client";

import { addBanner, deleteBanner } from "../lib/actions";
import { Trash2 } from "lucide-react";
import UploadImageButton from "./UploadImageButton";

export default function HeroBannerManager({ banners }: { banners: any[] }) {
    const handleDelete = async (id: string) => {
        if(confirm("Are you sure you want to remove this banner?")) {
            await deleteBanner(id);
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-4 border-black pb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Hero Billboard Control</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manage frontend slideshow banners (16:9 ratio recommended)</p>
                </div>
                
                <div className="w-full md:w-56">
                    <UploadImageButton
                        label="Upload New Banner"
                        onUploaded={(url) => addBanner(url)}
                    />
                </div>
            </div>

            {banners.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-300 bg-zinc-50">
                    <p className="font-black uppercase text-zinc-400 text-xs">No active banners. Upload one to ignite the slideshow.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="relative group border-2 border-black aspect-[21/9] bg-zinc-100 overflow-hidden shadow-sm">
                            <img src={banner.imageUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                            
                            <button
                                onClick={() => handleDelete(banner._id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                            
                            <div className="absolute bottom-0 left-0 bg-black text-[#fbea27] px-3 py-1 text-[8px] font-black uppercase tracking-widest border-t-2 border-r-2 border-black">
                                Live Slide
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
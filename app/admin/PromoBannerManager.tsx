"use client";

import { useState } from "react";
import { addPromoBanner, deletePromoBanner } from "../lib/actions";
import { Trash2, Link as LinkIcon } from "lucide-react";
import UploadImageButton from "./UploadImageButton";

export default function PromoBannerManager({ banners }: { banners: any[] }) {
    const [linkUrl, setLinkUrl] = useState("");

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to remove this offer banner?")) {
            await deletePromoBanner(id);
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Offer Announcement Slideshow</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Clickable banners shown between homepage sections (wide banner, approx 1400x300, recommended)</p>
            </div>

            {/* ADD NEW BANNER */}
            <div className="flex flex-col md:flex-row gap-3 mb-8 md:items-center bg-zinc-50 border-2 border-dashed border-zinc-300 p-4">
                <div className="flex-1 relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Where should it lead? e.g. /deals or /category/combo"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full border-2 border-black p-3 pl-9 text-xs font-bold outline-none focus:bg-white bg-white text-black"
                    />
                </div>
                <div className="w-full md:w-56">
                    <UploadImageButton
                        label="Upload Offer Banner"
                        onUploaded={async (url) => {
                            await addPromoBanner(url, linkUrl.trim());
                            setLinkUrl("");
                        }}
                    />
                </div>
            </div>

            {banners.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-300 bg-zinc-50">
                    <p className="font-black uppercase text-zinc-400 text-xs">No offer banners live. Set a link and upload one to start the slideshow.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="relative group border-2 border-black bg-zinc-100 overflow-hidden shadow-sm">
                            <img src={banner.imageUrl} alt="Offer Banner" className="w-full aspect-[21/5] object-cover" />

                            <button
                                onClick={() => handleDelete(banner._id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="absolute bottom-0 left-0 max-w-full bg-black text-[#fbea27] px-3 py-1 text-[8px] font-black uppercase tracking-widest border-t-2 border-r-2 border-black truncate">
                                Leads to: {banner.linkUrl || "/ (homepage)"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

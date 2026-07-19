"use client";

import { useState } from "react";
import { addBanner, deleteBanner, updateBannerMobileImage } from "../lib/actions";
import { Trash2, Monitor, Smartphone } from "lucide-react";
import UploadImageButton from "./UploadImageButton";

export default function HeroBannerManager({ banners }: { banners: any[] }) {
    // Staged artwork for the new slide before publishing
    const [desktopUrl, setDesktopUrl] = useState("");
    const [mobileUrl, setMobileUrl] = useState("");
    const [publishing, setPublishing] = useState(false);

    const publishSlide = async () => {
        if (!desktopUrl) {
            alert("Upload the desktop artwork first.");
            return;
        }
        setPublishing(true);
        await addBanner(desktopUrl, mobileUrl);
        setDesktopUrl("");
        setMobileUrl("");
        setPublishing(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to remove this banner?")) {
            await deleteBanner(id);
        }
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Hero Billboard Control</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manage frontend slideshow banners. Upload separate artwork per screen size — desktop (wide, 16:9) and mobile (tall, 4:5). Phones fall back to the desktop image if no mobile one is set.</p>
            </div>

            {/* NEW SLIDE COMPOSER */}
            <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 p-4 mb-8">
                <p className="font-black uppercase text-xs tracking-widest text-black mb-4">Add New Slide</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* Desktop slot */}
                    <div className="flex flex-col gap-2">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500"><Monitor size={14} /> Desktop Image (Required)</p>
                        <div className="aspect-[21/9] border-2 border-black bg-white overflow-hidden flex items-center justify-center">
                            {desktopUrl
                                ? <img src={desktopUrl} alt="Desktop preview" className="w-full h-full object-cover" />
                                : <span className="text-[9px] font-black uppercase text-zinc-300">No image yet</span>}
                        </div>
                        <UploadImageButton label={desktopUrl ? "Replace Desktop" : "Upload Desktop"} onUploaded={(url) => setDesktopUrl(url)} />
                    </div>

                    {/* Mobile slot */}
                    <div className="flex flex-col gap-2">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500"><Smartphone size={14} /> Mobile Image (Optional)</p>
                        <div className="aspect-[21/9] border-2 border-black bg-white overflow-hidden flex items-center justify-center">
                            {mobileUrl
                                ? <img src={mobileUrl} alt="Mobile preview" className="h-full object-contain" />
                                : <span className="text-[9px] font-black uppercase text-zinc-300">Falls back to desktop</span>}
                        </div>
                        <UploadImageButton label={mobileUrl ? "Replace Mobile" : "Upload Mobile"} onUploaded={(url) => setMobileUrl(url)} />
                    </div>

                    {/* Publish */}
                    <div className="flex flex-col gap-2 justify-center h-full">
                        <button
                            onClick={publishSlide}
                            disabled={publishing || !desktopUrl}
                            className={`w-full py-4 font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black ${
                                publishing || !desktopUrl ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none" : "bg-[#fbea27] active:translate-y-1 active:shadow-none"
                            }`}
                        >
                            {publishing ? "Publishing..." : "Publish Slide"}
                        </button>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">Goes live on the homepage instantly</p>
                    </div>
                </div>
            </div>

            {banners.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-300 bg-zinc-50">
                    <p className="font-black uppercase text-zinc-400 text-xs">No active banners. Upload one to ignite the slideshow.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="border-2 border-black bg-white overflow-hidden shadow-sm">
                            <div className="relative group aspect-[21/9] bg-zinc-100 overflow-hidden">
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

                            {/* Per-slide mobile artwork */}
                            <div className="p-3 border-t-2 border-black flex items-center gap-3 bg-zinc-50">
                                <div className="w-10 h-14 border-2 border-black bg-white overflow-hidden flex items-center justify-center shrink-0">
                                    {banner.mobileImageUrl
                                        ? <img src={banner.mobileImageUrl} alt="Mobile artwork" className="w-full h-full object-cover" />
                                        : <Smartphone size={14} className="text-zinc-300" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                        {banner.mobileImageUrl ? "Mobile artwork set" : "No mobile artwork"}
                                    </p>
                                    <UploadImageButton
                                        label={banner.mobileImageUrl ? "Replace Mobile" : "Add Mobile"}
                                        onUploaded={(url) => updateBannerMobileImage(banner._id, url)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

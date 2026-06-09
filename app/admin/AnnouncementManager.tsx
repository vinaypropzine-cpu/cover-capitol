"use client";

import { useState } from "react";
import { updateAnnouncement } from "../lib/actions";

export default function AnnouncementManager({ initialData }: { initialData: any }) {
    const [text, setText] = useState(initialData?.text || "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateAnnouncement(text, isActive);
        setIsSaving(false);
        // Optional: you can show a success toast here
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                <h2 className="text-xl font-black uppercase tracking-tighter text-black">Promo Bar Control</h2>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {isActive ? "Visible Online" : "Hidden"}
                    </span>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-5 h-5 accent-black border-2 border-black cursor-pointer"
                    />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter flash sale or promo text..."
                    className="flex-1 border-2 border-black p-3 font-bold text-sm outline-none focus:bg-zinc-50 text-black"
                />
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#fbea27] text-black border-2 border-black px-8 py-3 font-black uppercase text-sm hover:bg-black hover:text-[#fbea27] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none whitespace-nowrap"
                >
                    {isSaving ? "Saving..." : "Update Live"}
                </button>
            </div>
        </div>
    );
}
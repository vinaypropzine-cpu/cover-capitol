"use client";

import { useState } from "react";
import { addScreenMenuItem, removeScreenMenuItem } from "../lib/actions";
import { X } from "lucide-react";

export default function ScreenMenuManager({ initialData }: { initialData: any[] }) {
    const [newItemInputs, setNewItemInputs] = useState<{ [key: string]: string }>({});

    const handleAddItem = async (menuId: string) => {
        const item = newItemInputs[menuId];
        if (!item || !item.trim()) return;
        await addScreenMenuItem(menuId, item);
        setNewItemInputs(prev => ({ ...prev, [menuId]: "" }));
    };

    return (
        <div className="border-4 border-black bg-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="mb-6 border-b-4 border-black pb-2">
                <h2 className="text-xl font-black uppercase tracking-tighter text-black">Screen Protection Layout</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manage the 3 columns inside the Screen Protection dropdown</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {initialData.map((menu) => (
                    <div key={menu._id} className="border-2 border-black p-4 bg-zinc-50 relative flex flex-col">
                        <h3 className="font-black uppercase text-sm border-b-2 border-black pb-2 mb-4">{menu.title}</h3>

                        <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 flex-1">
                            {menu.items.map((item: string, idx: number) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-black/10 p-2 text-xs font-bold">
                                    {item}
                                    <button
                                        onClick={() => removeScreenMenuItem(menu._id, item)}
                                        className="text-zinc-300 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                            {menu.items.length === 0 && (
                                <p className="text-[10px] uppercase font-bold text-zinc-400 italic">No items added</p>
                            )}
                        </ul>

                        {/* Add New Item */}
                        <div className="flex gap-2 mt-auto">
                            <input
                                type="text"
                                value={newItemInputs[menu._id] || ""}
                                onChange={(e) => setNewItemInputs({ ...newItemInputs, [menu._id]: e.target.value })}
                                placeholder="Add list item..."
                                className="flex-1 border-2 border-black p-2 font-bold text-[10px] outline-none"
                            />
                            <button
                                onClick={() => handleAddItem(menu._id)}
                                className="bg-black text-white px-3 border-2 border-black hover:bg-[#fbea27] hover:text-black transition-colors font-black"
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
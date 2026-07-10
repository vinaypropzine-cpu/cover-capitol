"use client";

import { updateCategoryTileImage } from "../lib/actions";
import UploadImageButton from "./UploadImageButton";

export default function CategoryTileManager({ tiles }: { tiles: any[] }) {
    return (
        <div className="border-4 border-black bg-white p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Shop Your Preference Blocks</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Change the image of the 4 homepage category blocks (square ratio recommended)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiles.map((tile) => (
                    <div key={tile._id} className="border-2 border-black bg-white overflow-hidden shadow-sm">
                        <div className="aspect-square bg-zinc-100 overflow-hidden border-b-2 border-black">
                            <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 flex flex-col gap-3">
                            <p className="font-black uppercase text-xs tracking-widest text-black">{tile.name}</p>
                            <UploadImageButton
                                label="Change Image"
                                onUploaded={(url) => updateCategoryTileImage(tile._id, url)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

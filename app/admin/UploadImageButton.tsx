"use client";

import { useRef } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "../api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

/**
 * Fully styled replacement for UploadThing's <UploadButton />.
 * Shows a single clean brand-yellow button instead of the native "Choose file" input.
 */
export default function UploadImageButton({
    label = "Change Image",
    onUploaded,
}: {
    label?: string;
    onUploaded: (url: string) => Promise<any> | void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { startUpload, isUploading } = useUploadThing("productImage", {
        onClientUploadComplete: async (res) => {
            await onUploaded(res[0].url);
        },
        onUploadError: () => alert("Image upload failed!"),
    });

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) startUpload([file]);
                    e.target.value = ""; // Allow re-selecting the same file
                }}
            />
            <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className={`w-full bg-[#fbea27] text-black border-2 border-black px-4 py-2 font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    isUploading
                        ? "opacity-70 animate-pulse cursor-wait"
                        : "hover:bg-black hover:text-[#fbea27] active:translate-y-0.5 active:shadow-none"
                }`}
            >
                {isUploading ? "Uploading..." : label}
            </button>
        </>
    );
}

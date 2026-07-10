"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ImageIcon, Menu as MenuIcon, Megaphone, ExternalLink } from "lucide-react";

const BRAND_YELLOW = "#fbea27";

const TABS = [
    { id: "inventory", label: "Inventory", desc: "Products & pricing", icon: Package },
    { id: "homepage", label: "Homepage", desc: "Banners & category blocks", icon: ImageIcon },
    { id: "menus", label: "Nav Menus", desc: "Dropdowns & devices", icon: MenuIcon },
    { id: "announcement", label: "Announcement", desc: "Top promo bar", icon: Megaphone },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminShell({
    inventory,
    homepage,
    menus,
    announcement,
}: {
    inventory: React.ReactNode;
    homepage: React.ReactNode;
    menus: React.ReactNode;
    announcement: React.ReactNode;
}) {
    const [active, setActive] = useState<TabId>("inventory");
    const sections: Record<TabId, React.ReactNode> = { inventory, homepage, menus, announcement };
    const activeTab = TABS.find((t) => t.id === active)!;

    return (
        <div className="min-h-screen bg-zinc-100 text-black font-sans flex flex-col md:flex-row">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 shrink-0 bg-[#131921] text-white md:min-h-screen md:sticky md:top-0 md:self-start flex flex-col">
                <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
                    <Image src="/logo.svg" alt="Cover Capital logo" width={32} height={32} className="h-8 w-8" />
                    <div>
                        <p className="text-sm font-black tracking-tight italic leading-none">
                            COVER<span style={{ color: BRAND_YELLOW }}>CAPITAL</span>
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar p-3 gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = active === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActive(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 text-left whitespace-nowrap transition-all border-l-4 ${
                                    isActive
                                        ? "bg-white/10 border-[#fbea27] text-white"
                                        : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icon size={16} style={isActive ? { color: BRAND_YELLOW } : undefined} />
                                <span>
                                    <span className="block text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                                    <span className="hidden md:block text-[9px] font-bold text-zinc-500">{tab.desc}</span>
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="hidden md:block mt-auto p-3 border-t border-white/10">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:brightness-95 transition-all"
                        style={{ backgroundColor: BRAND_YELLOW }}
                    >
                        View Store <ExternalLink size={12} />
                    </Link>
                </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 min-w-0 p-4 md:p-8">
                <div className="mb-8 border-b-4 border-black pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">{activeTab.label}</h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activeTab.desc}</p>
                </div>
                {sections[active]}
            </main>
        </div>
    );
}

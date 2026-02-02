"use server";
// app/admin/page.tsx
import { getProducts } from "../lib/actions";
import DeleteButton from "./DeleteButton"; // Import the new button
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { revalidatePath } from "next/cache";
import AddProductModal from "./AddProductModal";

export default async function AdminDashboard() {
    const products = await getProducts();

    return (
        <div className="p-4 bg-white min-h-screen text-black font-sans">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Inventory Control</h1>
                <AddProductModal /> {/* 👈 Your new functional modal */}
            </div>

            {/* Structured Table based on Hand-Drawn Sketch */}
            <div className="border-2 border-black overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {/* Main Categories */}
                        <tr className="bg-zinc-100 border-b-2 border-black">
                            <th colSpan={3} className="p-3 border-r-2 border-black text-lg font-black uppercase">Product Info</th>
                            <th colSpan={3} className="p-3 border-r-2 border-black text-lg font-black uppercase">Technical Specification</th>
                            <th className="p-3 border-r-2 border-black text-lg font-black uppercase">Price</th>
                            <th className="p-3 text-lg font-black uppercase">Control</th>
                        </tr>
                        {/* Sub-Headers */}
                        <tr className="bg-zinc-50 border-b-2 border-black text-sm font-bold uppercase">
                            <th className="p-2 border-r border-black w-24">Image</th>
                            <th className="p-2 border-r border-black">Name</th>
                            <th className="p-2 border-r-2 border-black w-20">ID</th>
                            <th className="p-2 border-r border-black w-32">Brand</th>
                            <th className="p-2 border-r border-black">Category</th>
                            <th className="p-2 border-r-2 border-black">Type</th>
                            <th className="p-2 border-r-2 border-black w-24">INR</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item: any, index: number) => (
                            /* By using item._id (MongoDB's internal ID) or a fallback index, we prevent this error */
                            <tr key={item._id || item.id || index} className="border-b border-zinc-300 hover:bg-zinc-50 transition-colors">
                                {/* Product Info */}
                                <td className="p-2 border-r border-black">
                                    <div className="w-20 h-20 border border-zinc-200 overflow-hidden bg-white">
                                        <img src={item.images?.[0]} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </td>
                                <td className="p-2 border-r border-black font-black text-base uppercase leading-tight">
                                    {item.name}
                                </td>
                                <td className="p-2 border-r-2 border-black font-mono text-sm text-center">
                                    {/* Priority 1: Your manual ID (e.g., 406) */}
                                    {item.id ? item.id :
                                        /* Priority 2: MongoDB fallback only if manual ID is missing */
                                        (item._id ? `DB-${item._id.toString().slice(-4)}` : "N/A")}
                                </td>

                                {/* Technical Specification */}
                                <td className="p-2 border-r border-black font-bold text-sm">
                                    {item.brand}
                                </td>
                                <td className="p-2 border-r border-black text-sm">
                                    {item.category}
                                </td>
                                <td className="p-2 border-r-2 border-black text-sm italic">
                                    {item.tag || "Standard"}
                                </td>

                                {/* Price */}
                                <td className="p-2 border-r-2 border-black">
                                    <span className="text-xl font-black">₹{item.price}</span>
                                </td>

                                {/* Control */}
                                <td className="p-2">
                                    <div className="flex flex-col gap-1">
                                        <button className="bg-black text-white text-[10px] font-bold py-1 px-3 rounded uppercase">
                                            EDIT
                                        </button>
                                        <DeleteButton productId={item.id} productName={item.name} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export async function deleteProduct(productId: string) {
    try {
        await connectDB();
        // Remove the product using the UUID from your Atlas data
        await Product.findOneAndDelete({ id: Number(productId) });

        // This tells Next.js to refresh the admin page so the item disappears
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false };
    }
}
import ShopClient from "../shop/ShopClient";

// Navbar "Best Sellers" link: products the admin tagged as "best seller"
export default function BestSellersPage() {
    return <ShopClient filters={{ tag: "best seller" }} />;
}

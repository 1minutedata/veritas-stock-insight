import { useEffect } from "react";

const Shop = () => {
  useEffect(() => {
    document.title = "LyticalPilot - Build Your Shop";
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-2">Build Your Shop</h1>
      <p className="text-muted-foreground">Set up products, pricing, and storefront settings.</p>
    </section>
  );
};

export default Shop;

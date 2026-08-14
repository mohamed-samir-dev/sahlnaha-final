"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";
import { fetchAllProducts } from "../../lib/productsCache";

export default function AudioClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        setProducts(data.filter((p) => {
          const cat = p.category?.trim().toLowerCase();
          const sub = p.subCategory?.trim().toLowerCase();
          return (
            cat?.includes("سماعات") ||
            cat === "speaker" ||
            cat === "earbuds" ||
            sub?.includes("سماعات") ||
            sub?.includes("audio")
          );
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <CategoryLayout title="أجهزة صوت و سماعات" parentLabel="أجهزة صوت و سماعات" products={products} loading={loading} emptyIcon="🎧" />;
}

"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";
import { fetchAllProducts } from "../../lib/productsCache";

export default function GamesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        setProducts(data.filter((p) => p.category === "اكسسورات"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <CategoryLayout title="اكسسورات" parentLabel="اكسسورات" products={products} loading={loading} emptyIcon="🕹️" />;
}

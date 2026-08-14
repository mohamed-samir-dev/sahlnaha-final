"use client";
import type { Product } from "../components/products/types";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const _cache: { data: Product[] | null; fetchedAt: number; promise: Promise<Product[]> | null } = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

export async function fetchAllProducts(): Promise<Product[]> {
  if (_cache.data && Date.now() - _cache.fetchedAt < CACHE_TTL) return _cache.data;
  // Deduplicate concurrent requests
  if (_cache.promise) return _cache.promise;
  _cache.promise = fetch("/api/products")
    .then((r) => r.json())
    .then((data: Product[]) => {
      _cache.data = data;
      _cache.fetchedAt = Date.now();
      _cache.promise = null;
      return data;
    })
    .catch((e) => {
      _cache.promise = null;
      throw e;
    });
  return _cache.promise;
}

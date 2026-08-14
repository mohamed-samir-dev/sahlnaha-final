import { unstable_cache } from "next/cache";

const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export const getCachedCompany = unstable_cache(
  async () => {
    try {
      const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600, tags: ["company"] } });
      return r.ok ? r.json() : {};
    } catch {
      return {};
    }
  },
  ["company"],
  { revalidate: 3600, tags: ["company"] }
);

export const getCachedProduct = unstable_cache(
  async (id: string) => {
    try {
      const r = await fetch(`${BACKEND}/api/products/${id}`, { next: { revalidate: 3600, tags: ["products"] } });
      return r.ok ? r.json() : null;
    } catch {
      return null;
    }
  },
  ["product"],
  { revalidate: 3600, tags: ["products"] }
);

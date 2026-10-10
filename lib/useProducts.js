"use client";
import { useEffect, useState } from "react";
import { formatUnit } from "./utils";

const API_PRIMARY = "https://api.api-store.workers.dev/api/bazardor";
const API_BACKUP = "https://api.abcz.workers.dev/api/bazardor";

function normalizeProduct(p) {
  const price = p.today ?? p.price ?? 0;
  const rawUnit = p.unit ?? "kg";
  return {
    ...p,
    id: p.id,
    slug: p.slug,
    name: p.nameBn ?? p.name ?? "",
    nameBn: p.nameBn ?? p.name ?? "",
    emoji: p.image ?? p.emoji ?? "🧺",
    image: p.image ?? p.emoji ?? "🧺",
    unit: formatUnit(rawUnit),
    rawUnit,
    price,
    today: price,
    yesterday: p.yesterday ?? price,
    change: p.change ?? { dir: "flat", pct: 0 },
    category: p.category,
    markets: Array.isArray(p.markets) ? p.markets : [],
  };
}

function normalizeCategory(c) {
  return {
    ...c,
    id: c.id ?? c.slug,
    slug: c.slug,
    name: c.nameBn ?? c.name ?? "",
    nameBn: c.nameBn ?? c.name ?? "",
    icon: c.icon ?? "🛒",
  };
}
let cachedData = null;
let inFlightPromise = null;

async function fetchFromApi() {
  if (cachedData) return cachedData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    try {
      const [resCats, resProds] = await Promise.all([
        fetch(`${API_PRIMARY}/categories`),
        fetch(`${API_PRIMARY}/products`),
      ]);
      if (resCats.ok && resProds.ok) {
        const cats = await resCats.json();
        const prods = await resProds.json();
        if (Array.isArray(cats) && Array.isArray(prods)) {
          cachedData = {
            categories: cats.map(normalizeCategory),
            products: prods.map(normalizeProduct),
          };
          return cachedData;
        }
      }
    } catch (err) {
      console.warn("Primary API failed, trying backup API...", err);
    }

    try {
      const [resCats, resProds] = await Promise.all([
        fetch(`${API_BACKUP}/categories`),
        fetch(`${API_BACKUP}/products`),
      ]);
      if (resCats.ok && resProds.ok) {
        const cats = await resCats.json();
        const prods = await resProds.json();
        if (Array.isArray(cats) && Array.isArray(prods)) {
          cachedData = {
            categories: cats.map(normalizeCategory),
            products: prods.map(normalizeProduct),
          };
          return cachedData;
        }
      }
    } catch (err) {
      console.warn("Backup API failed, falling back to local cache...", err);
    }

    try {
      const res = await fetch("/products.json");
      const json = await res.json();
      cachedData = {
        categories: (json.categories ?? []).map(normalizeCategory),
        products: (json.products ?? []).map(normalizeProduct),
      };
      return cachedData;
    } catch (finalErr) {
      throw finalErr;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export default function useProducts() {
  const [data, setData] = useState(cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!cachedData) {
      fetchFromApi()
        .then((result) => {
          if (active) setData(result);
        })
        .catch((err) => {
          if (active) setError(err);
        });
    }

    return () => {
      active = false;
    };
  }, []);

  return {
    loading: !data && !error,
    error,
    categories: data?.categories ?? [],
    products: data?.products ?? [],
  };
}

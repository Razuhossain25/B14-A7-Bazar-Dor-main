import Link from "next/link";
import { fmtPct, getChangeDir, toBn } from "@/lib/utils";

export default function ProductCard({ p }) {
  const dir = getChangeDir(p.change);
  const badgeClass =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-600";

  const priceVal = toBn(p.today ?? p.price ?? 0);
  const yestVal = toBn(p.yesterday ?? p.today ?? p.price ?? 0);

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group block rounded-xl border border-[#e1e9e2] bg-white p-3 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f5f1] text-xl">
          {p.image || p.emoji}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-[#202b23] group-hover:text-green-700">
            {p.nameBn || p.name}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            প্রতি {p.unit}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-0.5 text-lg font-extrabold leading-tight text-[#202b23]">
            ৳{priceVal}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${badgeClass}`}
        >
          {fmtPct(p.change)}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        গতকাল: ৳{yestVal}
      </p>
    </Link>
  );
}

export function CardSkeletons({ n = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#e1e9e2] bg-white p-3 space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="skeleton size-10 rounded-lg bg-[#f0f5f1]" />
            <div className="space-y-1.5 flex-1">
              <div className="skeleton h-3.5 w-3/4 bg-[#f0f5f1]" />
              <div className="skeleton h-3 w-1/2 bg-[#f0f5f1]" />
            </div>
          </div>
          <div className="flex justify-between items-end pt-2">
            <div className="skeleton h-5 w-20 bg-[#f0f5f1]" />
            <div className="skeleton h-4 w-12 rounded-full bg-[#f0f5f1]" />
          </div>
        </div>
      ))}
    </div>
  );
}

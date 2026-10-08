import Link from "next/link";
import { fmtPrice, fmtPct, getChangeDir } from "@/lib/utils";

export default function ProductCard({ p }) {
  const dir = getChangeDir(p.change);
  const badgeClass =
    dir === "up"
      ? "badge-success text-white"
      : dir === "down"
      ? "badge-error text-white"
      : "badge-ghost text-base-content/70";

  return (
    <Link
      href={`/product/${p.slug}`}
      className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition duration-200 group"
    >
      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
            {p.image || p.emoji}
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">{p.nameBn || p.name}</h3>
          <p className="text-sm opacity-60">প্রতি {p.unit}</p>
        </div>
        <div className="flex items-end justify-between mt-4 pt-2 border-t border-base-200">
          <div>
            <div className="text-xs opacity-60">আজকের দাম</div>
            <div className="font-bold text-base text-primary">
              {fmtPrice(p.today ?? p.price)}
            </div>
          </div>
          <span className={`badge ${badgeClass} text-xs font-medium`}>
            {fmtPct(p.change)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CardSkeletons({ n = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300 p-4 space-y-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-5 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

import ProductCard, { CardSkeletons } from "./ProductCard";

export default function Section({ id, title, icon, iconColor, subtitle, items, loading }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-6 scroll-mt-32">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className={`text-xl font-bold ${iconColor}`}>{icon}</span>}
        <h2 className="text-xl md:text-2xl font-bold text-[#1d271f]">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-[#1d271f]/60 mb-4">{subtitle}</p>}
      {loading ? (
        <CardSkeletons n={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {items.map((p) => (
            <ProductCard key={p.slug || p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

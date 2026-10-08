import ProductCard, { CardSkeletons } from "./ProductCard";
export default function Section({ id, title, subtitle, items, loading }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-8 scroll-mt-28">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="opacity-70 mb-4">{subtitle}</p>}
      {loading ? <CardSkeletons /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {items.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      )}
    </section>
  );
}

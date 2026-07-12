import Link from "next/link";

export function AssetCard({ asset }: { asset: any }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-slate-900">
      <h3 className="font-semibold">{asset.name}</h3>
      <p className="text-sm text-slate-500">{asset.tag}</p>
      <div className="mt-3">
        <Link href={`/assets/${asset.id}`} className="text-blue-600">View</Link>
      </div>
    </div>
  );
}

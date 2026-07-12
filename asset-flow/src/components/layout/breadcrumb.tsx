import Link from "next/link";
import { Home } from "lucide-react";

export function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100">
        <Home className="h-4 w-4" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 dark:hover:text-slate-100">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
          )}
          {index < items.length - 1 ? null : null}
        </div>
      ))}
    </nav>
  );
}

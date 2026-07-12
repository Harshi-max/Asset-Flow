import { cn } from "@/lib/utils";

export function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

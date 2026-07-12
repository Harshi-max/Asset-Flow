import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Active Assets", value: "1,248", trend: "+12.4%" },
  { label: "Maintenance", value: "84", trend: "+3.2%" },
  { label: "Pending Reviews", value: "27", trend: "-1.8%" },
];

export default function DashboardPage() {
  return (
    <PageWrapper>
      <Breadcrumb items={[{ label: "Overview" }]} />
      <PageHeader
        title="Operations Overview"
        description="A placeholder enterprise shell for the AssetFlow foundation."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foundation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The project foundation has been prepared with the requested structure, tooling, Prisma setup, and reusable UI shell.
          </p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Organizations" description="Department, category, and employee foundation." />
      <Card>
        <CardHeader>
          <CardTitle>Organization setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">This page provides the enterprise shell for departments, categories, and employee directory management.</p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

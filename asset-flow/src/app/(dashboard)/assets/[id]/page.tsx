import { getPrismaClient } from "@/lib/prisma-safe";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const prisma = getPrismaClient();
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id }, include: { documents: true, history: true } });
  if (!asset) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{asset.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Tag: {asset.tag}</p>
          <p className="text-sm text-slate-600">Serial: {asset.serialNumber}</p>
          <p className="text-sm text-slate-600">Location: {asset.location}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {asset.history.map((h: any) => (
              <div key={h.id} className="mb-2">
                <div className="text-sm font-semibold">{h.action}</div>
                <div className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {asset.documents.map((d: any) => (
              <div key={d.id} className="mb-2">
                <a href={d.url} className="text-blue-600">{d.name}</a>
                <div className="text-xs text-slate-500">{d.type}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

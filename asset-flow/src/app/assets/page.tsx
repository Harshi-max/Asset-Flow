"use client";

import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { AssetTable } from "@/components/assets/asset-table";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { AssetForm } from "@/components/assets/asset-form";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);
  return (
    <PageWrapper>
      <PageHeader
        title="Assets"
        description="Track and manage critical equipment across the organization."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Register Asset
          </Button>
        }
      />
      <AssetTable />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <AssetForm onSaved={() => setOpen(false)} />
      </Drawer>
    </PageWrapper>
  );
}

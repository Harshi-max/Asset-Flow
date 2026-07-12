"use client";

import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { AssetTable } from "@/components/assets/asset-table";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { AssetForm } from "@/components/assets/asset-form";
import { useState } from "react";

export default function AssetsPage() {
  const [open, setOpen] = useState(false);
  return (
    <PageWrapper>
      <PageHeader title="Assets" description="Manage inventory and resources." actions={<Button onClick={() => setOpen(true)}>Register Asset</Button>} />
      <AssetTable />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <AssetForm onSaved={() => setOpen(false)} />
      </Drawer>
    </PageWrapper>
  );
}

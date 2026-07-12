"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function Modal({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

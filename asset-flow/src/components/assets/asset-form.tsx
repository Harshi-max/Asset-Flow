"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { assetCreateSchema } from "@/validations/asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof assetCreateSchema>;

export function AssetForm({ onSaved }: { onSaved: () => void }) {
  const { register, handleSubmit } = useForm<FormValues>({ resolver: zodResolver(assetCreateSchema) as any });
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      const res = await fetch('/api/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) onSaved();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input placeholder="Name" {...register('name')} className="w-full rounded-md border p-2" />
      <input placeholder="Asset Tag" {...register('tag')} className="w-full rounded-md border p-2" />
      <input placeholder="Serial Number" {...register('serialNumber')} className="w-full rounded-md border p-2" />
      <input placeholder="Location" {...register('location')} className="w-full rounded-md border p-2" />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  );
}

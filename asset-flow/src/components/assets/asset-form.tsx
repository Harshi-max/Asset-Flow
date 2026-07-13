"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { assetCreateSchema } from "@/validations/asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof assetCreateSchema>;

export function AssetForm({ onSaved }: { onSaved: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(assetCreateSchema) as any });
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Register Asset</h2>
        <p className="text-sm text-slate-500">Add a new equipment or device to your organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} required />
        <Input label="Asset Tag" {...register('tag')} error={errors.tag?.message} required />
      </div>

      <Input label="Serial Number" {...register('serialNumber')} error={errors.serialNumber?.message} />
      <Input label="Location" {...register('location')} error={errors.location?.message} />

      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={() => onSaved()} className="rounded-xl">Cancel</Button>
        <Button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Asset"}
        </Button>
      </div>
    </form>
  );
}

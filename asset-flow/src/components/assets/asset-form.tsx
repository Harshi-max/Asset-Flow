"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { assetCreateSchema } from "@/validations/asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Select } from "@/components/ui/select";

type FormValues = z.infer<typeof assetCreateSchema>;

export function AssetForm({ onSaved }: { onSaved: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(assetCreateSchema) as any });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetch('/api/organizations/departments').then(r => r.json());
        if (d?.success) setDepartments(d.data || []);
        const c = await fetch('/api/organizations/categories').then(r => r.json());
        if (c?.success) setCategories(c.data || []);
      } catch (e) { }
    })();
  }, []);

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      // if documents selected, send multipart/form-data
      if (files && files.length > 0) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, String(v)); });
        for (let i = 0; i < files.length; i++) fd.append('documents', files[i]);
        const res = await fetch('/api/assets', { method: 'POST', body: fd });
        const j = await res.json();
        if (j?.success) onSaved();
      } else {
        const res = await fetch('/api/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const j = await res.json();
        if (j?.success) onSaved();
      }
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

      <div className="grid grid-cols-2 gap-4">
        <Input label="Serial Number" {...register('serialNumber')} error={errors.serialNumber?.message} />
        <Input label="Location" {...register('location')} error={errors.location?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">Department</span>
          <select {...register('departmentId')} className="rounded border px-2 py-1 text-sm">
            <option value="">-- none --</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">Category</span>
          <select {...register('categoryId')} className="rounded border px-2 py-1 text-sm">
            <option value="">-- none --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>

      <div>
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 mb-1">Documents</span>
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={() => onSaved()} className="rounded-xl">Cancel</Button>
        <Button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Asset"}
        </Button>
      </div>
    </form>
  );
}

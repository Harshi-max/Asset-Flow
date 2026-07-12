"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="w-full rounded-md border border-slate-300 p-3" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input className="w-full rounded-md border border-slate-300 p-3" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <Button className="w-full" type="submit">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

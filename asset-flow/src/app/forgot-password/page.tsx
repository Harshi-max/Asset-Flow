"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <input className="w-full rounded-md border border-slate-300 p-3" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Button className="w-full" type="submit">Send reset link</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

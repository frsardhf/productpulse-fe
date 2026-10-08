import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldX className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Admin access required
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your account is signed in, but it does not have permission to open the
          administration area.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/products">Browse catalogue</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

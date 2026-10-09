"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { safeReturnUrl } from "@/lib/session";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));

  return (
    <main className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 pb-12 pt-24 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Sign in to Relicase
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            New to the demo?{" "}
            <Link
              href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <LoginForm onLoginSuccess={() => router.replace(returnUrl)} />
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          This is a portfolio storefront. Orders are simulated and no payment is
          collected.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import { safeReturnUrl } from "@/lib/session";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const loginUrl = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <main className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 pb-12 pt-24 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Create a demo account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              href={loginUrl}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <SignupForm onSignupSuccess={() => router.replace(loginUrl)} />
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          Registration creates a local Relicase user. It does not create a
          Good Smile account or enable real purchases.
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SignupContent />
    </Suspense>
  );
}

import Link from "next/link";
import { ArrowRight, Boxes, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 pt-16">
      <section className="relative isolate px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.22),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-800 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Full-stack portfolio demo
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              A focused storefront for{" "}
              <span className="bg-gradient-to-r from-violet-600 to-sky-600 bg-clip-text text-transparent">
                Blue Archive merchandise
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Browse a curated Good Smile US metadata snapshot, compare local
              demo inventory, and explore a checkout flow built around safe,
              repeatable data.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6">
                <Link href="/products">
                  Browse catalogue <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link href="/signup">Create demo account</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Portfolio demo: orders are simulated and no payment is collected.
              Relicase is not an official Good Smile store.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 -z-10 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="grid rotate-1 grid-cols-2 gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-2xl backdrop-blur sm:p-6">
              {[
                ["Plush", "Soft character goods", "from-rose-100 to-amber-50"],
                [
                  "Figures",
                  "Scale and articulated",
                  "from-sky-100 to-indigo-50",
                ],
                [
                  "Nendoroids",
                  "Compact collectibles",
                  "from-violet-100 to-fuchsia-50",
                ],
                [
                  "Accessories",
                  "Bags and apparel",
                  "from-emerald-100 to-cyan-50",
                ],
              ].map(([title, subtitle, palette], index) => (
                <div
                  key={title}
                  className={`flex min-h-40 flex-col justify-between rounded-2xl bg-gradient-to-br ${palette} p-4 ${index % 2 ? "translate-y-4" : ""}`}
                >
                  {index === 0 ? (
                    <Boxes className="h-7 w-7 text-rose-600" />
                  ) : index === 1 ? (
                    <ShieldCheck className="h-7 w-7 text-indigo-600" />
                  ) : index === 2 ? (
                    <Sparkles className="h-7 w-7 text-violet-600" />
                  ) : (
                    <Search className="h-7 w-7 text-emerald-600" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

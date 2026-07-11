import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import logo from "@/assets/logo.asset.json";
import mascota from "@/assets/mascota.asset.json";
import { useHydrated } from "@/hooks/use-hydrated";

const PrivyProviders = lazy(() =>
  import("@/components/PrivyProviders").then((m) => ({
    default: m.PrivyProviders,
  })),
);
const DashboardCard = lazy(() =>
  import("@/components/DashboardCard").then((m) => ({
    default: m.DashboardCard,
  })),
);

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel de Inversionista · Todos Santos" },
      {
        name: "description",
        content:
          "Consulta tus NFTs de Todos Santos, tus rentas acumuladas y reclama tus dividendos en USDC.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const hydrated = useHydrated();
  return (
    <div className="min-h-screen text-ink">
      <div className="papel-picado" aria-hidden />
      <div className="max-w-4xl mx-auto px-5 pt-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo.url} alt="Todos Santos" className="h-14 md:h-16 drop-shadow" />
          </Link>
          <Link
            to="/"
            className="text-sm font-black uppercase tracking-wider hover:text-fiesta-red"
          >
            ← Volver a la plazuela
          </Link>
        </nav>

        <header className="pt-8 pb-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-fiesta-yellow/60 border-2 border-ink/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            🎟️ Tu palco en Todos Santos
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[0.95]">
            <span className="text-fiesta-red">Panel</span>{" "}
            <span className="text-fiesta-blue">del Inversionista</span>
          </h1>
          <img
            src={mascota.url}
            alt=""
            aria-hidden
            className="absolute -right-2 -top-2 w-24 md:w-32 -rotate-6 drop-shadow-xl hidden sm:block"
          />
        </header>

        <section className="pb-16">
          {hydrated ? (
            <Suspense
              fallback={
                <div className="rounded-3xl bg-card p-8 shadow-xl h-72" />
              }
            >
              <PrivyProviders>
                <DashboardCard />
              </PrivyProviders>
            </Suspense>
          ) : (
            <div className="rounded-3xl bg-card p-8 shadow-xl border-4 border-fiesta-red/20 h-72" />
          )}
        </section>
      </div>
    </div>
  );
}

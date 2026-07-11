import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import mascota from "@/assets/mascota.asset.json";
import santo from "@/assets/santo.asset.json";
import logo from "@/assets/logo.asset.json";
import lugar from "@/assets/lugar.asset.json";
import { useHydrated } from "@/hooks/use-hydrated";

const PrivyProviders = lazy(() =>
  import("@/components/PrivyProviders").then((m) => ({ default: m.PrivyProviders })),
);
const WalletCard = lazy(() =>
  import("@/components/WalletCard").then((m) => ({ default: m.WalletCard })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Todos Santos · Mercado Turístico y Plazuela · Puebla" },
      {
        name: "description",
        content:
          "Todos Santos: mercado turístico y plazuela mexicana en Puebla. Gastronomía, hospedaje, eventos y foro artístico. Preventa de NFTs que reparten rentas a los holders.",
      },
      { property: "og:title", content: "Todos Santos · Mercado Turístico Puebla" },
      {
        property: "og:description",
        content:
          "Cultura, gastronomía y convivencia. Sé parte de la plazuela con nuestra colección de NFTs.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logo.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: logo.url },
    ],
  }),
  component: Landing,
});

const spaces = [
  {
    title: "Pasillo Gastronómico",
    desc: "Sabores de Puebla y cocina tradicional mexicana en un solo pasillo.",
    color: "bg-fiesta-red",
    emoji: "🌮",
  },
  {
    title: "Jardín y Área de Eventos",
    desc: "Un espacio verde para celebraciones, ferias y encuentros comunitarios.",
    color: "bg-fiesta-green",
    emoji: "🎪",
  },
  {
    title: "Cafetería",
    desc: "Café de altura, pan dulce y una parada obligada para convivir.",
    color: "bg-fiesta-orange",
    emoji: "☕",
  },
  {
    title: "Área de Hospedaje",
    desc: "Cabañas con identidad hacienda para visitantes y turistas.",
    color: "bg-fiesta-blue",
    emoji: "🛖",
  },
  {
    title: "Kiosco / Foro Artístico",
    desc: "Escenario abierto para música, danza y expresión cultural.",
    color: "bg-fiesta-yellow",
    emoji: "🎶",
  },
];

const steps = [
  {
    n: "01",
    title: "Preventa de NFTs",
    desc: "Adquieres una pieza de la colección con mUSD. Cada NFT es tu boleto a la plazuela.",
  },
  {
    n: "02",
    title: "Capital para construir",
    desc: "Los fondos financian la adquisición y construcción de los espacios de Todos Santos.",
  },
  {
    n: "03",
    title: "Rentas para holders",
    desc: "Al operar (gastronomía, eventos, hospedaje) el proyecto reparte rentas entre quienes poseen NFTs.",
  },
];

function Landing() {
  const hydrated = useHydrated();

  return (
    <div className="min-h-screen text-ink">
      {/* PAPEL PICADO TOP */}
      <div className="papel-picado" aria-hidden />

      <div className="max-w-6xl mx-auto px-5 pt-6">
        {/* NAV */}
        <nav className="flex items-center justify-between">
          <img src={logo.url} alt="Todos Santos" className="h-14 md:h-16 drop-shadow" />
          <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wider items-center">
            <a href="#proyecto" className="hover:text-fiesta-red">El proyecto</a>
            <a href="#como" className="hover:text-fiesta-red">Cómo funciona</a>
            <a href="#preventa" className="hover:text-fiesta-red">Preventa</a>
            <a href="#contacto" className="hover:text-fiesta-red">Contacto</a>
            <Link
              to="/dashboard"
              className="rounded-full bg-fiesta-red text-white px-4 py-2 hover:bg-fiesta-red/90"
            >
              🎟️ Mi panel
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <header className="grid md:grid-cols-2 gap-8 items-center py-10 md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-fiesta-yellow/60 border-2 border-ink/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              🌵 Puebla, México
            </div>
            <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95]">
              <span className="text-fiesta-red">Todos</span>{" "}
              <span className="text-fiesta-blue">Santos</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl font-body text-ink/80 max-w-xl">
              Un mercado turístico y plazuela de identidad mexicana. Cultura,
              gastronomía y eventos para vivir la convivencia familiar y apoyar
              al talento y consumo local.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#preventa" className="btn-fiesta text-base md:text-lg">
                ✉️ Conectar / Crear Wallet con Correo
              </a>
              <a
                href="#proyecto"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-black uppercase tracking-wider text-sm bg-white/70 border-2 border-ink/15 hover:bg-white transition"
              >
                Conoce la plazuela ↓
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-fiesta-red/30 via-fiesta-yellow/40 to-fiesta-blue/30 rounded-[3rem] blur-2xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-1">
              <img src={lugar.url} alt="Plazuela Todos Santos" className="w-full h-80 md:h-[26rem] object-cover" />
            </div>
            <img
              src={mascota.url}
              alt="Mascota Todos Santos"
              className="absolute -bottom-8 -left-6 w-32 md:w-44 drop-shadow-2xl -rotate-6"
            />
            <div className="absolute -top-4 -right-4 bg-fiesta-yellow border-4 border-ink/10 rounded-2xl px-4 py-2 font-display text-xl -rotate-6 shadow-lg">
              ¡Fiesta!
            </div>
          </div>
        </header>
      </div>

      {/* EL PROYECTO */}
      <section id="proyecto" className="py-16 md:py-24 bg-gradient-to-b from-transparent to-sand-deep/30">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-fiesta-red font-black uppercase tracking-[0.25em] text-xs">El proyecto</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              Una plazuela con alma <span className="text-fiesta-red">mexicana</span>
            </h2>
            <p className="mt-4 text-ink/75 font-body text-lg">
              Cinco espacios pensados para el encuentro, la tradición y el
              consumo local, con la estética cálida de una hacienda poblana.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {spaces.map((s) => (
              <article
                key={s.title}
                className="group bg-card rounded-3xl overflow-hidden border-4 border-ink/5 shadow-lg hover:-translate-y-1 transition"
              >
                <div className={`${s.color} h-40 flex items-center justify-center text-6xl relative`}>
                  <span className="drop-shadow-md">{s.emoji}</span>
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[radial-gradient(circle_at_20%_20%,white,transparent_50%)]" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 text-ink/70 font-body">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="py-16 md:py-24 relative">
        <img
          src={santo.url}
          alt=""
          aria-hidden
          className="absolute right-4 top-8 w-28 md:w-40 rounded-full opacity-90 hidden md:block"
        />
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl">
            <p className="text-fiesta-blue font-black uppercase tracking-[0.25em] text-xs">Cómo funciona</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              De la preventa a las <span className="text-fiesta-green">rentas</span>
            </h2>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((st) => (
              <li
                key={st.n}
                className="relative rounded-3xl bg-card p-7 border-4 border-ink/5 shadow-lg"
              >
                <div className="absolute -top-5 left-6 bg-fiesta-red text-white font-display text-2xl rounded-2xl px-4 py-1 shadow-lg">
                  {st.n}
                </div>
                <h3 className="mt-4 font-display text-2xl">{st.title}</h3>
                <p className="mt-3 text-ink/75 font-body">{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PREVENTA / WALLET */}
      <section id="preventa" className="py-16 md:py-24 bg-gradient-to-b from-sand-deep/30 to-transparent">
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <p className="text-fiesta-red font-black uppercase tracking-[0.25em] text-xs">Preventa</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              Sé parte de la <span className="text-fiesta-red">plazuela</span>
            </h2>
            <p className="mt-4 text-ink/75 font-body text-lg">
              Adquiere tu NFT en <b>mUSD</b> sobre la red <b>Sepolia</b>. Login
              con tu correo — nosotros creamos tu wallet.
            </p>
            <ul className="mt-4 space-y-2 text-sm font-semibold">
              <li>✅ Sin extensiones, solo tu email</li>
              <li>✅ Pago 100% en mUSD (mock USDC, 6 decimales)</li>
              <li>✅ Faucet gratis para probar</li>
            </ul>
          </div>
          <div className="md:col-span-3">
            {hydrated ? (
              <Suspense fallback={<div className="rounded-2xl bg-card p-6 shadow-xl">Cargando…</div>}>
                <PrivyProviders>
                  <WalletCard />
                </PrivyProviders>
              </Suspense>
            ) : (
              <div className="rounded-3xl bg-card p-8 shadow-xl border-4 border-fiesta-red/20 h-72" />
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="bg-ink text-sand mt-8">
        <div className="papel-picado -translate-y-1" aria-hidden />
        <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-8">
          <div>
            <img src={logo.url} alt="Todos Santos" className="h-16 bg-sand/95 p-2 rounded-2xl inline-block" />
            <p className="mt-4 text-sand/70 font-body">
              Mercado turístico y plazuela mexicana en Puebla. Convivencia
              familiar, cultura y apoyo al talento local.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xl text-fiesta-yellow">Síguenos</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/search/top?q=Todos%20Santos%20Mercado%20Tur%C3%ADstico%20Puebla"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fiesta-yellow"
                >
                  📘 Facebook · Todos Santos - Mercado Turístico Puebla
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/Kiosco_todossantospue"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fiesta-yellow"
                >
                  📸 Instagram · @Kiosco_todossantospue
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl text-fiesta-yellow">Ubicación</h4>
            <p className="mt-3 text-sand/70 font-body">
              Puebla, México · Plazuela con estética de hacienda tradicional.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-sand/50">
          © {new Date().getFullYear()} Todos Santos · Hecho con 🌶️ en Puebla
        </div>
      </footer>
    </div>
  );
}

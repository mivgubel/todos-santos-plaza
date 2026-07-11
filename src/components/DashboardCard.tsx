import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { Link } from "@tanstack/react-router";
import {
  DIST_ADDRESS,
  MUSD_ADDRESS,
  NFT_ADDRESS,
  SEPOLIA_EXPLORER,
  distAbi,
  nftAbi,
} from "@/lib/contracts";

const publicClient = createPublicClient({ chain: sepolia, transport: http() });

type Tx = {
  hash: `0x${string}`;
  label: string;
  status: "pending" | "confirmed" | "failed";
};

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function DashboardCard() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const address = wallet?.address as `0x${string}` | undefined;

  const [nftBalance, setNftBalance] = useState<bigint | null>(null);
  const [dividends, setDividends] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState<Tx | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const nftConfigured =
    NFT_ADDRESS !== "0x0000000000000000000000000000000000000000";
  const distConfigured =
    DIST_ADDRESS !== "0x0000000000000000000000000000000000000000";

  const refresh = useCallback(async () => {
    if (!address || !nftConfigured) return;
    setLoading(true);
    try {
      const bal = (await publicClient.readContract({
        address: NFT_ADDRESS,
        abi: nftAbi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      setNftBalance(bal);

      if (distConfigured) {
        const div = (await publicClient.readContract({
          address: DIST_ADDRESS,
          abi: distAbi,
          functionName: "withdrawableDividendOf",
          args: [address],
        }).catch(() => 0n)) as bigint;
        setDividends(div);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [address, nftConfigured, distConfigured]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 20000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleClaim() {
    if (!address || !wallet) return;
    setErr(null);
    setBusy(true);
    try {
      await wallet.switchChain(sepolia.id);
      const provider = await wallet.getEthereumProvider();
      const client = createWalletClient({
        account: address,
        chain: sepolia,
        transport: custom(provider),
      });
      const hash = await client.writeContract({
        address: DIST_ADDRESS,
        abi: distAbi,
        functionName: "claim",
      });
      setTx({ hash, label: "Claim de rentas", status: "pending" });
      const r = await publicClient.waitForTransactionReceipt({ hash });
      setTx({
        hash,
        label: "Claim de rentas",
        status: r.status === "success" ? "confirmed" : "failed",
      });
      refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  const divLabel = useMemo(() => formatUnits(dividends, 6), [dividends]);

  if (!ready) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-xl border-4 border-ink/10">
        <div className="animate-pulse text-muted-foreground">
          Cargando panel…
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-xl border-4 border-fiesta-red/20 text-center">
        <h2 className="font-display text-3xl">Conecta tu wallet</h2>
        <p className="mt-2 text-ink/70">
          Inicia sesión con tu correo para ver tu panel de inversionista.
        </p>
        <button onClick={login} className="btn-fiesta mt-6">
          ✉️ Iniciar sesión
        </button>
      </div>
    );
  }

  const hasNfts = nftBalance !== null && nftBalance > 0n;

  return (
    <div className="rounded-3xl bg-card p-6 md:p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] border-4 border-fiesta-red/20 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-fiesta-yellow/40 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fiesta-red font-black">
              Panel de inversionista
            </p>
            <h2 className="text-3xl md:text-4xl font-display mt-1">
              ¡Hola, {user?.email?.address?.split("@")[0] ?? "inversionista"}!
            </h2>
          </div>
          <div className="text-right text-sm">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              Wallet
            </p>
            <p className="font-mono font-bold">
              {address ? short(address) : "…"}
            </p>
          </div>
        </div>

        {!nftConfigured ? (
          <p className="mt-6 text-sm text-muted-foreground">
            ℹ️ Define <code>VITE_NFT_ADDRESS</code> para consultar tus NFTs.
          </p>
        ) : loading && nftBalance === null ? (
          <div className="mt-8 h-32 rounded-2xl bg-sand-deep/30 animate-pulse" />
        ) : !hasNfts ? (
          <div className="mt-8 text-center rounded-2xl bg-sand-deep/30 p-8 border-2 border-dashed border-fiesta-red/30">
            <div className="text-5xl">🌵</div>
            <h3 className="mt-3 font-display text-2xl">
              Aún no eres inversionista
            </h3>
            <p className="mt-2 text-ink/70">
              Adquiere tu primer NFT en la preventa y empieza a recibir rentas.
            </p>
            <Link to="/" hash="preventa" className="btn-fiesta mt-6 inline-block">
              🎟️ Ir a la preventa
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-fiesta-blue/10 border-2 border-fiesta-blue/30 p-5">
                <p className="text-[11px] uppercase tracking-wider text-fiesta-blue font-black">
                  Tus NFTs
                </p>
                <p className="font-display text-5xl text-fiesta-blue mt-1">
                  {nftBalance!.toString()}
                </p>
                <p className="text-sm text-ink/70 mt-1">
                  {nftBalance === 1n ? "pieza" : "piezas"} de la Plazuela
                </p>
              </div>
              <div className="rounded-2xl bg-fiesta-green/10 border-2 border-fiesta-green/30 p-5">
                <p className="text-[11px] uppercase tracking-wider text-fiesta-green font-black">
                  Rentas acumuladas
                </p>
                <p className="font-display text-5xl text-fiesta-green mt-1">
                  {divLabel}
                  <span className="text-xl ml-1">mUSD</span>
                </p>
                <p className="text-sm text-ink/70 mt-1">
                  disponibles para reclamar
                </p>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={busy || dividends === 0n || !distConfigured}
              className="btn-fiesta w-full mt-5 text-lg disabled:opacity-50"
            >
              {busy
                ? "Procesando…"
                : dividends === 0n
                  ? "Sin rentas disponibles"
                  : `💰 Claim ${divLabel} mUSD`}
            </button>

            {!distConfigured && (
              <p className="mt-3 text-xs text-muted-foreground">
                ℹ️ Define <code>VITE_DIST_ADDRESS</code> para habilitar el
                claim de rentas.
              </p>
            )}
          </>
        )}

        {err && (
          <div className="mt-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
            {err}
          </div>
        )}

        {tx && (
          <div className="mt-4 rounded-xl bg-sand-deep/30 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={
                  tx.status === "pending"
                    ? "inline-block w-2 h-2 rounded-full bg-fiesta-yellow animate-pulse"
                    : tx.status === "confirmed"
                      ? "inline-block w-2 h-2 rounded-full bg-fiesta-green"
                      : "inline-block w-2 h-2 rounded-full bg-destructive"
                }
              />
              <span className="font-bold">{tx.label}</span>
              <span className="uppercase text-[10px] tracking-wider text-muted-foreground">
                {tx.status === "pending"
                  ? "Pendiente"
                  : tx.status === "confirmed"
                    ? "Confirmada"
                    : "Falló"}
              </span>
            </div>
            <a
              className="text-fiesta-blue underline font-mono text-xs break-all"
              href={`${SEPOLIA_EXPLORER}/tx/${tx.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver en Sepolia Etherscan ↗
            </a>
          </div>
        )}

        <button
          onClick={logout}
          className="mt-6 text-xs text-muted-foreground hover:text-fiesta-red underline"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

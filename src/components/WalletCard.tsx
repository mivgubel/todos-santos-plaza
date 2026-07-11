import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useMemo, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
  parseUnits,
} from "viem";
import { sepolia } from "viem/chains";
import {
  FAUCET_AMOUNT,
  MUSD_ADDRESS,
  NFT_ADDRESS,
  SEPOLIA_EXPLORER,
  musdAbi,
  nftAbi,
} from "@/lib/contracts";

const publicClient = createPublicClient({ chain: sepolia, transport: http() });

type Tx = { hash: `0x${string}`; label: string; status: "pending" | "confirmed" | "failed" };

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletCard() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const address = wallet?.address as `0x${string}` | undefined;

  const [balance, setBalance] = useState<bigint>(0n);
  const [price, setPrice] = useState<bigint>(parseUnits("100", 6));
  const [supply, setSupply] = useState<bigint>(0n);
  const [maxSupply, setMaxSupply] = useState<bigint>(0n);
  const [tx, setTx] = useState<Tx | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const configured =
    MUSD_ADDRESS !== "0x0000000000000000000000000000000000000000" &&
    NFT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  async function refresh() {
    if (!configured) return;
    try {
      const [p, s, m] = await Promise.all([
        publicClient.readContract({ address: NFT_ADDRESS, abi: nftAbi, functionName: "price" }).catch(() => parseUnits("100", 6)),
        publicClient.readContract({ address: NFT_ADDRESS, abi: nftAbi, functionName: "totalSupply" }).catch(() => 0n),
        publicClient.readContract({ address: NFT_ADDRESS, abi: nftAbi, functionName: "MAX_SUPPLY" }).catch(() => 0n),
      ]);
      setPrice(p as bigint);
      setSupply(s as bigint);
      setMaxSupply(m as bigint);
      if (address) {
        const b = (await publicClient.readContract({
          address: MUSD_ADDRESS,
          abi: musdAbi,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;
        setBalance(b);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, configured]);

  async function getWalletClient() {
    if (!wallet) throw new Error("Wallet no lista");
    await wallet.switchChain(sepolia.id);
    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
      account: address!,
      chain: sepolia,
      transport: custom(provider),
    });
  }

  async function trackTx(hash: `0x${string}`, label: string) {
    setTx({ hash, label, status: "pending" });
    try {
      const r = await publicClient.waitForTransactionReceipt({ hash });
      setTx({ hash, label, status: r.status === "success" ? "confirmed" : "failed" });
      refresh();
    } catch {
      setTx({ hash, label, status: "failed" });
    }
  }

  async function handleFaucet() {
    if (!address) return;
    setErr(null);
    setBusy(true);
    try {
      const client = await getWalletClient();
      const hash = await client.writeContract({
        address: MUSD_ADDRESS,
        abi: musdAbi,
        functionName: "mint",
        args: [address, parseUnits(FAUCET_AMOUNT, 6)],
      });
      trackTx(hash, `Faucet · +${FAUCET_AMOUNT} mUSD`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleBuy() {
    if (!address) return;
    setErr(null);
    setBusy(true);
    try {
      const client = await getWalletClient();
      const approveHash = await client.writeContract({
        address: MUSD_ADDRESS,
        abi: musdAbi,
        functionName: "approve",
        args: [NFT_ADDRESS, price],
      });
      setTx({ hash: approveHash, label: "Aprobando mUSD…", status: "pending" });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      const buyHash = await client.writeContract({
        address: NFT_ADDRESS,
        abi: nftAbi,
        functionName: "buyNFT",
      });
      trackTx(buyHash, "Compra de NFT");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  const priceLabel = useMemo(() => formatUnits(price, 6), [price]);
  const balLabel = useMemo(() => formatUnits(balance, 6), [balance]);

  if (!ready) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-xl border-4 border-ink/10">
        <div className="animate-pulse text-muted-foreground">Cargando wallet…</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] border-4 border-fiesta-red/20 relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-fiesta-yellow/40 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fiesta-red font-black">
              Colección activa
            </p>
            <h3 className="text-3xl md:text-4xl font-display mt-1">Plazuela Génesis</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display text-fiesta-red">
              {priceLabel} <span className="text-lg">mUSD</span>
            </div>
            <div className="text-sm text-muted-foreground font-semibold">
              {supply.toString()} / {maxSupply.toString() || "—"} vendidos
            </div>
          </div>
        </div>

        <div className="my-5 h-3 rounded-full bg-sand-deep/40 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fiesta-red via-fiesta-orange to-fiesta-yellow transition-all"
            style={{
              width:
                maxSupply > 0n
                  ? `${Math.min(100, Number((supply * 100n) / maxSupply))}%`
                  : "0%",
            }}
          />
        </div>

        {!authenticated ? (
          <button onClick={login} className="btn-fiesta w-full text-lg">
            ✉️ Conectar / Crear Wallet con Correo
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 bg-sand-deep/30 rounded-xl px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  {user?.email?.address ?? "Wallet"}
                </p>
                <p className="font-mono font-bold text-ink">
                  {address ? short(address) : "…"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  Saldo
                </p>
                <p className="font-display text-xl text-fiesta-green">
                  {balLabel} mUSD
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleFaucet}
                disabled={busy}
                className="rounded-full bg-fiesta-blue text-white font-black py-3 px-4 shadow-[0_5px_0_oklch(0.3_0.15_250)] hover:translate-y-0.5 hover:shadow-[0_3px_0_oklch(0.3_0.15_250)] transition disabled:opacity-50"
              >
                💧 Obtener mUSD (faucet)
              </button>
              <button
                onClick={handleBuy}
                disabled={busy || balance < price}
                className="btn-fiesta disabled:opacity-50"
              >
                🎟️ Comprar NFT ({priceLabel} mUSD)
              </button>
            </div>

            <button
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-fiesta-red underline"
            >
              Cerrar sesión
            </button>
          </div>
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

        {!configured && (
          <p className="mt-4 text-xs text-muted-foreground">
            ℹ️ Define <code>VITE_MUSD_ADDRESS</code> y <code>VITE_NFT_ADDRESS</code>{" "}
            para habilitar las transacciones on-chain.
          </p>
        )}
      </div>
    </div>
  );
}

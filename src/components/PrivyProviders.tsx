import { PrivyProvider } from "@privy-io/react-auth";
import type { ReactNode } from "react";
import { sepolia } from "viem/chains";
import { PRIVY_APP_ID } from "@/lib/contracts";

export function PrivyProviders({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <>
        <div className="bg-fiesta-yellow text-ink text-sm px-4 py-2 text-center font-semibold">
          ⚠️ Configura <code className="font-mono">VITE_PRIVY_APP_ID</code> para
          habilitar el login con Privy.
        </div>
        {children}
      </>
    );
  }
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "light",
          accentColor: "#C0392B",
          logo: undefined,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        defaultChain: sepolia,
        supportedChains: [sepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

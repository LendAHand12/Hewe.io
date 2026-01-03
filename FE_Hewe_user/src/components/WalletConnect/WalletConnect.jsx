import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal, useWeb3ModalTheme } from "@web3modal/react";
import { useEffect } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { heweChain56 } from "../../data/myChain56.ts";
import Account from "./Account.jsx";

const chains = [heweChain56];

const projectId = "9e580cc438a1b04ff55f174f88b7ac51";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function WalletConnect() {
  const { _, setTheme } = useWeb3ModalTheme();

  useEffect(() => {
    const webCurrentTheme = "light";

    setTheme({
      themeMode: webCurrentTheme,
      themeVariables: {
        "--w3m-font-family": "Source Sans 3",
        "--w3m-overlay-background-color": "rgba(0, 0, 0, 0.8)",
        "--w3m-overlay-backdrop-filter": "blur(2px)",
        "--w3m-accent-color": "#03011d",
        "--w3m-background-color": "#03011d",
        "--w3m-logo-image-url": "https://dev.hewe.io/static/media/footerlogo.820b57520ea46f39c9cd.png",
      },
    });
  }, []);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Account />
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} defaultChain={heweChain56} />
    </>
  );
}

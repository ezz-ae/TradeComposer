
'use client';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains([polygon, mainnet, arbitrum, optimism], [publicProvider()]);
const { connectors } = getDefaultWallets({ appName: 'TradeComposer', projectId: 'WALLETCONNECT_PROJECT_ID', chains });

const config = createConfig({ autoConnect: true, connectors, publicClient });

export default function WalletProvider({ children }:{ children:any }){
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}

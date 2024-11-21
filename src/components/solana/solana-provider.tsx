import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useMemo, ReactNode, useCallback } from 'react';
import { WalletError, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useCluster } from '../cluster/cluster-data-access';

import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => {
    if (cluster.network === 'mainnet-beta') {
      return 'https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb';
    }
    return cluster.endpoint;
  }, [cluster]);

  const walletNetwork = useMemo<WalletAdapterNetwork | undefined>(() => {
    switch (cluster.network) {
      case 'mainnet-beta':
        return undefined;
      case 'devnet':
        return WalletAdapterNetwork.Devnet;
      case 'testnet':
        return WalletAdapterNetwork.Testnet;
      default:
        return undefined;
    }
  }, [cluster.network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: walletNetwork }),
      new TorusWalletAdapter(),
    ],
    [walletNetwork]
  );

  const onError = useCallback((error: WalletError) => {
    console.error('Wallet Error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
import { useWallet } from '@solana/wallet-adapter-react';

const WalletMultiButtonCustom = () => {
  const { connected } = useWallet(); // Check wallet connection state

  return (
    <WalletMultiButton
      className={`transition transform hover:scale-105 focus:ring-2 focus:ring-green-500 ${
        connected ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-indigo-700'
      }`}
    >
      {connected ? undefined : 'Connect'}
    </WalletMultiButton>
  );
};

// export default WalletMultiButton;

export const WalletButton = WalletMultiButtonCustom; // Ensure the default WalletMultiButton is exported

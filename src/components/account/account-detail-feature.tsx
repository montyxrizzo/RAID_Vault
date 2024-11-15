import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui';

interface BackendInfo {
  status: string;
  benchmark_score: number;
  total_uptime: number;         // Total uptime in seconds
  total_rewards: number;        // Sum of rewards earned
  available_rewards: number;    // Rewards available for claiming
}

export default function AccountDetailFeature() {
  const { publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [backendInfo, setBackendInfo] = useState<BackendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false); // New state for claim status

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toBase58();
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchBackendInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/client-data/${walletAddress}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: BackendInfo = await response.json();
        setBackendInfo(data);
      } catch (error) {
        setError('Failed to load backend information');
      } finally {
        setLoading(false);
      }
    };

    fetchBackendInfo();
  }, [walletAddress]);

  // Claim rewards function
  const claimRewards = async () => {
    if (!walletAddress) return;

    try {
      setClaiming(true);
      const response = await fetch(`http://127.0.0.1:8000/client-data/${walletAddress}/claim`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to claim rewards");
      }
      const data: { available_rewards: number; total_rewards: number } = await response.json();
      setBackendInfo((prevInfo) => prevInfo ? { ...prevInfo, available_rewards: data.available_rewards } : null);
    } catch (error) {
      setError("Error claiming rewards");
    } finally {
      setClaiming(false);
    }
  };

  if (!publicKey) {
    return <div>Please connect your wallet to view account details.</div>;
  }

  return (
    <div>
      <AppHero
        title={<AccountBalance address={publicKey} />}
        subtitle={
          <div className="my-4">
            <ExplorerLink path={`account/${publicKey}`} label={ellipsify(publicKey.toString())} />
          </div>
        }
      >
        <div className="my-4">
          <AccountButtons address={publicKey} />
        </div>
      </AppHero>

      <div className="space-y-8">
        <AccountTokens address={publicKey} />
        <AccountTransactions address={publicKey} />

        {/* Backend Info Section */}
        <div className="my-4 p-4 border border-gray-200 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Client Usage Details</h2>
          {loading && <p>Loading backend info...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {backendInfo && (
            <div>
              <p><strong>Status:</strong> {backendInfo.status}</p>
              <p><strong>Benchmark Score:</strong> {backendInfo.benchmark_score}</p>
              <p><strong>Total Uptime:</strong> {Math.floor(backendInfo.total_uptime / 3600)}h {Math.floor((backendInfo.total_uptime % 3600) / 60)}m</p>
              <p><strong>Total Rewards Earned:</strong> {backendInfo.total_rewards} RAID</p>
              <p><strong>Available Rewards:</strong> {backendInfo.available_rewards} RAID</p>
              <button
                onClick={claimRewards}
                disabled={claiming || backendInfo.available_rewards <= 0}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim Rewards"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

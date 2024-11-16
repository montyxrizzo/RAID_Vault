import { PublicKey, Transaction, Connection, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define constants
const RAID_MINT_ADDRESS = 'BPFw62HkLiacp1h7MCitiWRZHpWSThxycDbVmn7rMUGx'; // Replace with actual mint
const PROGRAM_ID = '6jqDCg61WsLqXeSDYSiv3s46USRGKvKskadScJvNYcPH'; // Replace with actual program ID
const VAULT_PDA = 'CdFwDp8Mt2WbvaenKDKs99CjDsBqKwrFWTSSckkuNFmU'; // Replace with actual PDA
const DECIMALS = 9;

export default function AccountDetailFeature() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amountStaked, setAmountStaked] = useState<number>(0);
  const [availableToStake, setAvailableToStake] = useState<number>(0);
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection('https://api.devnet.solana.com', 'processed');

  useEffect(() => {
    if (publicKey) {
      fetchWalletBalance();
      fetchStakeBalance();
    }
  }, [publicKey]);

  // Fetch available SOL balance
  const fetchWalletBalance = async () => {
    if (!publicKey) return;
    try {
      const balance = await connection.getBalance(publicKey);
      setAvailableToStake(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setError('Failed to fetch wallet balance.');
    }
  };

  // Fetch staked balance from the stake pool
  const fetchStakeBalance = async () => {
    if (!publicKey) return;
    try {
      const stakeAccountInfo = await connection.getParsedAccountInfo(new PublicKey(VAULT_PDA));

      if (stakeAccountInfo.value) {
        console.log('Stake Account Info:', stakeAccountInfo);
        const stakedLamports = stakeAccountInfo.value.lamports || 0;
        setAmountStaked(stakedLamports / 1e9); // Convert lamports to SOL
      } else {
        setAmountStaked(0);
      }
    } catch (error) {
      console.error('Error fetching stake balance:', error);
      setError('Failed to fetch staked balance.');
    }
  };

  // Stake SOL
  const handleStake = async () => {
    if (!connected || !publicKey) {
      setError('Wallet not connected.');
      return;
    }

    if (stakingAmount <= 0 || stakingAmount > availableToStake) {
      setError('Invalid staking amount.');
      return;
    }

    try {
      setError(null);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(VAULT_PDA),
          lamports: stakingAmount * 1e9, // Convert SOL to lamports
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log('Stake Transaction Signature:', signature);

      await connection.confirmTransaction(signature, 'processed');
      toast.success(`Successfully staked ${stakingAmount} SOL.`);
      fetchWalletBalance();
      fetchStakeBalance();
      setStakingAmount(0);
    } catch (error) {
      console.error('Error staking SOL:', error);
      setError('Failed to stake SOL.');
    }
  };

  // Unstake SOL
  const handleUnstake = async () => {
    if (!connected || !publicKey) {
      setError('Wallet not connected.');
      return;
    }

    if (stakingAmount <= 0 || stakingAmount > amountStaked) {
      setError('Invalid unstaking amount.');
      return;
    }

    try {
      setError(null);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(VAULT_PDA),
          toPubkey: publicKey,
          lamports: stakingAmount * 1e9, // Convert SOL to lamports
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log('Unstake Transaction Signature:', signature);

      await connection.confirmTransaction(signature, 'processed');
      toast.success(`Successfully unstaked ${stakingAmount} SOL.`);
      fetchWalletBalance();
      fetchStakeBalance();
      setStakingAmount(0);
    } catch (error) {
      console.error('Error unstaking SOL:', error);
      setError('Failed to unstake SOL.');
    }
  };

  return (
    <div>
      <ToastContainer />
      <AppHero title={<AccountBalance address={publicKey!} />} subtitle={ellipsify(publicKey?.toString())}>
        <AccountButtons address={publicKey!} />
      </AppHero>

      <div className="space-y-8">
        <AccountTokens address={publicKey!} />
        <AccountTransactions address={publicKey!} />

        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Staking</h2>
          <p>
            <strong>Amount Staked:</strong> {amountStaked} SOL
          </p>
          <p>
            <strong>Available to Stake:</strong> {availableToStake} SOL
          </p>
          <div className="flex items-center mt-4">
            <input
              type="number"
              value={stakingAmount}
              onChange={(e) => setStakingAmount(Number(e.target.value))}
              placeholder="Amount"
              className="px-2 py-1 border rounded mr-2"
            />
            <button
              onClick={handleStake}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={stakingAmount <= 0 || stakingAmount > availableToStake}
            >
              Stake
            </button>
            <button
              onClick={handleUnstake}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={stakingAmount <= 0 || stakingAmount > amountStaked}
            >
              Unstake
            </button>
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

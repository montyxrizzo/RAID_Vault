import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { depositSol, withdrawSol } from '@solana/spl-stake-pool';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Constants
const STAKE_POOL_PROGRAM_ID = new PublicKey('CUZSoS7yQa2pYJ6g3VFNXVApN42sXLhiDKyosM4bKJkn'); // Stake pool program ID
const STAKE_POOL_ID = new PublicKey('E17hzYQczWxUeVMQqsniqoZH4ZYj5koXUmAxYe4KDEdL'); // Stake pool ID
const POOL_TOKEN_MINT = new PublicKey('Lx48m36jmsyudPHs6SNUD3dsJ81J6ivsEVeCUsWQsBp'); // Pool token mint
const connection = new Connection('https://api.devnet.solana.com', 'processed');

export default function AccountDetailFeature() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [amountToStake, setAmountToStake] = useState<number>(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);
  const [transactions, setTransactions] = useState<string[]>([]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!publicKey) return;
    try {
      const balance = await connection.getBalance(publicKey);
      setWalletBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to fetch wallet balance.');
    }
  };

  // Fetch staked balance
  const fetchStakedBalance = async () => {
    if (!publicKey) return;
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const poolTokenAccount = tokenAccounts.value.find(
        (accountInfo) =>
          accountInfo.account.data.parsed.info.mint === POOL_TOKEN_MINT.toBase58()
      );

      const balance =
        poolTokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;
      setStakedAmount(balance);
    } catch (error) {
      console.error('Error fetching staked balance:', error);
      toast.error('Failed to fetch staked balance.');
    }
  };

  // Stake SOL
  const stakeSol = async () => {
    if (!connected || !publicKey) {
      toast.error('Wallet not connected.');
      return;
    }

    if (amountToStake <= 0 || amountToStake > walletBalance) {
      toast.error('Invalid staking amount.');
      return;
    }

    try {
      const lamports = amountToStake * 1e9;

      const { instructions, signers } = await depositSol(
        connection,
        STAKE_POOL_ID,
        publicKey,
        lamports
      );

      const transaction = new Transaction().add(...instructions);

      const signature = await sendTransaction(transaction, connection, { signers });
      await connection.confirmTransaction(signature, 'processed');
      toast.success(`Successfully staked ${amountToStake} SOL.`);
      setTransactions((prev) => [`Staked: ${amountToStake} SOL (Tx: ${signature})`, ...prev]);

      fetchWalletBalance();
      fetchStakedBalance();
      setAmountToStake(0);
    } catch (error) {
      console.error('Error staking SOL:', error);
      toast.error('Failed to stake SOL.');
    }
  };

  // Withdraw SOL
  const withdrawStake = async () => {
    if (!connected || !publicKey) {
      toast.error('Wallet not connected.');
      return;
    }

    if (amountToWithdraw <= 0 || amountToWithdraw > stakedAmount) {
      toast.error('Invalid withdrawal amount.');
      return;
    }

    try {
      const lamports = amountToWithdraw * 1e9;

      const { instructions, signers } = await withdrawSol(
        connection,
        STAKE_POOL_ID,
        publicKey,
        publicKey,
        lamports
      );

      const transaction = new Transaction().add(...instructions);

      const signature = await sendTransaction(transaction, connection, { signers });
      await connection.confirmTransaction(signature, 'processed');
      toast.success(`Successfully withdrew ${amountToWithdraw} SOL.`);
      setTransactions((prev) => [`Withdrew: ${amountToWithdraw} SOL (Tx: ${signature})`, ...prev]);

      fetchWalletBalance();
      fetchStakedBalance();
      setAmountToWithdraw(0);
    } catch (error) {
      console.error('Error withdrawing SOL:', error);
      toast.error('Failed to withdraw SOL.');
    }
  };

  useEffect(() => {
    if (connected) {
      fetchWalletBalance();
      fetchStakedBalance();
    }
  }, [connected]);

  return (
    <div>
      <ToastContainer />
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Account Details</h2>
        <p>
          <strong>Wallet Balance:</strong> {walletBalance} SOL
        </p>
        <p>
          <strong>Staked Amount:</strong> {stakedAmount} Pool Tokens
        </p>
      </div>

      <div className="p-4 border rounded-lg shadow mt-4">
        <h2 className="text-lg font-semibold mb-2">Stake SOL</h2>
        <input
          type="number"
          value={amountToStake}
          onChange={(e) => setAmountToStake(Number(e.target.value))}
          placeholder="Amount to Stake"
          className="px-2 py-1 border rounded mr-2"
        />
        <button
          onClick={stakeSol}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={amountToStake <= 0 || amountToStake > walletBalance}
        >
          Stake
        </button>
      </div>

      <div className="p-4 border rounded-lg shadow mt-4">
        <h2 className="text-lg font-semibold mb-2">Withdraw SOL</h2>
        <input
          type="number"
          value={amountToWithdraw}
          onChange={(e) => setAmountToWithdraw(Number(e.target.value))}
          placeholder="Amount to Withdraw"
          className="px-2 py-1 border rounded mr-2"
        />
        <button
          onClick={withdrawStake}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={amountToWithdraw <= 0 || amountToWithdraw > stakedAmount}
        >
          Withdraw
        </button>
      </div>

      <div className="p-4 border rounded-lg shadow mt-4">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        <ul className="list-disc pl-5">
          {transactions.map((tx, index) => (
            <li key={index}>{tx}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

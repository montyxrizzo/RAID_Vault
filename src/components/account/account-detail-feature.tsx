import {
  Connection,
  PublicKey,
  Transaction,

  Keypair,
} from '@solana/web3.js';
import {
  depositSol,
  withdrawSol,
} from '@solana/spl-stake-pool';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Constants
const RAID_TOKEN_MINT = new PublicKey('mntWBdvPz3NuxFNtYtb1whQm3XeYDtbpyvT2dBjKsa6'); // RAID token mint
const STAKE_POOL_ID = new PublicKey('E17hzYQczWxUeVMQqsniqoZH4ZYj5koXUmAxYe4KDEdL'); // Stake pool ID
const POOL_TOKEN_MINT = new PublicKey('Lx48m36jmsyudPHs6SNUD3dsJ81J6ivsEVeCUsWQsBp'); // Pool token mint
const connection = new Connection('https://api.devnet.solana.com', 'processed');
const API_BASE_URL = 'http://localhost:8000'; // Replace with your backend URL
const REWARDS_VAULT = new PublicKey('EvoH3MxRu2HrcZb9rYcFEngkXzCnQRUisfumVCDBDmLd');
// const REWARDS_VAULT = new PublicKey('CDnv9mzdK8NVqh1NqrcpepoawXsKSxGcNLNeDTCteVSz'); // Rewards vault address
const REWARD_WALLET = Keypair.fromSecretKey(
  Uint8Array.from([155,156,175,177,249,243,99,119,137,61,1,171,225,47,61,135,53,196,178,30,255,14,23,26,164,218,10,38,200,181,203,206,12,184,90,133,215,159,63,245,75,207,133,212,176,8,218,91,113,41,236,179,222,77,152,19,116,233,217,68,253,114,198,224])
);
const REWARD_TRACKING_PROGRAM_ID = new PublicKey('58sp67CCFvpnbKtW1JnLa64FGR69ptep2wj1UfMEP9Z7');

const REWARDS_VAULT_AUTHORITY = REWARD_WALLET.publicKey;

export default function AccountDetailFeature() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [claimableRewards, setClaimableRewards] = useState<number>(0);
  const [amountToStake, setAmountToStake] = useState<number>(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [apy, setApy] = useState<number>(0);

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
      // Sync fetched data to the server
     
    // Fetch claimable rewards from the server
    const response = await axios.get(
      `${API_BASE_URL}/staking-data/${publicKey.toBase58()}`
    );
    const { amount_staked, staking_rewards } = response.data;
    console.log(response.data)
      setClaimableRewards(staking_rewards  || 0);
    } catch (error) {
      console.error('Error fetching staked balance:', error);
      toast.error('Failed to fetch staked balance.');
    }
  };

  // Fetch APY from the backend
  const fetchApy = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staking-data/reward-rate`);
      setApy(response.data.apy);
    } catch (error) {
      console.error('Error fetching APY:', error);
      toast.error('Failed to fetch APY.');
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
      
      try {
        await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/deposit`, {
          amount: amountToStake,
        });
        toast.success("Staking data synchronized successfully.");
      } catch (syncError) {
        console.error("Error syncing staking data:", syncError);
        toast.error("Failed to synchronize staking data with the server.");
      }
      
      fetchWalletBalance();
      fetchStakedBalance();
      setAmountToStake(0);
    } catch (error) {
      console.error('Error staking SOL:', error);
      toast.error('Failed to stake SOL.');
    }
  };


// Calculate and transfer RAID rewards
const calculateAndTransferRaidRewards = async (lpTokenAmount: number): Promise<void> => {
  if (!publicKey || lpTokenAmount <= 0) {
    console.error('Invalid public key or LP token amount.');
    return;
  }

  try {
    const rewardsRate = 0.1; // 10% rewards rate
    const claimableRewards = lpTokenAmount * rewardsRate;
    console.log(`Calculated Claimable Rewards: ${claimableRewards} RAID`);

    // Ensure the rewards vault has an associated token account for the RAID mint
    const rewardsVaultAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      REWARD_WALLET, // Fee payer
      RAID_TOKEN_MINT, // RAID mint
      REWARDS_VAULT_AUTHORITY // Owner of the token account
    );

    console.log("Rewards Vault Account:", rewardsVaultAccount.address.toBase58());

    // Transfer RAID directly to the user's wallet
    const transferInstruction = createTransferInstruction(
      rewardsVaultAccount.address, // Source account
      publicKey, // User's Solana wallet address (RAID account created automatically if needed)
      REWARDS_VAULT_AUTHORITY, // Authority of the source account
      Math.floor(claimableRewards * 1e9), // Amount to transfer in smallest unit
      [], // No multi-signers
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(transferInstruction);
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = publicKey;
    transaction.recentBlockhash = latestBlockhash.blockhash;

    console.log("Sending transaction to transfer RAID rewards...");
    const signature = await sendTransaction(transaction, connection, { signers: [REWARD_WALLET] });
    await connection.confirmTransaction(signature, 'processed');

    console.log(`Transferred ${claimableRewards.toFixed(2)} RAID tokens to ${publicKey.toBase58()}.`);
    setClaimableRewards(0); // Reset claimable rewards
    toast.success(`Successfully transferred ${claimableRewards.toFixed(2)} RAID.`);
  } catch (error) {
    console.error("Error transferring RAID rewards:", error);
    toast.error('Failed to transfer RAID rewards.');
  }
};

// Withdraw SOL and trigger RAID rewards transfer
const withdrawStake = async () => {
  if (!connected || !publicKey) {
    toast.error("Wallet not connected.");
    return;
  }

  if (amountToWithdraw <= 0 || amountToWithdraw > stakedAmount) {
    toast.error("Invalid withdrawal amount.");
    return;
  }

  try {
    const lamports = amountToWithdraw;

    const { instructions, signers } = await withdrawSol(
      connection,
      STAKE_POOL_ID,
      publicKey,
      publicKey, // SOL destination account
      lamports
    );

    const transaction = new Transaction().add(...instructions);
    const signature = await sendTransaction(transaction, connection, { signers });
    await connection.confirmTransaction(signature, "processed");
    toast.success(`Successfully withdrew ${amountToWithdraw} SOL.`);
    setTransactions((prev) => [`Withdrew: ${amountToWithdraw} SOL (Tx: ${signature})`, ...prev]);

      // Sync withdrawal data to the server
      await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/withdraw`, {
        amount: amountToWithdraw, // Ensure this matches backend expectations
      });
      // toast.success(`Claimed ${earnedRewards.toFixed(2)} RAID rewards.`);
    fetchWalletBalance();
    fetchStakedBalance();
    setAmountToWithdraw(0);
  } catch (error) {
    console.error("Error withdrawing SOL:", error);
    toast.error("Failed to withdraw SOL.");
  }
};
const claimRewards = async () => {
  if (!publicKey) return;
  try {
    const response = await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/claim-rewards`);
    const { claimed_rewards } = response.data;
    toast.success(`Successfully claimed ${claimed_rewards.toFixed(2)} RAID.`);
    fetchStakedBalance(); // Refresh data after claiming
  } catch (error) {
    console.error('Error claiming rewards:', error);
    toast.error('Failed to claim rewards.');
  }
};



  useEffect(() => {
    if (connected) {
      fetchWalletBalance();
      fetchStakedBalance();
      fetchApy();
         // Periodically refresh claimable rewards
         const interval = setInterval(() => {
          fetchStakedBalance();
        }, 30000); // Refresh every 30 seconds
  
        return () => clearInterval(interval);
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
        <p>
        <strong>Claimable Rewards:</strong> 
        {claimableRewards !== undefined 
          ? ` ${claimableRewards.toFixed(10)} RAID` 
          : "Loading..."}
        </p>

        <p><strong>APY:</strong> {(apy * 100).toFixed(2)}%</p>
        <br></br>
        <button
          onClick={claimRewards}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={claimableRewards <= 0}
        >
          Claim RAID Rewards
        </button>
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

      {/* <div className="p-4 border rounded-lg shadow mt-4">
        <h2 className="text-lg font-semibold mb-2">Claim Rewards</h2>
        <button
          onClick={claimRaidRewardsUsingProgram}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={claimableRewards <= 0}
        >
          Claim RAID Rewards
        </button>
      </div> */}

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

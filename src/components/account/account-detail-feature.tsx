import {
  Connection,
  PublicKey,
  Transaction,
SystemProgram,
TransactionInstruction,
  Keypair,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  depositSol,
  withdrawSol,
} from '@solana/spl-stake-pool';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  mintToChecked,
  TOKEN_PROGRAM_ID,
  NATIVE_MINT_2022,
  createMintToInstruction,
} from '@solana/spl-token';
import fs from 'fs';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Constants
const RAID_MINT_ADDRESS = new PublicKey('mntLAh1cgKwmBJBMG4aszeG5CMdZVV81hnc2C6vSEoz');
const RAID_TOKEN_MINT = new PublicKey('mntLAh1cgKwmBJBMG4aszeG5CMdZVV81hnc2C6vSEoz'); // RAID token mint
const STAKE_POOL_ID = new PublicKey('E17hzYQczWxUeVMQqsniqoZH4ZYj5koXUmAxYe4KDEdL'); // Stake pool ID
const POOL_TOKEN_MINT = new PublicKey('Lx48m36jmsyudPHs6SNUD3dsJ81J6ivsEVeCUsWQsBp'); // Pool token mint
const connection = new Connection('https://api.devnet.solana.com', 'processed');
const API_BASE_URL = 'http://localhost:8000'; // Replace with your backend URL
const REWARDS_VAULT = new PublicKey('EvoH3MxRu2HrcZb9rYcFEngkXzCnQRUisfumVCDBDmLd');
const DECIMALS = 9; // Number of decimals for RAID token
const CUSTOM_TOKEN_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

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
      if (balance === 0) {
        console.log("No staked balance, skipping API call.");
        // setClaimableRewards(0);
        return;
      }
  
    // Fetch claimable rewards from the server
    const response = await axios.get(
      `${API_BASE_URL}/staking-data/${publicKey.toBase58()}`
    );
    const { amount_staked, staking_rewards } = response.data;
    console.log(response.data)
      setClaimableRewards(staking_rewards);
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
      const lamports = Math.floor(amountToStake * 1e9);

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
// const calculateAndTransferRaidRewards = async (lpTokenAmount: number): Promise<void> => {
//   if (!publicKey || lpTokenAmount <= 0) {
//     console.error('Invalid public key or LP token amount.');
//     return;
//   }

//   try {
//     const rewardsRate = 0.1; // 10% rewards rate
//     const claimableRewards = lpTokenAmount * rewardsRate;
//     console.log(`Calculated Claimable Rewards: ${claimableRewards} RAID`);

//     // Ensure the rewards vault has an associated token account for the RAID mint
//     const rewardsVaultAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       REWARD_WALLET, // Fee payer
//       RAID_TOKEN_MINT, // RAID mint
//       REWARDS_VAULT_AUTHORITY // Owner of the token account
//     );

//     console.log("Rewards Vault Account:", rewardsVaultAccount.address.toBase58());

//     // Transfer RAID directly to the user's wallet
//     const transferInstruction = createTransferInstruction(
//       rewardsVaultAccount.address, // Source account
//       publicKey, // User's Solana wallet address (RAID account created automatically if needed)
//       REWARDS_VAULT_AUTHORITY, // Authority of the source account
//       Math.floor(claimableRewards * 1e9), // Amount to transfer in smallest unit
//       [], // No multi-signers
//       TOKEN_PROGRAM_ID
//     );

//     const transaction = new Transaction().add(transferInstruction);
//     const latestBlockhash = await connection.getLatestBlockhash();
//     transaction.feePayer = publicKey;
//     transaction.recentBlockhash = latestBlockhash.blockhash;

//     console.log("Sending transaction to transfer RAID rewards...");
//     const signature = await sendTransaction(transaction, connection, { signers: [REWARD_WALLET] });
//     await connection.confirmTransaction(signature, 'processed');

//     console.log(`Transferred ${claimableRewards.toFixed(2)} RAID tokens to ${publicKey.toBase58()}.`);
//     setClaimableRewards(0); // Reset claimable rewards
//     toast.success(`Successfully transferred ${claimableRewards.toFixed(2)} RAID.`);
//   } catch (error) {
//     console.error("Error transferring RAID rewards:", error);
//     toast.error('Failed to transfer RAID rewards.');
//   }
// };

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
      
    // Convert SOL to lamports and ensure integer values
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

const claimRewards = async (publicKey: PublicKey) => {
  if (!publicKey) {
    toast.error('Wallet not connected.');
    return;
  }

  try {
    // Fetch claimable rewards from the backend
    const response = await axios.post(
      `${API_BASE_URL}/staking-data/${publicKey.toBase58()}/claim-rewards`
    );
    const { claimed_rewards } = response.data;

    // Ensure rewards are greater than zero
    if (claimed_rewards <= 0) {
      toast.error('No rewards to claim.');
      return;
    }

    console.log(`Claimable rewards: ${claimed_rewards}`);

    // Update to the new mint address and custom program ID
    const RAID_MINT_ADDRESS = new PublicKey('mnt2sTipfENeVjbVY7Tt8XPwps1EsELZQYeZivSF14v');
    const CUSTOM_TOKEN_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

    // Mint authority (hard-coded for testing)
    const mintAuthorityKeypair = Keypair.fromSecretKey(
      Uint8Array.from([
        50, 174, 46, 66, 193, 4, 111, 223, 135, 48, 242, 200, 215, 31, 125, 101, 121,
        75, 135, 207, 91, 180, 96, 79, 226, 62, 168, 111, 101, 210, 23, 157, 237, 216,
        27, 84, 223, 122, 169, 247, 14, 105, 151, 248, 87, 96, 173, 40, 218, 74, 83,
        177, 2, 32, 4, 122, 90, 171, 85, 7, 59, 211, 83, 42
      ])
    );

    // Get the associated token account for the user
    const userTokenAccount = await getAssociatedTokenAddress(
      RAID_MINT_ADDRESS,
      publicKey,
      false, // Don't allow the account to be closed
      CUSTOM_TOKEN_PROGRAM_ID
    );

    console.log(`User's Token Account: ${userTokenAccount.toBase58()}`);

    const transaction = new Transaction();

    // Check if the associated token account exists, and create one if necessary
    const userAccountExists = await connection.getAccountInfo(userTokenAccount);
    if (!userAccountExists) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey, // Fee payer
          userTokenAccount, // Associated token account
          publicKey, // Owner
          RAID_MINT_ADDRESS, // Mint
          CUSTOM_TOKEN_PROGRAM_ID // Custom token program ID
        )
      );
    }

    // Calculate the amount to mint in the smallest unit
    const amountToMint = Math.floor(claimed_rewards * 10 ** DECIMALS);

    // Add the mintTo instruction
    transaction.add(
      createMintToInstruction(
        RAID_MINT_ADDRESS,
        userTokenAccount,
        mintAuthorityKeypair.publicKey, // Mint authority
        amountToMint,
        [], // No multisig required
        CUSTOM_TOKEN_PROGRAM_ID
      )
    );

    // Set the fee payer to the connected wallet
    transaction.feePayer = publicKey;

    // Fetch the latest blockhash for the transaction
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // Sign the transaction with the mint authority
    transaction.partialSign(mintAuthorityKeypair);

    // Send and confirm the transaction using the connected wallet
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'processed');

    console.log(`Minted ${claimed_rewards} RAID to ${userTokenAccount.toBase58()}.`);
    console.log(`Transaction Signature: ${signature}`);
    toast.success(`Successfully claimed ${claimed_rewards} RAID.`);
    setClaimableRewards(0);
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

      <div className="bg-gray-900 min-h-screen p-6 flex flex-col items-center text-gray-200">
        <ToastContainer />
        {/* Header Section */}
        <div className="max-w-3xl w-full text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">RAID Community Staking Pool</h1>
          <p className="text-gray-300 text-lg">
            Join the RAID community-run staking pool on Solana. Stake your SOL to help secure the network, 
            earn rewards, and receive <span className="text-teal-400 font-semibold">RADIATION</span> and <span className="text-teal-400 font-semibold">RAID</span> tokens. 
            These tokens can be used across Solana’s DeFi ecosystem to maximize your potential.
          </p>
        </div>
    
        {/* Account Details */}
        <div className="max-w-xl w-full bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 text-center">Account Details</h2>
          <div className="mb-4">
            <p className="text-gray-300">
              <strong>Wallet Balance:</strong> <span className="text-white">{walletBalance} SOL</span>
            </p>
            <p className="text-gray-300">
              <strong>Staked Amount:</strong> <span className="text-white">{stakedAmount} Pool Tokens (Radiation)</span>
            </p>
            <p className="text-gray-300">
              <strong>Claimable Rewards:</strong> 
              <span className="text-teal-300">
                {claimableRewards !== undefined 
                  ? ` ${claimableRewards.toFixed(10)} RAID` 
                  : " Loading..."}
              </span>
            </p>
            <p className="text-gray-300">
              <strong>APY:</strong> <span className="text-teal-400">{(apy * 100).toFixed(2)}%</span>
            </p>
          </div>
          <button
            onClick={() => {
              if (!publicKey) {
                toast.error("Wallet not connected."); 
                return;
              }
              claimRewards(publicKey);
            }}
            className={`w-full py-2 px-4 font-medium rounded 
              ${claimableRewards > 0 
                ? "bg-teal-500 hover:bg-teal-600 text-white" 
                : "bg-gray-500 text-gray-400 cursor-not-allowed"}`}
            disabled={claimableRewards <= 0}
          >
            Claim RAID Rewards
          </button>
        </div>
    
        {/* Stake SOL */}
        <div className="max-w-xl w-full bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 text-center">Stake SOL</h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              value={amountToStake}
              onChange={(e) => setAmountToStake(Number(e.target.value))}
              placeholder="Amount to Stake"
              className="w-full px-4 py-2 border border-teal-600 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setAmountToStake(walletBalance * 0.25)}
                className="px-3 py-1 bg-teal-600 text-white rounded-full hover:bg-teal-700"
              >
                25%
              </button>
              <button
                onClick={() => setAmountToStake(walletBalance * 0.5)}
                className="px-3 py-1 bg-teal-600 text-white rounded-full hover:bg-teal-700"
              >
                50%
              </button>
              <button
                onClick={() => setAmountToStake(walletBalance)}
                className="px-3 py-1 bg-teal-600 text-white rounded-full hover:bg-teal-700"
              >
                MAX
              </button>
            </div>
          </div>
          <button
            onClick={stakeSol}
            className={`w-full py-2 px-4 font-medium rounded 
              ${amountToStake > 0 && amountToStake <= walletBalance 
                ? "bg-teal-500 hover:bg-teal-600 text-white" 
                : "bg-gray-500 text-gray-400 cursor-not-allowed"}`}
            disabled={amountToStake <= 0 || amountToStake > walletBalance}
          >
            Stake
          </button>
        </div>
    
        {/* Withdraw SOL */}
        <div className="max-w-xl w-full bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 text-center">Withdraw SOL</h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              value={amountToWithdraw}
              onChange={(e) => setAmountToWithdraw(Number(e.target.value))}
              placeholder="Amount to Withdraw"
              className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setAmountToWithdraw(stakedAmount * 0.25)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                25%
              </button>
              <button
                onClick={() => setAmountToWithdraw(stakedAmount * 0.5)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                50%
              </button>
              <button
                onClick={() => setAmountToWithdraw(stakedAmount)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                MAX
              </button>
            </div>
          </div>
          <button
            onClick={withdrawStake}
            className={`w-full py-2 px-4 font-medium rounded 
              ${amountToWithdraw > 0 && amountToWithdraw <= stakedAmount 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-gray-500 text-gray-400 cursor-not-allowed"}`}
            disabled={amountToWithdraw <= 0 || amountToWithdraw > stakedAmount}
          >
            Withdraw
          </button>
        </div>
    
        {/* Transaction History */}
        <div className="max-w-xl w-full bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-teal-400 mb-4 text-center">Transaction History</h2>
          {transactions.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-300">
              {transactions.map((tx, index) => (
                <li key={index} className="break-words">{tx}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No transactions found.</p>
          )}
        </div>
      </div>
    );
    
  
}
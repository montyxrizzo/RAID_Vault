import {
  Connection,
  PublicKey,
  Transaction,
SystemProgram,
//TransactionInstruction,
  Keypair,
  //sendAndConfirmTransaction
} from '@solana/web3.js';

import {
  //getOrCreateAssociatedTokenAccount,
  //createTransferCheckedInstruction,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,

  getAssociatedTokenAddress,


} from '@solana/spl-token';

//import { useSpring, animated } from '@react-spring/web';




import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import { toast } from "react-hot-toast";
import { toast } from "react-toastify";


const API_BASE_URL = 'https://mcnv3hcykt.us-east-2.awsapprunner.com'; // Replace with your backend URL
const RAID_PER_SOL = 50000; // Example conversion rate: 1000 RAID per SOL
const connection = new Connection('https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/', 'processed');
 
export default function PresalePage() {
  const [progress, setProgress] = useState(0);
  const [raidSold, setRaidSold] = useState(0);
  const [solReceived, setSolReceived] = useState(0);
  const [solAmount, setSolAmount] = useState<number>(0);
  const [raidAmount, setRaidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  //const DECIMALS = 9; // Number of decimals for RAID token


  // const formatNumberWithCommas = (num: number): string => {
  //   return new Intl.NumberFormat('en-US').format(Math.round(num));
  // };
  // const formatNumberDecimals = (num: number): string => {
  //   return new Intl.NumberFormat('en-US', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(num);
  // };
  const formatNumberWithCommasAndDecimals = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  



  async function getPayerKeypair() {
    try {
      // Explicitly define the base URL if needed
      const response = await axios.get(`${API_BASE_URL}/secrets/payer`); // Replace with the actual backend URL if necessary
   //   console.log('Response:', response);
  
      const { key } = response.data;
  
      if (!key) {
        throw new Error('Secret key is not defined in the backend response');
      }
  
      // Parse the key string into a Uint8Array
      const secretArray = JSON.parse(key);
      const secretBytes = Uint8Array.from(secretArray);
  
      // Create the Keypair from the secret bytes
      const mintAuthorityKeypair = Keypair.fromSecretKey(secretBytes);
  
      return mintAuthorityKeypair;
    } catch (error) {
 //     console.error('Error fetching or processing the secret key:', error);
      throw error;
    }
  }
  
  
  
  const contributeToPresale = async (walletAddress: string, solAmount: number, transactionId: string) => {
    try {
      const payload = {
        wallet_address: walletAddress,
        tokens_purchased: solAmount * RAID_PER_SOL, // Ensure this is a float
        sol_received: solAmount, // Ensure this is a float
        transactionId: transactionId,
      };
  
 //     console.log("Payload:", payload); // Debug log
      const response = await axios.post(
        `${API_BASE_URL}/presale/transaction`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Contribution Successful:", response.data);
        return response.data;
      } else {
        throw new Error(response.data.detail || "Failed to contribute");
      }
    } catch (error) {
  //    console.error("Error contributing to presale:", error);
      throw error;
    }
  };
  

  useEffect(() => {
    const fetchPresaleProgress = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/presale/progress`);
        const data = response.data;
    
        setProgress(data.progress_percentage || 0);
        setRaidSold(data.total_tokens_sold || 0);
        setSolReceived(data.total_sol_received || 0);
      } catch (error) {
  //      console.error("Error fetching presale progress:", error);
        toast.error("Failed to load presale progress.");
      }
    };
    
    fetchPresaleProgress();
  }, []);

  const handleSolChange = (sol: number) => {
    setSolAmount(sol);
    setRaidAmount(sol * RAID_PER_SOL);
  };

//  const handlePurchase = async () => {
//     if (solAmount <= 0) {
//       toast.error("Please enter a valid SOL amount.");
//       return;
//     }
  
//     if (!publicKey) {
//       toast.error("Wallet not connected.");
//       return;
//     }
  
//     setLoading(true);
  
//     try {
//       const PRESALE_WALLET = new PublicKey("H1SkWxyCZ1tAtSQ3xHaPrW5cs4N1EvJhpc7LCNtDN2sB");
//       const RAID_MINT_ADDRESS = new PublicKey("HNEgW597ZQwZAVL8iEaAc3aKv735pFTspVLqrJESpoth");
//       const CUSTOM_TOKEN_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
//       const DECIMALS = 9;
  
//       const presaleWalletKeypair = await getPayerKeypair(); // Presale wallet's keypair
  
//       // Get user's associated token account for RAID
//       const userTokenAccount = await getAssociatedTokenAddress(
//         RAID_MINT_ADDRESS,
//         publicKey,
//         false,
//         CUSTOM_TOKEN_PROGRAM_ID
//       );
  
//       console.log(`User Token Account: ${userTokenAccount.toBase58()}`);
  
//       // Get presale wallet's associated token account for RAID
//       const presaleTokenAccount = await getAssociatedTokenAddress(
//         RAID_MINT_ADDRESS,
//         presaleWalletKeypair.publicKey,
//         false,
//         CUSTOM_TOKEN_PROGRAM_ID
//       );
  
//       console.log(`Presale Token Account: ${presaleTokenAccount.toBase58()}`);
  
//       // Create a transaction
//       const transaction = new Transaction();
  
//       // Add SOL transfer instruction
//       transaction.add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey: PRESALE_WALLET,
//           lamports: solAmount * 1e9, // Convert SOL to lamports
//         })
//       );
  
//       // Check if user's associated token account exists, and create one if necessary
//       const userAccountExists = await connection.getAccountInfo(userTokenAccount);
//       if (!userAccountExists) {
//         transaction.add(
//           createAssociatedTokenAccountInstruction(
//             publicKey, // Fee payer
//             userTokenAccount, // Associated token account
//             publicKey, // Owner
//             RAID_MINT_ADDRESS, // Mint
//             CUSTOM_TOKEN_PROGRAM_ID // Token program ID
//           )
//         );
//       }
  
//       // Add RAID token transfer instruction
//       const raidAmount = solAmount * 100; // Example: 1 SOL = 100 RAID
//       const amountToTransfer = Math.floor(raidAmount * 10 ** DECIMALS);
  
//       transaction.add(
//         createTransferInstruction(
//           presaleTokenAccount, // Source (presale wallet's RAID token account)
//           userTokenAccount, // Destination (user's RAID token account)
//           presaleWalletKeypair.publicKey, // Owner of source
//           amountToTransfer,
//           [],
//           CUSTOM_TOKEN_PROGRAM_ID
//         )
//       );
  
//       // Set the fee payer to the user's wallet
//       transaction.feePayer = publicKey;
  
//       // Fetch the latest blockhash
//       const latestBlockhash = await connection.getLatestBlockhash();
//       transaction.recentBlockhash = latestBlockhash.blockhash;
  
//       // Partially sign the transaction with the presale wallet keypair
//       transaction.partialSign(presaleWalletKeypair);
  
//       // Send the transaction to the user's wallet for signing
//       const signature = await sendTransaction(transaction, connection);
//       await connection.confirmTransaction(signature, "processed");
  
//       console.log(`Transaction successful: ${signature}`);
//       toast.success(
//         <div>
//           Successfully contributed {solAmount} SOL and received {raidAmount} RAID! 🎉
//           <br />
//           <a
//             href={`https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-indigo-400 underline"
//           >
//             View on Solana Explorer
//           </a>
//         </div>
//       );
  
//       // Record the contribution to the presale
//       await contributeToPresale(publicKey.toBase58(), solAmount, signature);
//     } catch (error) {
//       console.error("Error during presale transaction:", error);
//       toast.error("Transaction failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
const handlePurchase = async () => {
  if (solAmount <= 0) {
    toast.error("Please enter a valid SOL amount.");
    return;
  }

  if (!publicKey) {
    toast.error("Wallet not connected.");
    return;
  }

  setLoading(true);

  try {
    const PRESALE_WALLET = new PublicKey("H1SkWxyCZ1tAtSQ3xHaPrW5cs4N1EvJhpc7LCNtDN2sB");
    const RAID_MINT_ADDRESS = new PublicKey("HNEgW597ZQwZAVL8iEaAc3aKv735pFTspVLqrJESpoth");
    const CUSTOM_TOKEN_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
    const DECIMALS = 9;

    // Fetch presale wallet keypair
    const presaleKeypair = await getPayerKeypair();

    // Get the associated token accounts for both presale and user
    const raidWalletTokenAccount = await getAssociatedTokenAddress(
      RAID_MINT_ADDRESS,
      presaleKeypair.publicKey,
      false,
      CUSTOM_TOKEN_PROGRAM_ID
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      RAID_MINT_ADDRESS,
      publicKey,
      false,
      CUSTOM_TOKEN_PROGRAM_ID
    );

  //  console.log(`Presale Wallet Token Account: ${raidWalletTokenAccount.toBase58()}`);
  //  console.log(`User Token Account: ${userTokenAccount.toBase58()}`);

    const transaction = new Transaction();

    // Add SOL transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: PRESALE_WALLET,
        lamports: solAmount * 1e9, // Convert SOL to lamports
      })
    );

    // Check if the user's associated token account exists, and create one if necessary
    const userAccountExists = await connection.getAccountInfo(userTokenAccount);
    if (!userAccountExists) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey, // Fee payer
          userTokenAccount, // Associated token account
          publicKey, // Owner
          RAID_MINT_ADDRESS, // Mint
          CUSTOM_TOKEN_PROGRAM_ID // Token program ID
        )
      );
    }

    // Add RAID token transfer instruction
    const raidAmountSmallestUnit = raidAmount * 10 ** DECIMALS; // Scale RAID amount
    transaction.add(
      createTransferInstruction(
        raidWalletTokenAccount, // Source (presale wallet token account)
        userTokenAccount,       // Destination (user's token account)
        presaleKeypair.publicKey, // Authority (presale wallet owner)
        raidAmountSmallestUnit, // Amount in smallest units
        [],                     // Multisig not required
        CUSTOM_TOKEN_PROGRAM_ID // Token program ID
      )
    );

    // Set the fee payer to the connected wallet
    transaction.feePayer = publicKey;

    // Fetch the latest blockhash for the transaction
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // Sign the transaction with the presale wallet keypair
    transaction.partialSign(presaleKeypair);

    // Send and confirm the transaction
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "processed");

    console.log(`Transaction successful: ${signature}`);
    toast.success(
      <div>
        Successfully swapped {solAmount} SOL for {raidAmount} RAID! 🎉
        <br />
        <a
          href={`https://solscan.io/tx/${signature}?cluster=mainnet-beta`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline"
        >
          View on Solscan
        </a>
      </div>
    );

    // Optionally log or save the contribution
    await contributeToPresale(publicKey.toBase58(), solAmount, signature);
  } catch (error) {
    console.error("Error during presale transaction:", error);
    toast.error("Transaction failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  
  
  
  
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen py-16">
       <ToastContainer />

      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-8">
         RAID Token Presale 🚀 
         
        </h1>
                
        <p className="text-center text-gray-300 mb-8">
          Swap your SOL for RAID tokens to be the first to join the decentralized GPU revolution! 
        </p>
        
        {/* Presale Progress */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-300 mb-4">Presale Progress</h2>
          <div className="relative w-full bg-gray-700 h-6 rounded-lg overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-500"
              style={{ width: `${formatNumberWithCommasAndDecimals(progress)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-gray-300 text-sm">
            <span>{formatNumberWithCommasAndDecimals(progress)}% Complete</span>
            <span>RAID Sold:{formatNumberWithCommasAndDecimals(raidSold)}</span>
          </div>
          <div className="text-right text-gray-300 text-sm">
            SOL Received: {formatNumberWithCommasAndDecimals(solReceived)}
          </div>
        </div>

        {/* Swap Box */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4 text-center">Swap SOL for RAID</h3>
          <div className="flex flex-col gap-4">
            {/* SOL Input */}
            <div className="flex items-center gap-4">
              <img src="/solana.jpg" alt="SOL" className="w-10 h-10" />
              <input
                type="number"
                value={solAmount}
                onChange={(e) => handleSolChange(Number(e.target.value))}
                placeholder="Enter SOL amount"
                className="flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* RAID Output */}
            <div className="flex items-center gap-4">
              <img src="/raid_token_close.png" alt="RAID" className="w-10 h-10" />
              <input
                type="text"
                value={raidAmount}
                readOnly
                className="flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
              />
            </div>

            {/* Conversion Rate */}
            <p className="text-center text-sm text-gray-400">
              1 SOL = {RAID_PER_SOL} RAID
            </p>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Processing..." : "Swap SOL for RAID"}
          </button>
        </div>
        <sub>*Limited time only.</sub>
      </div>
   
    </div>
  );
}


import {
  Connection,
  PublicKey,
  Transaction,
SystemProgram,
//TransactionInstruction,
  Keypair,
  //sendAndConfirmTransaction
} from '@solana/web3.js';
import "/src/css/flip-clock.css"; // Custom CSS for styling

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
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import { toast } from "react-hot-toast";
import { toast,ToastContainer } from "react-toastify";
import { PieChart } from "react-minimal-pie-chart";


const API_BASE_URL = 'https://mcnv3hcykt.us-east-2.awsapprunner.com'; // Replace with your backend URL
const RAID_PER_SOL = 250000; // Example conversion rate: 1000 RAID per SOL
const connection = new Connection('https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/', 'processed');
 
export default function PresalePage() {
  const [progress, setProgress] = useState(0);
  const [raidSold, setRaidSold] = useState(0);
  const [solReceived, setSolReceived] = useState(0);
  const [solAmount, setSolAmount] = useState<number>(0);
  const [raidAmount, setRaidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const [countdown, setCountdown] = useState<CountdownData | null>(null);

   // Explicitly type the state as TimeLeft


   interface CountdownData {
    status: string;
    message: string;
    remaining_time: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }
  
  //  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
  //   days: "00",
  //   hours: "00",
  //   minutes: "00",
  //   seconds: "00",
  // });

  const data = [
    { title: "Presale", value: 10, color: "#4caf50" },
    { title: "Liquidity", value: 40, color: "#2196f3" },
    { title: "Staking", value: 25, color: "#FF69B4" },
    { title: "DAO Rewards", value: 5, color: "#A020F0" },
    { title: "Development", value: 10, color: "#ff9800" },
    { title: "Marketing", value: 10, color: "#f44336" },
  ];
// Define the type for the timeLeft state


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
        toast.error("Failed to load presale progress.");
      }
    };
  
    const fetchCountdown = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/presale/countdown`);
        const data: CountdownData = await response.json();
        setCountdown(data);
      } catch (error) {
        console.error("Failed to fetch countdown data:", error);
      }
    };
  
    fetchPresaleProgress();
    fetchCountdown();
  
    const countdownInterval = setInterval(fetchCountdown, 1000); // Refresh countdown every second
  
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 60); // Example: 60-day countdown
  

  
    // Cleanup function to clear intervals
    return () => {

      clearInterval(countdownInterval);
    };
  }, []);
  

  if (!countdown) return <p>Loading...</p>;

  const { days, hours, minutes, seconds } = countdown.remaining_time;
  const handleSolChange = (sol: number) => {
    setSolAmount(sol);
    setRaidAmount(sol * RAID_PER_SOL);
  };

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
        <strong>Transaction Successful!</strong>
        <br />
        You swapped {formatNumberWithCommasAndDecimals(solAmount)} SOL for {formatNumberWithCommasAndDecimals(raidAmount)} RAID tokens.
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
  
  <div
    className="relative bg-gradient-to-b from-gray-700 via-black to-gray-500 text-white min-h-screen py-16"
    style={{
      backgroundImage: "url('src/presale_bg.png')",
      backgroundSize: "100% auto",
      backgroundPosition: "center",
    }}
    
  >
        <ToastContainer />
    {/* Semi-transparent overlay for readability */}
    <div className="absolute inset-0 bg-black bg-opacity-25"></div>

    <div className="relative max-w-3xl mx-auto px-6 z-10">
      {/* Title */}
      {/* <h1
  className="text-5xl font-extrabold text-center mb-8 relative"
  style={{
    fontFamily: "'Poppins', sans-serif", // Modern font
    color: '#6C63FF', // Purple for "RAID"
  }} */}
{/* > */}
  {/* <span style={{ color: '#6C63FF' }}>R</span>
  <span 
    style={{
      color: '#ffffff', // White for "AI"
      background: 'linear-gradient(90deg, #6C63FF, #ffffff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    AI
  </span>
  <span style={{ color: '#6C63FF' }}>D */}
    <h1 className="text-5xl font-extrabold text-center mb-8 relative"
  style={{
    fontFamily: "'Poppins', sans-serif", // Modern font
    color: '#6C63FF', // Purple for "RAID"
  }}><span>Presale is </span>
  <span
    className="animate-pulse"
    style={{
      color: '#FF0000', // Red for "LIVE"
      fontWeight: 'bold',
    }}
  >
    LIVE!
  </span>🚀
</h1>

<center><h2 className="text-xl font-semibold text-red-300 mb-4"></h2></center>

<div className="text-center">
      <h2 className="text-xl font-semibold text-red-300 mb-4">Ends in...</h2>
      {countdown.status === "expired" ? (
        <p>{countdown.message}</p>
      ) : (
        <div className="flex justify-center space-x-4">
          <div className="flip-clock-unit">
            <div className="flip-clock-label">Days</div>
            <div className="flip-clock-digit">{days}</div>
          </div>
          <div className="flip-clock-unit">
            <div className="flip-clock-label">Hours</div>
            <div className="flip-clock-digit">{hours}</div>
          </div>
          <div className="flip-clock-unit">
            <div className="flip-clock-label">Minutes</div>
            <div className="flip-clock-digit">{minutes}</div>
          </div>
          <div className="flip-clock-unit">
            <div className="flip-clock-label">Seconds</div>
            <div className="flip-clock-digit">{seconds}</div>
          </div>
        </div>
      )}
    </div>
      {/* Description */}
      <p className="text-center text-gray-300 mb-8 text-lg">
        Swap your SOL for RAID tokens to be the first to join the decentralized GPU revolution!
      </p>

      {/* Presale Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-indigo-300 mb-4">
          Goal Progress
        </h2>
        <div className="relative w-full bg-gray-700 h-6 rounded-lg overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500"
            style={{
              width: `${formatNumberWithCommasAndDecimals(progress)}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-gray-300 text-sm">
          <span>{formatNumberWithCommasAndDecimals(progress)}% Complete</span>
          <span>RAID Sold: {formatNumberWithCommasAndDecimals(raidSold)}</span>
        </div>
        <div className="text-right text-gray-300 text-sm">
          SOL Received: {formatNumberWithCommasAndDecimals(solReceived)}
        </div>
      </div>

      {/* Swap Box */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg bg-opacity-85">
        <h3 className="text-lg font-semibold text-white-300 mb-4 text-center">
          Swap SOL for RAID
        </h3>
        <div className="flex flex-col gap-6">
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
            1 SOL = {formatNumberWithCommasAndDecimals(RAID_PER_SOL)} RAID
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

   {/* Donut Chart */}
   <br></br>
   <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">RAID Tokenomics</h2>

        <div className="flex justify-center relative">
          <svg width="500" height="500" viewBox="0 0 500 500" className="animate-fade-in">
            <PieChart
              data={data}
              lineWidth={30}
              radius={30}
              animate
              segmentsStyle={{ cursor: "pointer", transition: "stroke 0.3s ease-out" }}
            />
            {/* Center Text */}
            <text
              x="250"
              y="250"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                fill: "#fff",
              }}
            >
              1 Billion Tokens
            </text>

            <style>
              {`
                .animate-fade-in {
                  animation: fadeIn 5s ease-in-out;
                }

                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.8);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}
            </style>

            {/* Rotated Labels with Callout Lines */}
            {data.map((entry, index) => {
              const cumulativeValue = data
                .slice(0, index)
                .reduce((sum, d) => sum + d.value, 0);
              const angle =
                (cumulativeValue + entry.value / 2) * (360 / 100) + 90; // Adjust rotation for alignment
              const radians = ((angle - 90) * Math.PI) / 180;

              // Calculate positions for the lines and labels
              const x1 = 250 + 120 * Math.cos(radians); // Start of the line, closer to the donut
              const y1 = 250 + 120 * Math.sin(radians);
              const x2 = 250 + 160 * Math.cos(radians); // End of the line, further out
              const y2 = 250 + 160 * Math.sin(radians);
              const xText = 250 + 190 * Math.cos(radians); // Label position
              const yText = 250 + 190 * Math.sin(radians);

              return (
                <g key={entry.title}>
                  {/* Callout Line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={entry.color}
                    strokeWidth="1"
                  />
                  {/* Label */}
                  <text
                    x={xText}
                    y={yText}
                    transform={`rotate(${angle}, ${xText}, ${yText})`} // Rotate label for alignment
                    textAnchor={xText > 250 ? "start" : "end"} // Align text based on its position
                    dominantBaseline="middle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      fill: "#fff",
                    }}
                  >
                    {entry.title}: {entry.value}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

{/* Presale Info */}
<div className="text-center text-gray-300 mb-8">
  <h3 className="text-xl font-bold text-indigo-300 mb-4">Additional Information</h3>
  <p className="mb-4">
    The RAID Token Presale is your opportunity to join the decentralized GPU
    revolution. Here’s how the tokens are distributed and the key presale
    details:
  </p>
  <ul className="list-disc list-inside text-left mx-auto max-w-md">
    <li><span className="font-semibold">I.C.O Price will periodically increase until release.</span> </li>
    <li><span className="font-semibold">Total Token Supply:</span> 1 Billion RAID</li>
    <li><span className="font-semibold">Presale Allocation:</span> 10% (100 Million RAID)</li>
    <li><span className="font-semibold">Presale Price:</span> 1 SOL = 250,000 RAID</li>
    <li><span className="font-semibold">Liquidity Allocation:</span> 40% of total tokens</li>
    <li><span className="font-semibold">Staking Allocation:</span> 25% reserved for staking rewards</li>
    <li><span className="font-semibold">Presale End Date:</span>  1/25/25</li>
  </ul>
  <p className="mt-4">
    Join the community today and secure your place in the future of GPU-driven decentralization.
  </p>
</div>
    </div>
  </div>
);


}

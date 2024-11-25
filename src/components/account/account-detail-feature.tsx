import {
  Connection,
  PublicKey,
  Transaction,
//SystemProgram,
//TransactionInstruction,
  Keypair,
  //sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  depositSol,
  withdrawSol,
} from '@solana/spl-stake-pool';
import {
  //getOrCreateAssociatedTokenAccount,
  //createTransferCheckedInstruction,
  //createTransferInstruction,
  createAssociatedTokenAccountInstruction,

  getAssociatedTokenAddress,

  TOKEN_PROGRAM_ID,

  createMintToInstruction,
} from '@solana/spl-token';
import { useSpring, animated } from '@react-spring/web';




import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
// import { publicKey } from '@solana/spl-stake-pool/dist/codecs';
 
// DEV Constants
// const STAKE_ACCOUNT = new PublicKey('C2XB48wMvjPqNEju8yu9tQ6YyUmfWQrFKtYPsE9uoHTQ')
// const STAKE_POOL_ID = new PublicKey('E17hzYQczWxUeVMQqsniqoZH4ZYj5koXUmAxYe4KDEdL'); // Stake pool ID
// const POOL_TOKEN_MINT = new PublicKey('Lx48m36jmsyudPHs6SNUD3dsJ81J6ivsEVeCUsWQsBp'); // Pool token mint

//PROD Constants
// Constants for production environment
const STAKE_ACCOUNT = new PublicKey('8KNDibG6RAc1tE2i3UKboiQ1tdf7JuwLWjCTnVNChcP9');
const STAKE_POOL_ID = new PublicKey('2WwgnKfu9NuAiwshph864uD9wyGRCtmvhpsVGy4dHaDo');
const POOL_TOKEN_MINT = new PublicKey('CdNQmTvm56YWoox9twQA4Ha3rY4mZYLnxgsKQg6YXPDT');


const connection = new Connection('https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/', 'processed');
const API_BASE_URL = 'https://mcnv3hcykt.us-east-2.awsapprunner.com'; // Replace with your backend URL
// const API_BASE_URL = 'http://localhost:8001'
const DECIMALS = 9; // Number of decimals for RAID token
// const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';


export default function AccountDetailFeature() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [claimableRewards, setClaimableRewards] = useState<number>(0);
  const [amountToStake, setAmountToStake] = useState<number>(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);
  // const [transactions, setTransactions] = useState<string[]>([]);
  const [apy, setApy] = useState<number>(0);
  const [tvl, setTvl] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [totalSolInPool, setTotalSolInPool] = useState<number>(0);
  const [lastPriceFetchTime, setLastPriceFetchTime] = useState<number>(0); // Stores the last fetch timestamp
  const [activeView, setActiveView] = useState<"SOL Stake Pool" | "SOL/RAID LP">("SOL Stake Pool");
  const [loading, setLoading] = useState<boolean>(false); // To indicate loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // To display error messages
  // Inside your component:
  const [animatedTvl, setAnimatedTvl] = useSpring(() => ({
    number: 0, // Initial value
    config: { tension: 120, friction: 14 },
  }));
  //const [isModalOpen, setIsModalOpen] = useState(true);
  //const [canAccept, setCanAccept] = useState(false);
  const formatNumberWithCommas = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };
  const formatNumberDecimals = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  const formatNumberWithCommasAndDecimals = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };
  
  
// Fetch total SOL in the stake pool
const fetchTotalSolInPool = async () => {
  try {
    const accountInfo = await connection.getParsedAccountInfo(STAKE_ACCOUNT);

    if (!accountInfo || !accountInfo.value?.lamports) {
      throw new Error('Stake pool account not found or contains no data');
      
    }

    const buffer = accountInfo.value.lamports || 0;

    try {
      // Adjust the offset based on the stake pool's data structure
     
      // Convert lamports to SOL
      const solInPool = Number(buffer) / 1e9;
      setTotalSolInPool(solInPool);

      console.log('Total SOL in Pool:', solInPool);
      return solInPool;
    } catch (parseError) {
      console.error('Error parsing stake pool account data:', parseError);
      throw new Error('Unable to parse raw buffer data');
    }
  } catch (error) {
    console.error('Error fetching total SOL in pool:', error);
    toast.error('Failed to fetch total SOL in pool.');
    return 0;
  }
};

// Fetch SOL price from CoinGecko

const fetchSolPrice = async () => {
  const currentTime = Date.now();
  const thirtyMinutesInMs = 30 * 60 * 1000;

  if (currentTime - lastPriceFetchTime < thirtyMinutesInMs && solPrice > 0) {
    console.log('Using cached SOL price');
    return solPrice;
  }

  try {
    // Use the backend endpoint to fetch the SOL price
    const response = await fetch(`${API_BASE_URL}/staking-data/sol-price`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch SOL price. Status: ${response.status}`);
    }

    const data = await response.json();
    const price = data.price; // Adjust this if your API returns a different structure
    setSolPrice(price);
    setLastPriceFetchTime(currentTime); // Update the last fetch time
    console.log('Fetched new SOL price from backend:', price);
    return price;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return solPrice; // Return the last known price if fetching fails
  }
};


// Calculate TVL
const calculateTvl = async () => {
  const solQuantity = await fetchTotalSolInPool();
  const solPrice = await fetchSolPrice();
  const calculatedTvl = solQuantity * solPrice;
  setTvl(calculatedTvl);
  setAnimatedTvl({ number: calculatedTvl });
};

    // Modal Scroll Handler
    
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
        return;
      }
  
    // Fetch claimable rewards from the server
    const response = await axios.get(
      `${API_BASE_URL}/staking-data/${publicKey.toBase58()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response)
    const {  staking_rewards } = response.data;
    console.log(response.data)
      setClaimableRewards(staking_rewards);
    } catch (error) {
      console.log('Trying to refresh staking rewards:', error);
     // toast.error('Failed to fetch staked balance.');
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
  
    setLoading(true); // Start loading
    setErrorMessage(null); // Clear previous error messages
  
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
      toast.info('Transaction sent. Waiting for confirmation...');
      await connection.confirmTransaction(signature, 'processed');
      toast.success(`Successfully staked ${amountToStake} SOL.`);
  
      try {
        await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/deposit`, {
          amount: amountToStake,
        });
        toast.success('Staking data synchronized successfully.');
      } catch (syncError) {
        console.error('Error syncing staking data:', syncError);
        toast.error('Failed to synchronize staking data with the server.');
      }
  
      fetchWalletBalance();
      fetchStakedBalance();
      setAmountToStake(0);
    } catch (error: any) {
      console.error('Error staking SOL:', error);
      const transactionSignature = error.message.match(/Check signature (\w+)/)?.[1];
      const transactionMessage = transactionSignature
        ? `Check transaction: ${transactionSignature}`
        : 'An error occurred. Please try again.';
  
      setErrorMessage(transactionMessage);
      toast.error(`Failed to stake SOL. ${transactionMessage}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

// Withdraw SOL and trigger RAID rewards transfer
const withdrawStake = async () => {
  if (!connected || !publicKey) {
    toast.error('Wallet not connected.');
    return;
  }

  if (amountToWithdraw <= 0 || amountToWithdraw > stakedAmount) {
    toast.error('Invalid withdrawal amount.');
    return;
  }

  setLoading(true); // Start loading
  setErrorMessage(null); // Clear previous error messages

  try {
    const lamports = parseFloat(amountToWithdraw.toFixed(9)); // Convert SOL to lamports

    const { instructions, signers } = await withdrawSol(
      connection,
      STAKE_POOL_ID,
      publicKey,
      publicKey, // SOL destination account
      lamports
    );

    const transaction = new Transaction().add(...instructions);
    const signature = await sendTransaction(transaction, connection, { signers });
    toast.info('Transaction sent. Waiting for confirmation...');
    await connection.confirmTransaction(signature, 'processed');
    toast.success(`Successfully withdrew ${amountToWithdraw} SOL.`);

    await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/withdraw`, {
      amount: amountToWithdraw,
    });

    fetchWalletBalance();
    fetchStakedBalance();
    setAmountToWithdraw(0);
  } catch (error: any) {
    console.error('Error withdrawing SOL:', error);
    const transactionSignature = error.message.match(/Check signature (\w+)/)?.[1];
    const transactionMessage = transactionSignature
      ? `Check transaction: ${transactionSignature}`
      : 'An error occurred. Please try again.';

    setErrorMessage(transactionMessage);
    toast.error(`Failed to withdraw SOL. ${transactionMessage}`);
  } finally {
    setLoading(false); // Stop loading
  }
};


async function getMintAuthorityKeypair() {
  try {
    // Explicitly define the base URL if needed
    const response = await axios.get(`${API_BASE_URL}/staking-data/secret`); // Replace with the actual backend URL if necessary
    console.log('Response:', response);

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
    console.error('Error fetching or processing the secret key:', error);
    throw error;
  }
}




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
    const RAID_MINT_ADDRESS = new PublicKey('HNEgW597ZQwZAVL8iEaAc3aKv735pFTspVLqrJESpoth');
    const CUSTOM_TOKEN_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

  
     
      const mintAuthorityKeypair  = await getMintAuthorityKeypair();
  
      console.log('Mint Authority Keypair:', mintAuthorityKeypair.publicKey.toBase58());
  
  
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
    await axios.post(`${API_BASE_URL}/staking-data/${publicKey.toBase58()}/rewards-claimed`);

  } catch (error) {
    console.error('Error claiming rewards:', error);
    toast.error('Failed to claim rewards.');
  }
  
};

useEffect(() => {
  // Fetch public data on mount
  fetchSolPrice();
  calculateTvl();
  fetchApy();
}, []);




  useEffect(() => {
    fetchSolPrice(); // Initial fetch
    fetchApy();
    calculateTvl();

    if (connected) {
 
      fetchWalletBalance();
      fetchStakedBalance();

      // Fetch SOL price every 30 minutes
      const priceInterval = setInterval(fetchSolPrice, 30 * 60 * 1000);

      // Refresh staked balance and TVL every 30 seconds
      const rewardsInterval = setInterval(() => {
        fetchWalletBalance();
      fetchStakedBalance();
      fetchApy();
      calculateTvl();
      }, 30000);


  
        return () => {
          clearInterval(priceInterval);
          clearInterval(rewardsInterval);
          
        };
    }
  }, [connected,setAnimatedTvl,tvl]);


 return (
  <div className="bg-gradient-to-b from-purple-900 to-indigo-900 min-h-screen p-6 flex flex-col items-center text-gray-200">
    <ToastContainer />
          {/* Circuit Board Background */}
      {/* <CircuitBoardBackground /> */}

    {/* Header Section */}
    <div className="max-w-3xl w-full text-center mb-8">
      <h1 className="text-4xl font-bold text-teal-400 mb-4">
        Earn <span className="text-white">RAID</span> by Staking!
      </h1>
      <p className="text-gray-300 text-lg">
        Stake your SOL to help secure the network, earn rewards, and receive{" "}
        <span className="text-teal-400 font-semibold">RADEON</span> to earn{" "}
        <span className="text-teal-400 font-semibold">RAID</span> tokens —
        your gateway to affordable high-performance GPU resources; an
        investment in the futures of both AI & Crypto.
      </p>
    </div>

    {/* TVL Dashboard */}
    <div className="max-w-xl w-full bg-indigo-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-3xl font-bold text-teal-400 mb-4 text-center">
        Vault Metrics
      </h2>
      <p className="text-gray-300 text-center text-lg">
        <strong>Total SOL in Pools:</strong>{" "}
        <span className="text-white">{formatNumberDecimals(totalSolInPool)} SOL</span>
      </p>
      <p className="text-gray-300 text-center text-lg">
        <strong>SOL Price:</strong>{" "}
        <span className="text-white">${formatNumberDecimals(solPrice)} USD</span>
      </p>
      <p className="text-center text-2xl font-bold text-teal-300 mt-6">
        Total Value Locked (TVL):
      </p>
      <div className="flex justify-center mt-4">
        <div className="bg-gray-900 text-teal-400 font-mono font-extrabold text-5xl p-6 rounded-lg shadow-lg">
          <animated.div>
            {animatedTvl.number.to((val: number) =>
              `$${formatNumberWithCommasAndDecimals(val)}`
            )}
          </animated.div>
        </div>
      </div>
    </div>

    {/* Wallet-Specific Sections */}
    {connected ? (
      <>
        {/* Account Details */}
        <div className="max-w-xl w-full bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl text-white font-bold text-teal-400 mb-4 text-center">
            Account Details
          </h2>
          <div className="mb-4">
            <p className="text-gray-300">
              <strong>Wallet Balance:</strong>{" "}
              <span className="text-teal-300">{walletBalance} SOL</span>
            </p>
            <p className="text-gray-300">
              <strong>Staked Amount:</strong>{" "}
              <span className="text-teal-300">{stakedAmount} Pool Tokens (Radeon)</span>
            </p>
            
            <p className="text-gray-300">
              <strong>Current APY:</strong>{" "}
              <span className="text-teal-400">
                {formatNumberWithCommas(apy * 100)}%
              </span>
            </p>
            <p className="text-gray-300">
              <strong>Reward Multiplier:</strong>{" "}
              <span className="text-teal-400">
                4 X
              </span>
            </p>
          </div>
          <p className="text-gray-300">
              <strong>Claimable Rewards:</strong>{" "}
              <span className="text-teal-300">
                {claimableRewards !== undefined
                  ? ` ${claimableRewards.toFixed(10)} RAID`
                  : " Loading..."}
              </span>
            </p>
            <br></br>
          <button
            onClick={() => {
              if (!publicKey) {
                toast.error("Wallet not connected.");
                return;
              }
              claimRewards(publicKey);
            }}
            className={`w-full py-2 px-4 font-medium rounded ${
              claimableRewards > 0
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-500 text-gray-400 cursor-not-allowed"
            }`}
            disabled={claimableRewards <= 0}
          >
            Claim RAID Rewards
          </button>
        </div>

        {/* Vault Toggle */}
        <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="max-w-3xl w-full text-center mb-8">
              <h1 className="text-4xl font-bold text-teal-400 mb-4">The Vault 🔒</h1>
              <p className="text-gray-300 text-lg">
                Switch between staking SOL in the RAID Community Stake Pool or
                managing your RAID/SOL LP tokens.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center items-center mb-6">
              <button
                className={`px-4 py-2 font-semibold rounded-l ${
                  activeView === "SOL Stake Pool"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveView("SOL Stake Pool")}
              >
                Sol Stake Pool
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-r ${
                  activeView === "SOL/RAID LP"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveView("SOL/RAID LP")}
              >
                RAID/SOL LP
              </button>
            </div>

            {/* Conditional Views */}
            {activeView === "SOL Stake Pool" && (
              <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-lg p-6">
                {/* Stake and Withdraw Sections */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg shadow flex-1">
                    <h3 className="text-xl font-semibold text-teal-400 mb-4 text-center">
                      Stake SOL
                    </h3>
                    <div className="mb-4">
                      <input
                        type="number"
                        value={amountToStake}
                        onChange={(e) => setAmountToStake(Number(e.target.value))}
                        placeholder="Amount to Stake"
                        className="w-full px-4 py-3 text-lg border border-teal-600 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                      <button
                        onClick={() => setAmountToStake(walletBalance * 0.25)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700"
                      >
                        25%
                      </button>
                      <button
                        onClick={() => setAmountToStake(walletBalance * 0.5)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setAmountToStake(walletBalance - 0.001)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700"
                      >
                        MAX
                      </button>
                    </div>
                    <button
                      onClick={stakeSol}
                      className={`w-full py-3 px-4 font-medium rounded ${
                        loading || amountToStake <= 0 || amountToStake > walletBalance
                          ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      }`}
                      disabled={
                        loading || amountToStake <= 0 || amountToStake > walletBalance
                      }
                    >
                      {loading ? "Processing..." : "Stake"}
                    </button>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg shadow flex-1">
                    <h3 className="text-xl font-semibold text-red-400 mb-4 text-center">
                      Withdraw SOL
                    </h3>
                    <div className="mb-4">
                      <input
                        type="number"
                        value={amountToWithdraw}
                        onChange={(e) =>
                          setAmountToWithdraw(Number(e.target.value))
                        }
                        placeholder="Amount to Withdraw"
                        className="w-full px-4 py-3 text-lg border border-red-600 rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                      <button
                        onClick={() => setAmountToWithdraw(stakedAmount * 0.25)}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        25%
                      </button>
                      <button
                        onClick={() => setAmountToWithdraw(stakedAmount * 0.5)}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setAmountToWithdraw(stakedAmount)}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        MAX
                      </button>
                    </div>
                    <button
                      onClick={withdrawStake}
                      className={`w-full py-3 px-4 font-medium rounded ${
                        loading ||
                        amountToWithdraw <= 0 ||
                        amountToWithdraw > stakedAmount
                          ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      disabled={
                        loading ||
                        amountToWithdraw <= 0 ||
                        amountToWithdraw > stakedAmount
                      }
                    >
                      {loading ? "Processing..." : "Withdraw"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === "SOL/RAID LP" && (
              <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-teal-400 mb-4 text-center">
                  RAID/SOL LP
                </h2>
                <div className="mb-4">
                  <p className="text-gray-300">
                    <strong>Wallet Balance:</strong>{" "}
                    <span className="text-white">- RAID/SOL LP Tokens</span>
                  </p>
                </div>
                <button
                  disabled
                  className="w-full py-2 px-4 font-medium rounded bg-gray-600 text-gray-400 cursor-not-allowed"
                >
                  Deposit LP Tokens (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full py-2 px-4 font-medium rounded bg-gray-600 text-gray-400 cursor-not-allowed mt-4"
                >
                  Withdraw LP Tokens (Coming Soon)
                </button>
              </div>
            )}
            
          </div>
          {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded max-w-xl w-full">
            <p>{errorMessage}</p>
            {errorMessage.includes('Check transaction:') && (
              <a
                href={`https://explorer.solana.com/tx/${errorMessage.split('Check transaction: ')[1]}?cluster=mainnet-beta`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on Solana Explorer
              </a>
            )}
          </div>
        )}

        </div>
      </>
    ) : (
      <p className="text-gray-400 text-lg">
        Connect your wallet to view staking details.
      </p>
    )}
  </div>
);

  
}

import { useWallet } from '@solana/wallet-adapter-react';
import { Navigate } from 'react-router';
import { WalletButton } from '../solana/solana-provider';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Connection,
  PublicKey,

//SystemProgram,
//TransactionInstruction,
 
  //sendAndConfirmTransaction
} from '@solana/web3.js';
export default function AccountListFeature() {
  const { publicKey } = useWallet();
  const connection = new Connection('https://prettiest-flashy-wind.solana-mainnet.quiknode.pro/45fee519abbd5d4cac5f5c12044119d868ae84cb/', 'processed');
  const API_BASE_URL = 'https://mcnv3hcykt.us-east-2.awsapprunner.com'; // Replace with your backend URL

  // TVL State and Animation
  const [totalSolInPool, setTotalSolInPool] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [lastPriceFetchTime, setLastPriceFetchTime] = useState<number>(0);
  const [animatedTvl, setAnimatedTvl] = useSpring(() => ({
    number: 0,
    config: { tension: 120, friction: 14 },
  }));

  // Formatting utilities
  const formatNumberDecimals = (num: number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const formatNumberWithCommasAndDecimals = (num: number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  // Fetch SOL price
  
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
  const STAKE_ACCOUNT = new PublicKey('8KNDibG6RAc1tE2i3UKboiQ1tdf7JuwLWjCTnVNChcP9');

  
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

  // Calculate TVL
  const calculateTvl = async () => {
    const solQuantity = await fetchTotalSolInPool();
    const price = await fetchSolPrice();
    const calculatedTvl = solQuantity * price;
    setAnimatedTvl({ number: calculatedTvl });
  };

  // Effect to calculate TVL on mount
  useEffect(() => {
    calculateTvl();

    const interval = setInterval(calculateTvl, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (publicKey) {
    return <Navigate to={`/account/${publicKey.toString()}`} replace />;
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="bg-gradient-to-b from-purple-900 to-indigo-900 min-h-screen p-6 flex flex-col items-center text-gray-200">
          <ToastContainer />

          {/* Header Section */}
          <div className="max-w-3xl w-full text-center mb-8">
            <h1 className="text-4xl font-bold text-teal-400 mb-4">
              Earn <span className="text-white">RAID</span> by Staking! 🚀
            </h1>
            <p className="text-gray-300 text-lg">
              Stake your SOL to help secure the network, earn rewards, and receive{" "}
              <span className="text-teal-400 font-semibold">RADEON</span> to earn{" "}
              <span className="text-teal-400 font-semibold">RAID</span> tokens — your
              gateway to affordable high-performance GPU resources; an investment in
              the futures of both AI & Crypto.
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
                  {animatedTvl.number.to((val) =>
                    `$${formatNumberWithCommasAndDecimals(val)}`
                  )}
                </animated.div>
              </div>
              
            </div>
          </div>
          <WalletButton />

        </div>
      </div>
    </div>
  );
}

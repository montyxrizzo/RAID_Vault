import { PublicKey, Transaction, Connection, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

const RAID_MINT_ADDRESS = new PublicKey("BPFw62HkLiacp1h7MCitiWRZHpWSThxycDbVmn7rMUGx"); // RAID token mint address
const STAKING_ADDRESS = new PublicKey("8gqRr2UwjBJ1zFg3B63tZji7C8UjXUm5u6kLANcxay2H"); // Staking vault address
const DECIMALS = 9; // RAID has 9 decimals

export default function AccountDetailFeature() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amountStaked, setAmountStaked] = useState<number>(0);
  const [availableToStake, setAvailableToStake] = useState<number>(0);
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [stakingStatus, setStakingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection("https://api.devnet.solana.com", "processed");

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toBase58());
      fetchRaidBalance();
    }
  }, [publicKey]);

  const fetchRaidBalance = async () => {
    if (!publicKey) return;
    try {
      const raidTokenAccount = await getAssociatedTokenAddress(RAID_MINT_ADDRESS, publicKey);
      const balanceInfo = await connection.getTokenAccountBalance(raidTokenAccount);
      setAvailableToStake(parseFloat(balanceInfo.value.uiAmountString || "0"));
    } catch (error) {
      console.error("Error fetching RAID balance:", error);
    }
  };

  const handleStake = async () => {
    if (!connected || !publicKey) {
      setError("Wallet not connected");
      return;
    }

    const amountToStake = stakingAmount;
    if (!amountToStake || amountToStake <= 0) {
      setError("Please enter a valid amount to stake.");
      return;
    }

    try {
      setStakingStatus("Staking in progress...");
      setError(null);

      const raidTokenAccount = await getAssociatedTokenAddress(RAID_MINT_ADDRESS, publicKey);
      const stakingTokenAccount = await getAssociatedTokenAddress(RAID_MINT_ADDRESS, STAKING_ADDRESS);

      const transaction = new Transaction();

      // Ensure staking account is created
      const stakingAccountInfo = await connection.getAccountInfo(stakingTokenAccount);
      if (!stakingAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            stakingTokenAccount,
            STAKING_ADDRESS,
            RAID_MINT_ADDRESS
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          raidTokenAccount,
          stakingTokenAccount,
          publicKey,
          amountToStake * Math.pow(10, DECIMALS), // Convert amount to base units
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);

      // Confirm the transaction
      await connection.confirmTransaction(signature, 'processed');

      setAmountStaked((prev) => prev + amountToStake);
      setStakingStatus("Stake successful!");
      setStakingAmount(0);
      fetchRaidBalance();

      // Display success toast
      toast.success(`Successfully staked ${amountToStake} RAID!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      console.error("Error staking rewards:", error);
      setError("Error staking rewards. Please try again.");
      setStakingStatus(null);
    } finally {
      setStakingStatus(null);
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Container for the toast notifications */}
      <AppHero title={<AccountBalance address={publicKey!} />} subtitle={ellipsify(publicKey?.toString())}>
        <AccountButtons address={publicKey!} />
      </AppHero>

      <div className="space-y-8">
        <AccountTokens address={publicKey!} />
        <AccountTransactions address={publicKey!} />

        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Staking</h2>
          <p><strong>Amount Staked:</strong> {amountStaked} RAID</p>
          <p><strong>Available to Stake:</strong> {availableToStake} RAID</p>
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
          </div>
          <p className="mt-2 text-gray-500">{stakingStatus}</p>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

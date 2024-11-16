import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import idl from './idl.json'; // Replace with the actual path to your compiled IDL file

// Constants for the stake pool
const STAKE_POOL_ID = new PublicKey("E17hzYQczWxUeVMQqsniqoZH4ZYj5koXUmAxYe4KDEdL");
const RESERVE_STAKE_ACCOUNT = new PublicKey("23EgpVbBPJx9Lbx6fyzUT8vQzpqB1ZYFJHiaMsKV5mhk");
const REWARD_MINT = new PublicKey("DYFeK9RfDX747gshFAQFaUof72NbS8CdvXTiB8ENsham");

// Solana connection setup
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = // Replace with your wallet provider initialization (e.g., Phantom);
const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });

// Program initialization
const programId = new PublicKey(idl.metadata.address); // Use the program ID from your IDL
const program = new Program(idl, programId, provider);

/**
 * Stake SOL
 * @param {number} amount - Amount of SOL to stake (in lamports)
 */
export async function stakeSol(amount) {
    try {
        const user = wallet.publicKey;

        const [userAccount, userAccountBump] = await PublicKey.findProgramAddress(
            [Buffer.from("user-account"), user.toBuffer()],
            program.programId
        );

        const tx = await program.methods
            .stakeSol(new BN(amount))
            .accounts({
                user,
                userAccount,
                reserveStakeAccount: RESERVE_STAKE_ACCOUNT,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        console.log(`Staked ${amount} lamports. Transaction signature: ${tx}`);
    } catch (error) {
        console.error('Error staking SOL:', error);
    }
}

/**
 * Claim Rewards
 */
export async function claimRewards() {
    try {
        const user = wallet.publicKey;

        const [userAccount, userAccountBump] = await PublicKey.findProgramAddress(
            [Buffer.from("user-account"), user.toBuffer()],
            program.programId
        );

        const userRaidAccount = await utils.token.associatedAddress({
            mint: REWARD_MINT,
            owner: user,
        });

        const tx = await program.methods
            .claimRewards()
            .accounts({
                userAccount,
                userRaidAccount,
                rewardAuthority: wallet.publicKey,
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();

        console.log(`Rewards claimed successfully. Transaction signature: ${tx}`);
    } catch (error) {
        console.error('Error claiming rewards:', error);
    }
}

/**
 * Unstake SOL
 * @param {number} amount - Amount of SOL to unstake (in lamports)
 */
export async function unstakeSol(amount) {
    try {
        const user = wallet.publicKey;

        const [userAccount, userAccountBump] = await PublicKey.findProgramAddress(
            [Buffer.from("user-account"), user.toBuffer()],
            program.programId
        );

        const tx = await program.methods
            .unstakeSol(new BN(amount))
            .accounts({
                userAccount,
                reserveStakeAccount: RESERVE_STAKE_ACCOUNT,
                user,
                rewardAuthority: wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        console.log(`Unstaked ${amount} lamports. Transaction signature: ${tx}`);
    } catch (error) {
        console.error('Error unstaking SOL:', error);
    }
}

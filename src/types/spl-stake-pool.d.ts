declare module '@solana/spl-stake-pool' {
    import { PublicKey, TransactionInstruction } from '@solana/web3.js';
    import { BN } from 'bn.js';

    export function addDepositSolInstruction(
        programId: PublicKey,
        stakePool: PublicKey,
        stakePoolWithdrawAuthority: PublicKey,
        sourceTokenAccount: PublicKey,
        destinationStakeAccount: PublicKey,
        managerFeeAccount: PublicKey,
        userTransferAuthority: PublicKey,
        lamports: number,
    ): TransactionInstruction;

    export function addWithdrawSolInstruction(
        programId: PublicKey,
        stakePool: PublicKey,
        stakePoolWithdrawAuthority: PublicKey,
        sourceStakeAccount: PublicKey,
        destinationTokenAccount: PublicKey,
        managerFeeAccount: PublicKey,
        userTransferAuthority: PublicKey,
        lamports: number,
    ): TransactionInstruction;

    export const createDepositSolInstruction: (params: {
        stakePoolProgramId: PublicKey;
        stakePoolId: PublicKey;
        authority: PublicKey;
        userSource: PublicKey;
        userTokenAccount: PublicKey;
        depositAmount: number;
    }) => TransactionInstruction;
}

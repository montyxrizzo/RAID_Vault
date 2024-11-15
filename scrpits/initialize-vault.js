const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const MINT_ADDRESS = "BPFw62HkLiacp1h7MCitiWRZHpWSThxycDbVmn7rMUGx";

describe("raid_rewards", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RaidRewards;

  const admin = provider.wallet;
  const mint = new anchor.web3.PublicKey(MINT_ADDRESS);

  it("Initializes the vault!", async () => {
    try {
      // Derive the vault PDA
      const [vaultPda, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("vault_seed")],
        program.programId
      );

      const [stakingVaultAuthority] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("staking_vault_authority")],
        program.programId
      );

      const [stakingVault] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("staking_vault")],
        program.programId
      );

      // Debug logs to identify account with signature issue
      console.log("vaultPda:", vaultPda.toString());
      console.log("stakingVault:", stakingVault.toString());
      console.log("stakingVaultAuthority:", stakingVaultAuthority.toString());
      console.log("admin public key:", admin.publicKey.toString());

      // Run the initialize transaction
      const tx = await program.rpc.initialize(
        new anchor.BN(1000),
        {
          accounts: {
            vault: vaultPda,
            admin: admin.publicKey,
            raidMint: mint,
            stakingVault,
            stakingVaultAuthority,
            systemProgram: SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
          signers: [admin.payer], // Only include actual signers
        }
      );

      console.log("Vault initialized with transaction:", tx);
      console.log("Vault PDA public key:", vaultPda.toString());
      console.log("Staking vault public key:", stakingVault.toString());
    } catch (error) {
      console.error("Error during vault initialization:", error.message);
      throw error; // Re-throw to mark test as failed
    }
  });
});

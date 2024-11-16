const { PublicKey } = require('@solana/web3.js');

const programId = new PublicKey("Fued2nqCBeS2heEpj6gvv4x7YrmXBgUPEG4d5RQ7pKgL");
const poolId = "example-pool-id"; // Replace with actual pool_id
const creatorPublicKey = new PublicKey("CreatorPublicKey"); // Replace with actual creator public key

(async () => {
    const [poolConfigPDA] = await PublicKey.findProgramAddress(
        [Buffer.from(poolId), creatorPublicKey.toBuffer()],
        programId
    );
    console.log("PoolConfig PDA:", poolConfigPDA.toBase58());
})();

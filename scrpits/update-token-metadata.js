import {
	updateV1,
	findMetadataPda,
	mplTokenMetadata,
	TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { signerIdentity, sol, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { Keypair, PublicKey, Transaction, Connection, sendAndConfirmTransaction } from "@solana/web3.js";

// Initialize Umi with the Solana Devnet endpoint
const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Use your existing secret key for RAID's signer
const secret = [50, 174, 46, 66, 193, 4, 111, 223, 135, 48, 242, 200, 215, 31, 125, 101, 121, 75, 135, 207, 91, 180, 96, 79, 226, 62, 168, 111, 101, 210, 23, 157, 237, 216, 27, 84, 223, 122, 169, 247, 14, 105, 151, 248, 87, 96, 173, 40, 218, 74, 83, 177, 2, 32, 4, 122, 90, 171, 85, 7, 59, 211, 83, 42];
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

// Set up a compatible signer for Umi
umi.use(signerIdentity(keypair));



// RAID token mint address
const mint = new PublicKey("HkEzCy3whaB1yLPXiFy2y1nw1TUiY45bem9dKQZh3BRV");
// Metadata for RAID token with URI adjustment
const tokenMetadata = {
    name: "RAID",
    symbol: "RAID",
    uri: "https://raw.githubusercontent.com/montyxrizzo/TestingRepo/refs/heads/main/metadata.json", // Increment version
};

// Function to update metadata
async function updateMetadata() {
    try {
        // Derive the metadata account
        const metadataAccountAddress = await findMetadataPda(umi, { mint });
        console.log(`Metadata account derived: ${metadataAccountAddress}`);

        // Create the update metadata instruction
        const updateMetadataInstruction = await updateV1(umi, {
            mint,
            authority: umi.identity,
            payer: umi.identity,
            updateAuthority: umi.identity,
            name: tokenMetadata.name,
            symbol: tokenMetadata.symbol,
            uri: tokenMetadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            tokenStandard: TokenStandard.Fungible,
        }).getInstructions();

        // Prepare the transaction with all public keys as PublicKey objects
        const transaction = new Transaction().add(...updateMetadataInstruction.map((ix) => {
            ix.keys = ix.keys.map(({ pubkey, ...rest }) => ({
                pubkey: new PublicKey(pubkey.toString()), 
                ...rest
            }));
            return ix;
        }));

        transaction.feePayer = keypair.publicKey;

        // Send and confirm the transaction
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const txid = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`Metadata updated successfully: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
    } catch (error) {
        console.error("Error updating metadata:", error);
    }
}

// Execute the function
updateMetadata();

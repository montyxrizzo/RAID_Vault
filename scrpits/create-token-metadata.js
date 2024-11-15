// Imports
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    createMetadataAccountV3
} from '@metaplex-foundation/mpl-token-metadata';
import {
    clusterApiUrl,
    PublicKey,
    Keypair,
    Transaction,
    Connection,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { fromWeb3JsPublicKey, toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Connection and Umi instance
const endpoint = clusterApiUrl("devnet");
const umi = createUmi(endpoint);
const connection = new Connection(endpoint);
const secret = [50,174,46,66,193,4,111,223,135,48,242,200,215,31,125,101,121,75,135,207,91,180,96,79,226,62,168,111,101,210,23,157,237,216,27,84,223,122,169,247,14,105,151,248,87,96,173,40,218,74,83,177,2,32,4,122,90,171,85,7,59,211,83,42];
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

// Constants for RAID token
const mplProgramId = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
// const mint = new PublicKey("HkEzCy3whaB1yLPXiFy2y1nw1TUiY45bem9dKQZh3BRV");
const mint = new PublicKey("BPFw62HkLiacp1h7MCitiWRZHpWSThxycDbVmn7rMUGx");

const [metadata] = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        mplProgramId.toBytes(),
        mint.toBytes()
    ],
    mplProgramId
);

// Metadata Account IX Args
const args = {
    data: {
        name: "RAID",
        symbol: "RAID",
        uri: "https://raw.githubusercontent.com/montyxrizzo/TestingRepo/refs/heads/main/metadata.json", // Increment version
        collection: null,
        creators: [
            { address: fromWeb3JsPublicKey(keypair.publicKey), verified: true, share: 100 }
        ],
        uses: null
    },
    isMutable: true,
    collectionDetails: null
};

// Dummy signer instance to match the required mint authority and signer types
const signer = {
    publicKey: fromWeb3JsPublicKey(keypair.publicKey),
    signTransaction: null,
    signMessage: null,
    signAllTransactions: null
};

// Metadata Account IX Accounts
const accounts = {
    metadata: fromWeb3JsPublicKey(metadata),
    mint: fromWeb3JsPublicKey(mint),
    payer: signer,
    mintAuthority: signer,
    updateAuthority: fromWeb3JsPublicKey(keypair.publicKey)
};

// Merge arguments to match the parameters required by the method
const fullArgs = { ...accounts, ...args };

const metadataBuilder = createMetadataAccountV3(umi, fullArgs);

(async () => {
    try {
        // Retrieve the transaction instruction and set required keys
        const ix = metadataBuilder.getInstructions()[0];
        ix.keys = ix.keys.map(key => ({
            ...key,
            pubkey: toWeb3JsPublicKey(key.pubkey)
        }));

        // Build and send the transaction
        const transaction = new Transaction().add(ix);
        const txid = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`Metadata created successfully: ${txid}`);
    } catch (error) {
        console.error("Error creating metadata:", error);
    }
})();

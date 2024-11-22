import {  keypairIdentity } from '@metaplex-foundation/js';
import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
// Import the entire module as a default export
import pkg from '@metaplex-foundation/mpl-token-metadata';
const { Metadata, CreateMetadataV2, UpdateMetadataV2 } = pkg;

// Your setup and transaction logic here...
// Import the required functions or objects from the Metaplex package
import { Metaplex, programs } from '@metaplex-foundation/js';  // Adjust based on the actual package structure

const { metadata } = programs;  // Assuming 'metadata' is the part of the 'programs'


import { readFileSync} from "fs";

const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const TOKEN_MINT = new PublicKey("CdNQmTvm56YWoox9twQA4Ha3rY4mZYLnxgsKQg6YXPDT");
const FEE_PAYER = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(readFileSync("scrpits/keys/id.json", "utf8")))
);
const MINT_AUTHORITY = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(readFileSync("scrpits/keys/mint.json", "utf8")))
);

// Metadata details
const NAME = "Radeon (Pool Token)";
const SYMBOL = "RAD";
const URI = "https://raw.githubusercontent.com/montyxrizzo/RaidMetaData/refs/heads/main/slp_metadata.json";

(async () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

  // Derive metadata account
  const [metadataAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      TOKEN_MINT.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  console.log("Metadata Account:", metadataAccount.toBase58());

  // Create metadata instruction
  const metadataData = {
    name: NAME,
    symbol: SYMBOL,
    uri: URI,
    sellerFeeBasisPoints: 0, // No royalties
    creators: null,
  };

  const transaction = new Transaction().add(
    programs.metadata.createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataAccount,
        mint: TOKEN_MINT,
        mintAuthority: MINT_AUTHORITY.publicKey,
        payer: FEE_PAYER.publicKey,
        updateAuthority: FEE_PAYER.publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: metadataData,
          isMutable: true,
        },
      }
    )
  );

  // Send transaction
  const signature = await connection.sendTransaction(transaction, [FEE_PAYER, MINT_AUTHORITY]);
  console.log("Transaction Signature:", signature);

  // Confirm transaction
  await connection.confirmTransaction(signature, "confirmed");
  console.log("Metadata successfully updated!");
})();

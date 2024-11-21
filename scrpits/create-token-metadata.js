import { Connection, PublicKey, Keypair, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Buffer } from 'buffer';

import{readFileSync}  from 'fs';
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');


// Read and parse the secret keys from the JSON files
const managerSecretKey = JSON.parse(readFileSync('/home/montyrodgers/projects/PROD/keys/authority.json'));
const payerSecretKey = JSON.parse(readFileSync('/home/montyrodgers/projects/PROD/keys/mint.json'));

// Create Keypair instances
const manager = Keypair.fromSecretKey(new Uint8Array(managerSecretKey));
const payer = Keypair.fromSecretKey(new Uint8Array(payerSecretKey));
// Public keys from your provided details
const stakePool = new PublicKey('2WwgnKfu9NuAiwshph864uD9wyGRCtmvhpsVGy4dHaDo');
const withdrawAuthority = new PublicKey('JAiQboCkQaE6FK3wjwMBydg2P2XmviKk54Xqz5wtdr2t');
const tokenMetadata = new PublicKey('JAiQboCkQaE6FK3wjwMBydg2P2XmviKk54Xqz5wtdr2t'); // Assuming this is the metadata account

// Metadata details
const name = "Radeon";
const symbol = "RAD";
const uri = "https://raw.githubusercontent.com/montyxrizzo/RaidMetaData/main/2_x_2_logo.png";

// Use your module that contains the updateTokenMetadata method
const updateMetadataInstruction = YourModule.updateTokenMetadata({
  stakePool,
  withdrawAuthority,
  tokenMetadata,
  manager: manager.publicKey,
  name,
  symbol,
  uri,
});

const transaction = new Transaction().add(updateMetadataInstruction);

// Set the payer of the transaction
transaction.feePayer = payer.publicKey;
transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

try {
  const signature = await sendAndConfirmTransaction(connection, transaction, [manager, payer]);
  console.log('Transaction successful! Signature:', signature);
} catch (error) {
  console.error('Transaction failed:', error);
}

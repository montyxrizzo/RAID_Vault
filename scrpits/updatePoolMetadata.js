import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram
  } from '@solana/web3.js';
  import fs from 'fs';
  import path from 'path';
  import os from 'os';
  // Corrected import
// Import the entire module as a default export and use destructuring to get Metadata
import pkg from '@metaplex-foundation/mpl-token-metadata';
const { Metadata } = pkg;
const METADATA_PROGRAM_ID = new PublicKey('12woosQ6rE5vRJCEq9g2PUXHcV9MsVeE2wy6Nw6wsiSG'); // Example ID, replace with actual


// Example to manually compute a PDA, which depends on how the Metadata PDA is set in your smart contract
async function getMetadataPDA(mint) {
    return await PublicKey.findProgramAddress(
        [
            Buffer.from('metadata'), 
            METADATA_PROGRAM_ID.toBuffer(), 
            mint.toBuffer()
        ],
        METADATA_PROGRAM_ID
    );
}

const {  createMetadataAccountArgsV2, createCreateMetadataAccountV2Instruction } = pkg;

  
  // Setup connection to the Solana cluster
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
  // Load necessary keypairs
  const feePayer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('keys/id.json' ,'utf-8'))));
  const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('keys/mint.json'), 'utf-8')));
  
  // Given stake pool info
  const poolTokenMint = new PublicKey('CdNQmTvm56YWoox9twQA4Ha3rY4mZYLnxgsKQg6YXPDT');
  const [metadataPDA] = await getMetadataPDA(poolTokenMint);
  // Metadata details
  const args = new CreateMetadataAccountArgs({
    data: {
      name: 'Radeon',
      symbol: 'RAD',
      uri: 'https://raw.githubusercontent.com/montyxrizzo/RaidMetaData/refs/heads/main/slp_metadata.json',
      sellerFeeBasisPoints: 100, // Example: 1% fee
      creators: [{
        address: mintAuthority.publicKey.toString(),
        verified: true,
        share: 100
      }],
      collection: null,
      uses: null
    },
    isMutable: true
  });
  
  // Create Metadata instruction
  const createMetadataInstruction = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      mint: poolTokenMint,
      mintAuthority: mintAuthority.publicKey,
      payer: feePayer.publicKey,
      updateAuthority: mintAuthority.publicKey
    },
    {
      createMetadataAccountArgsV2: args
    }
  );
  
  // Create the transaction
  let transaction = new Transaction().add(createMetadataInstruction);
  
  // Setup transaction parameters
  transaction.feePayer = feePayer.publicKey;
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  
  // Sign and send the transaction
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [feePayer, mintAuthority]);
    console.log('Transaction successful! Signature:', signature);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
  
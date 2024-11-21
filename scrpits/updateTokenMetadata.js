import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import fs from 'fs';


// Constants
const MINT_ADDRESS = 'CdNQmTvm56YWoox9twQA4Ha3rY4mZYLnxgsKQg6YXPDT';
const METADATA_URI = 'https://raw.githubusercontent.com/montyxrizzo/RaidMetaData/refs/heads/main/slp_metadata.json';
const UPDATE_AUTHORITY_PATH = 'keys/mint.json'; // Path to update authority keypair

(async () => {
    // Initialize connection and identity
    const connection = new Connection('https://api.devnet.solana.com'); // Change to mainnet if needed
    const updateAuthority = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(UPDATE_AUTHORITY_PATH, 'utf-8')))
    );
    const metaplex = Metaplex.make(connection).use(keypairIdentity(updateAuthority));

    // Load mint public key
    const mint = new PublicKey(MINT_ADDRESS);

    // Fetch the current metadata
    const nft = await metaplex.nfts().findByMint({ mint });

    console.log('Current Metadata:', nft.metadata);

    // Update metadata
    const { uri, name, symbol } = nft.metadata;
    const updatedMetadata = await metaplex.nfts().update({
        nftOrSft: nft,
        name: 'Radeon', // New name
        symbol: 'RAD', // New symbol
        uri: METADATA_URI, // New URI
    });

    console.log('Updated Metadata:', updatedMetadata);
})();

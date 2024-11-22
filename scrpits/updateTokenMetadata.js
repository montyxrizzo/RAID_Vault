import {readFileSync} from 'fs'
const mintKeypair = JSON.parse(readFileSync('./keys/mint.json', 'utf8'));

const extensions = [
    ExtensionType.MetadataPointer,
];

// Initialize the mint account with appropriate space and lamports
const initAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair,
    lamports: await connection.getMinimumBalanceForRentExemption(getMintLen(extensions)),
    space: getMintLen(extensions),
    programId: TOKEN_2022_PROGRAM_ID,
});

// Initialize the metadata pointer with the given URL
const initPointerIx = await createInitializeMetadataPointerInstruction(
    mint.publicKey,
    payer.publicKey,
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID
);

// Initialize the mint with a decimal value of 9 (commonly used for fungible tokens)
const createInitializeMintIx = await createInitializeMint2Instruction(
    mint.publicKey,
    9, // RAID token decimals
    payer.publicKey,
    null,
    TOKEN_2022_PROGRAM_ID
);

const blockhash = await connection.getLatestBlockhash();

const message = new TransactionMessage({
    payerKey: payer.publicKey,
    instructions: [initAccountIx, initPointerIx, createInitializeMintIx],
    recentBlockhash: blockhash.blockhash,
}).compileToV0Message();

const tx = new VersionedTransaction(message);
tx.sign([payer, mint]);

// Send and confirm the transaction
const initMintSig = await connection.sendTransaction(tx);
await connection.confirmTransaction({
    signature: initMintSig,
    ...blockhash,
});

// Use metadata initialization with the provided values
const sig = await tokenMetadataInitializeWithRentTransfer(
    connection,
    payer,
    mint.publicKey,
    payer.publicKey,
    payer,
    "Remote AI Infrastructure Deployment", // Token name
    "RAID",                                // Token symbol
    "https://raw.githubusercontent.com/montyxrizzo/RaidMetaData/main/metadata.json", // Metadata URI
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
);

console.log("Mint Address:", mint.publicKey.toBase58());

// Retrieve and log the metadata for the token
const metadata = await getTokenMetadata(connection, mint.publicKey);
console.log("Metadata:", metadata);

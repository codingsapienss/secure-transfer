#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { generateKeyPairSync } = require('node:crypto');

// ---------------------
// 🔐 CLI Usage Parsing
// ---------------------
const args = process.argv.slice(2);

let targetDir = './keys';
let passphrase = 'default-passphrase';

args.forEach(arg => {
    if (arg.startsWith('--path=')) {
        targetDir = arg.split('=')[1];
    } else if (arg.startsWith('--passphrase=')) {
        passphrase = arg.split('=')[1];
    }
});

// ---------------------
// 📂 Ensure directory
// ---------------------
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// ---------------------
// 🔐 Generate RSA Keys
// ---------------------
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
    }
});

// ---------------------
// 💾 Write to disk
// ---------------------
fs.writeFileSync(path.join(targetDir, 'public.pem'), publicKey);
fs.writeFileSync(path.join(targetDir, 'private.pem'), privateKey);

console.log(`✅ RSA key pair generated at ${targetDir}`);

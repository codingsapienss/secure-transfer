const path = require('path');
const { generateKeyPairAndSave } = require('../utils/generateKeys');
const dotenv = require('dotenv');
dotenv.config();

const command = process.argv[2];

if (command === 'generate:keys') {
    generateKeyPairAndSave({
        privateKeyPath: path.resolve(__dirname, '../keys/private.pem'),
        publicKeyPath: path.resolve(__dirname, '../public/public.pem'),
        passphrase: process.env.SECURE_PASSPHRASE || 'default-passphrase',
    });
} else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
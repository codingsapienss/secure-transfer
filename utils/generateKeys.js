const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateKeys() {
    const { SECURE_PASSPHRASE, PRIVATE_KEY_PATH, PUBLIC_KEY_PATH } = process.env;
    if (!SECURE_PASSPHRASE || !PRIVATE_KEY_PATH || !PUBLIC_KEY_PATH) {
        throw new Error('Missing environment variables');
    }

    console.log('Generating 2048-bit RSA key pair...');
    const keypair = forge.pki.rsa.generateKeyPair(2048);
    const publicPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privatePem = forge.pki.encryptRsaPrivateKey(keypair.privateKey, SECURE_PASSPHRASE);

    ensureDirectory(path.dirname(PRIVATE_KEY_PATH));
    ensureDirectory(path.dirname(PUBLIC_KEY_PATH));

    fs.writeFileSync(PRIVATE_KEY_PATH, privatePem);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicPem);

    console.log(`✅ Keys generated:
  - Private Key: ${PRIVATE_KEY_PATH}
  - Public Key : ${PUBLIC_KEY_PATH}`);
}

module.exports = { generateKeys };

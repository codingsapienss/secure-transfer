const fs = require('fs');
const crypto = require('crypto');

/**
 * Generates RSA keypair and saves to files if they don't exist
 */
function generateKeys({ privateKeyPath, publicKeyPath, passphrase }) {
    if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) return;

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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
        },
    });

    fs.mkdirSync(require('path').dirname(privateKeyPath), { recursive: true });
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
}

module.exports = { generateKeys };

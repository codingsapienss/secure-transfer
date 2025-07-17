const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const privateKeyPem = fs.readFileSync(path.resolve(process.env.PRIVATE_KEY_PATH), 'utf8');
const privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, process.env.SECURE_PASSPHRASE);

function decryptMiddleware(req, res, next) {
    try {
        const { encryptedData, encryptedSecretKey, iv } = req.body;
        if (!encryptedData || !encryptedSecretKey || !iv) {
            return res.status(400).json({ error: 'Missing encrypted payload components' });
        }

        const aesKey = privateKey.decrypt(forge.util.decode64(encryptedSecretKey), 'RSA-OAEP');
        const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
        decipher.start({ iv: forge.util.decode64(iv) });
        decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
        const success = decipher.finish();

        if (!success) throw new Error('Decryption failed');

        req.body = JSON.parse(decipher.output.toString());
        next();
    } catch (err) {
        res.status(500).json({ error: `Decryption error: ${err.message}` });
    }
}

module.exports = { decryptMiddleware };

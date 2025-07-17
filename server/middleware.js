const fs = require('fs').promises;
const crypto = require('crypto');

/**
 * Creates middleware with the given config
 */
function createMiddleware({ privateKeyPath, passphrase }) {
    return async (req, res, next) => {
        try {
            const { encryptedData, encryptedSecretKey, iv } = req.body;

            const privateKeyPem = await fs.readFile(privateKeyPath, 'utf8');
            const secretKey = crypto.privateDecrypt(
                {
                    key: privateKeyPem,
                    passphrase,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                Buffer.from(encryptedSecretKey, 'base64')
            );

            const decipher = crypto.createDecipheriv(
                'aes-128-cbc',
                secretKey,
                Buffer.from(iv, 'base64')
            );

            let decrypted = decipher.update(Buffer.from(encryptedData, 'base64'));
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            req.body = JSON.parse(decrypted.toString('utf8'));
            next();
        } catch (err) {
            console.error('Decryption failed:', err);
            res.status(500).json({ message: 'Failed to decrypt data' });
        }
    };
}

module.exports = {
    createMiddleware,
};

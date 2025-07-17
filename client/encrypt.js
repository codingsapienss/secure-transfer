const forge = require('node-forge');
const axios = require('axios');

async function encryptPayload(payload, publicKeyUrl) {
    try {
        const response = await axios.get(publicKeyUrl);
        const publicKeyPem = response.data;
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

        const iv = forge.random.getBytesSync(16);
        const secretKey = forge.random.getBytesSync(16);

        const cipher = forge.cipher.createCipher('AES-CBC', secretKey);
        cipher.start({ iv });
        cipher.update(forge.util.createBuffer(JSON.stringify(payload)));
        cipher.finish();
        const encryptedData = forge.util.encode64(cipher.output.getBytes());

        const encryptedSecretKey = forge.util.encode64(publicKey.encrypt(secretKey, 'RSA-OAEP'));

        return {
            encryptedData,
            encryptedSecretKey,
            iv: forge.util.encode64(iv),
        };
    } catch (err) {
        throw new Error(`Encryption failed: ${err.message}`);
    }
}

module.exports = { encryptPayload };

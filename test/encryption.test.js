const { encryptPayload } = require('../client/encrypt');
const { generateKeys } = require('../utils/generateKeys');
const forge = require('node-forge');
const fs = require('fs');
require('dotenv').config();

describe('Hybrid Encryption', () => {
    beforeAll(() => {
        generateKeys();
    });

    test('Encrypt and decrypt payload', async () => {
        const payload = { name: 'Prashant', role: 'admin' };
        const publicKeyPem = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

        const encrypted = await encryptPayload(payload, 'data:text/plain;base64,' + Buffer.from(publicKeyPem).toString('base64'));

        const privateKeyPem = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
        const privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, process.env.SECURE_PASSPHRASE);
        const aesKey = privateKey.decrypt(forge.util.decode64(encrypted.encryptedSecretKey), 'RSA-OAEP');

        const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
        decipher.start({ iv: forge.util.decode64(encrypted.iv) });
        decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted.encryptedData)));
        decipher.finish();

        const decryptedPayload = JSON.parse(decipher.output.toString());
        expect(decryptedPayload).toEqual(payload);
    });
});

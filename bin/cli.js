const path = require('path');
const { generateKeyPairAndSave } = require('../utils/generateKeys');

generateKeyPairAndSave({
    privateKeyPath: path.resolve(__dirname, '../keys/private.pem'),
    publicKeyPath: path.resolve(__dirname, '../public/public.pem'),
    passphrase: process.env.SECURE_PASSPHRASE || 'default-passphrase',
});

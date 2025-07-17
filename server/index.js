const path = require('path');
const { generateKeys } = require('./crypto');
const { createMiddleware } = require('./middleware');

let _config = {
    privateKeyPath: '',
    publicKeyPath: '',
    passphrase: '',
};

/**
 * Call this in your main project to initialize secure-transfer
 * @param {Object} options
 * @param {string} options.keyDir - Directory to store/read keys
 * @param {string} options.passphrase - Passphrase for private key
 */
function setupSecureTransfer({ keyDir, passphrase }) {
    const privateKeyPath = path.resolve(keyDir, 'private.pem');
    const publicKeyPath = path.resolve(keyDir, 'public.pem');

    _config = {
        privateKeyPath,
        publicKeyPath,
        passphrase,
    };

    // Generate keys if not exists
    generateKeys({
        privateKeyPath,
        publicKeyPath,
        passphrase,
    });

    return {
        decryptMiddleware: createMiddleware(_config),
    };
}

module.exports = {
    setupSecureTransfer,
};

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
    if (!keyDir || !passphrase) {
        throw new Error(
            `[secure-transfer] Missing required config.
            - Received keyDir: ${keyDir}
            - Received passphrase: ${passphrase}`
        );
    }

    const privateKeyPath = path.resolve(keyDir, 'private.pem');
    const publicKeyPath = path.resolve(keyDir, 'public.pem');

    _config = {
        privateKeyPath,
        publicKeyPath,
        passphrase,
    };

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

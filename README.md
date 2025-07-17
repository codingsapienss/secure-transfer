````md
# 🔐 secure-transfer

[![NPM version](https://img.shields.io/npm/v/secure-transfer.svg)](https://www.npmjs.com/package/secure-transfer)

A simple and secure hybrid encryption solution (AES + RSA) for sending encrypted payloads from frontend to backend.

---

## ⚙️ Installation

```bash
npm install secure-transfer
```
````

---

## 🗝️ Key Generation (CLI)

Generate your RSA key pair before using:

```bash
npx secure-transfer generate:keys --dir=./keys --passphrase=your-secure-passphrase
```

✅ This creates:

- `keys/private.pem`
- `keys/public.pem`

---

## 🌐 Frontend Usage

```js
import { encryptPayload } from "secure-transfer/client/encrypt";

const encrypted = await encryptPayload(payload, "/public-key"); // or full URL

await fetch("/your-endpoint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(encrypted),
});
```

✅ This:

- Fetches the public key
- Encrypts your payload using AES
- Encrypts AES key using RSA
- Sends `{ encryptedData, encryptedSecretKey, iv }` to backend

---

## 🔧 Backend Usage

```js
const { setupSecureTransfer } = require("secure-transfer");
const path = require("path");

const { decryptMiddleware } = setupSecureTransfer({
  keyDir: path.join(__dirname, "keys"),
  passphrase: "your-secure-passphrase",
});

app.post("/your-endpoint", decryptMiddleware, (req, res) => {
  console.log(req.body); // original decrypted payload
  res.send("✅ Securely received");
});
```

✅ `decryptMiddleware`:

- Decrypts AES key using RSA private key
- Decrypts data using AES
- Attaches the original payload to `req.body`

---

## 🧪 Testing

```bash
npm test
```

✅ Run tests to verify encryption and decryption behavior.

---

## 📝 Notes

- You must host your public key on a known route like `/public-key`
- Never expose your private key to the frontend
- Always use HTTPS in production

---

```

```

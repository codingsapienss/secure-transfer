const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

app.use('/public_key.pem', express.static(path.resolve(process.env.PUBLIC_KEY_PATH)));





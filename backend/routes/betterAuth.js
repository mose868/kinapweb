const express = require('express');
const { toNodeHandler } = require('better-auth/node');
const { auth } = require('../auth.js');

const router = express.Router();

// Mount Better Auth handler for all auth routes
router.all('/*', toNodeHandler(auth));

module.exports = router; 
// fix-isomorphic-ws.js
/* eslint-disable @typescript-eslint/no-require-imports */
const ws = require('isomorphic-ws');

// Re-export the default export as a named export called "WebSocket"
exports.WebSocket = ws;
module.exports = ws;

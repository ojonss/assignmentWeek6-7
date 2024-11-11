const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const listenPort = 3000;

let data = require('./data/industrial.json');  // Make sure this file exists

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (JavaScript, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// (The rest of your routes would go here)

// Start the server
app.listen(listenPort, () => {
    console.log(`Server running on http://localhost:${listenPort}`);
});

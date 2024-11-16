const express = require('express');
const fs = require('fs');
const path = require('path');

// The secret password to check against
const correctPassword = 'swordfish';

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route for handling the password check
app.post('/check-password', (req, res) => {
    const { password } = req.body;

    if (password === correctPassword) {
        // If the password is correct
        res.status(200).send('Password correct!');
    } else {
        // If the password is incorrect
        res.status(401).send('Incorrect password.');
    }
});

// Route to serve the HTML page
app.get('/', (req, res) => {
    const htmlPath = path.resolve(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf-8', (err, htmlContent) => {
        if (err) {
            res.status(500).send('Error reading HTML file');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        }
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

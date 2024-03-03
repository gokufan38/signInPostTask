const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // If you need CORS

const app = express();
const port = 3001; // Assuming you want to run the server on port 3001

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS (optional)

// Placeholder for user data storage (we'll ideally replace this with a database)
let users = [];

// POST /signup Endpoint
app.post('/signup', (req, res) => {
    // Basic Validation - Update this for more robust validation
    if (!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send('Missing email, username, or password');
    }

    // Simplified user handling
    const newUser = req.body;
    users.push(newUser);

    res.status(201).send('User created');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

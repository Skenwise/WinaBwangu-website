const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //import cors
const mysql = require('mysql2'); // import mysql2

const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',      //XAMPP MySQL host
    user: 'root',           //default username
    password: '',           //default password
    database: 'winabwangu'  // your database in XAMPP
});

// connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' +err.stack);
        return;
    }
    console.log('Connect to the database');
});

// Enable cors for all router
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Handle POST request to /api/transaction and route to save a transaction in the database
app.post('/api/transaction', (req, res) => {
    const { transactionID, boothID, location, serviceID, TransactionAmount, revenue, total } = req.body;
    console.log("Incoming Transaction Data:", req.body); // Log incoming data for debugging

    const query = `INSERT INTO transactions (transactionID, boothID, location, ServiceID, TransactionAmount, revenue, total) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [transactionID, boothID, location, serviceID, TransactionAmount, revenue, total], (err, result) => {
        if (err) {
            console.error('Error saving transaction: ', err);
            return res.status(500).json({ error: 'Failed to save the transaction'});
        }
        console.log('Transaction saved:', req.body);
        res.status(200).json({message: 'Transaction saved successfully', id: result.insertId });
    });
});
// Route to fetch transactions from the database
app.get('/api/transactions', (req, res) => {
    const query =  'SELECT * FROM transactions';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve transactions.'});
        }
        console.log('retrieved data: ', results); // Log retrieved data
        res.status(200).json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

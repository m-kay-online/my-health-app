require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).send('Error creating user');
            res.status(201).send('User created successfully');
        }
    );
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(401).send('User not found');
        }
        const user = results[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('Invalid credentials for user:', username);
            return res.status(401).send('Invalid credentials');
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).send('Error fetching patients');
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM patients WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Error fetching patient');
        res.json(results[0]);
    });
});

router.post('/patients', (req, res) => {
    const { name, dob, father_name, husband_name, gender, mobile } = req.body;
    db.query(
        'INSERT INTO patients (name, dob, father_name, husband_name, gender, mobile) VALUES (?, ?, ?, ?, ?, ?)',
        [name, dob, father_name, husband_name, gender, mobile],
        (err, results) => {
            if (err) {
                console.log("This error came while adding patient: ", err)
                return res.status(500).send('Error adding patient');
            }
            res.status(201).send('Patient added successfully');
        }
    );
});

module.exports = router;
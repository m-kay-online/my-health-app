const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:patientId', (req, res) => {
    const { patientId } = req.params;

    db.query(
        'SELECT * FROM tests WHERE patient_id = ?',
        [patientId],
        (err, results) => {
            if (err) return res.status(500).send('Error fetching tests');
            res.json(results);
        }
    );
});

module.exports = router;
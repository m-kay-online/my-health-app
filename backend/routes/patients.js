const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) return res.status(500).send('Error fetching patients');
        res.json(results);
    });
});

router.get('/:patientId', (req, res) => {
    const { patientId } = req.params;
    db.query('SELECT * FROM patients WHERE id = ?', [patientId], (err, patientResults) => {
      if (err) return res.status(500).send('Error fetching patient details');
      if (patientResults.length === 0) return res.status(404).send('Patient not found');
  
      db.query('SELECT * FROM tests WHERE Patient_ID = ?', [patientId], (err, testResults) => {
        if (err) return res.status(500).send('Error fetching tests');
        const totalCostDue = testResults
          .filter(test => test.Payment_Due === 'No')
          .reduce((sum, test) => sum + test.Cost, 0);
        res.json({ patient: patientResults[0], tests: testResults, totalCostDue });
      });
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


router.delete('/:patientId', (req, res) => {
    const { patientId } = req.params;
    db.query('DELETE FROM tests WHERE Patient_ID = ?', [patientId], (err) => {
      if (err) return res.status(500).send('Error deleting tests');
      db.query('DELETE FROM patients WHERE id = ?', [patientId], (err) => {
        if (err) return res.status(500).send('Error deleting patient');
        res.send('Patient and associated tests deleted successfully');
      });
    });
  });


module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM tests', (err, results) => {
    if (err) return res.status(500).send('Error fetching tests');
    res.json(results);
  });
});

router.get('/test-costs', (req, res) => {
  db.query('SELECT * FROM test_cost', (err, results) => {
    if (err) return res.status(500).send('Error fetching test costs');
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { patientId, name, test, testPerformed, paymentDue, cost } = req.body; // Added name field
  console.log('Received data:', req.body); // Added logging for debugging
  db.query(
    'INSERT INTO tests (Patient_ID, Name, tests, test_performed, payment_due, cost) VALUES (?, ?, ?, ?, ?, ?)', // Added Name field
    [patientId, name, test, testPerformed, paymentDue, cost], // Added name field
    (err, results) => {
      if (err) {
        console.error('Error adding test:', err); // Added logging for debugging
        return res.status(500).send('Error adding test');
      }
      res.status(201).send('Test added successfully');
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { patientId, name, test, testPerformed, paymentDue, cost } = req.body; // Added name field
  db.query(
    'UPDATE tests SET Patient_ID = ?, Name = ?, Tests = ?, Test_Performed = ?, Payment_Due = ?, Cost = ? WHERE id = ?', // Added Name field
    [patientId, name, test, testPerformed, paymentDue, cost, id], // Added name field
    (err, results) => {
      if (err) {
        console.error('Error updating test:', err); // Added logging for debugging
        return res.status(500).send('Error updating test');
      }
      res.send('Test updated successfully');
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tests WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting test:', err); // Added logging for debugging
      return res.status(500).send('Error deleting test');
    }
    res.send('Test deleted successfully');
  });
});

module.exports = router;
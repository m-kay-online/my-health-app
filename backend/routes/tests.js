const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query(`
    SELECT tests.*, test_cost.department 
    FROM tests 
    LEFT JOIN test_cost ON tests.Tests = test_cost.test_name
  `, (err, results) => {
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
  const { patientId, name, test, testPerformed, paymentDue, cost } = req.body;
  db.query('SELECT department FROM test_cost WHERE test_name = ?', [test], (err, results) => {
    if (err) return res.status(500).send('Error fetching department');
    const department = results[0].department;
    db.query(
      'INSERT INTO tests (Patient_ID, Name, tests, test_performed, payment_due, cost, department) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patientId, name, test, testPerformed, paymentDue, cost, department],
      (err, results) => {
        if (err) {
          console.error('Error adding test:', err);
          return res.status(500).send('Error adding test');
        }
        res.status(201).send('Test added successfully');
      }
    );
  });
});

router.put('/:testId', (req, res) => {
  const { testId } = req.params;
  const { patientId, name, test, testPerformed, paymentDue, cost } = req.body;
  db.query('SELECT department FROM test_cost WHERE test_name = ?', [test], (err, results) => {
    if (err) return res.status(500).send('Error fetching department');
    const department = results[0].department;
    db.query(
      'UPDATE tests SET Patient_ID = ?, Name = ?, Tests = ?, Test_Performed = ?, Payment_Due = ?, Cost = ?, department = ? WHERE Test_ID = ?',
      [patientId, name, test, testPerformed, paymentDue, cost, department, testId],
      (err, results) => {
        if (err) {
          console.error('Error updating test:', err);
          return res.status(500).send('Error updating test');
        }
        res.send('Test updated successfully');
      }
    );
  });
});

router.delete('/:testId', (req, res) => {
  const { testId } = req.params;
  db.query('DELETE FROM tests WHERE Test_ID = ?', [testId], (err, results) => {
    if (err) {
      console.error('Error deleting test:', err);
      return res.status(500).send('Error deleting test');
    }
    res.send('Test deleted successfully');
  });
});

module.exports = router;
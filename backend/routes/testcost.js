const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch all test costs
router.get('/costs', (req, res) => {
  db.query('SELECT * FROM test_cost', (err, results) => {
    if (err) return res.status(500).send('Error fetching test costs');
    res.json(results);
  });
});

// Add a new test
router.post('/costs', (req, res) => {
  const { test_name, department, cost } = req.body;
  db.query(
    'INSERT INTO test_cost (test_name, department, cost) VALUES (?, ?, ?)',
    [test_name, department, cost],
    (err, results) => {
      if (err) return res.status(500).send('Error adding test');
      res.status(201).json({ id: results.insertId, test_name, department, cost });
    }
  );
});

// Delete a test by ID
router.delete('/costs/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM test_cost WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send('Error deleting test from backend');
    res.status(200).send('Test deleted successfully');
  });
});


// Edit a test by ID
router.put('/costs/:id', (req, res) => {
  const { id } = req.params;
  const { test_name, department, cost } = req.body;
  db.query(
    'UPDATE test_cost SET test_name = ?, department = ?, cost = ? WHERE id = ?',
    [test_name, department, cost, id],
    (err, results) => {
      if (err) return res.status(500).send('Error updating test');
      res.status(200).json({ id, test_name, department, cost });
    }
  );
});


module.exports = router;
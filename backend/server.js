const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load .env file

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const testRoutes = require('./routes/tests');
const testCostRoutes = require('./routes/testcost');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/tests', testRoutes);
app.use('/test-costs', testCostRoutes); 
app.use('/reports', reportRoutes);
// Ensure this matches the frontend call

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Healthcare App API');
});

const PORT = process.env.PORT || 5000; // Use the port from .env or default to 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
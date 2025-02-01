const express = require("express");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const router = express.Router();

router.get("/generate-pdf/:patientId", (req, res) => {
  const patientId = req.params.patientId;
  const command = `java -cp "lib/*;." GenerateReport ${patientId}`;

  // Set environment variables for the Java process
  const env = {
    ...process.env,
    DB_URL: process.env.DB_URL,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
  };

  // Set the working directory to ../jasper-reports
  const options = {
    env: env,
    cwd: path.join(__dirname, "../jasper-reports"),
  };

  console.log(`Executing command: ${command}`);
  console.log(`Working directory: ${options.cwd}`);
  console.log(`Environment variables: ${JSON.stringify(env)}`);

  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Error generating PDF");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send("Error generating PDF");
    }

    console.log(`Stdout: ${stdout}`);

    const pdfPath = path.join(
      __dirname,
      "../jasper-reports/output/PatientBill.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=PatientBill.pdf");
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error(`Error Sending File: ${err.message}`);
        return res.status(500).send("Error sending PDF");
      }
    });
  });
});

module.exports = router;
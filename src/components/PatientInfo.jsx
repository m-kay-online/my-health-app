import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import jsPDF from "jspdf";

const PatientInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [totalCostDue, setTotalCostDue] = useState(0);
  const [error, setError] = useState(null);

  const convertToIST = (utcDateStr) => {
    const utcDate = new Date(utcDateStr);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Fetch patient details and associated tests
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        const { patient: patientData, tests: testsData } = response.data;

        setPatient(patientData);
        setTests(testsData);

        // Calculate total cost due
        const costDue = testsData
          .filter((test) => test.Payment_Due === "Yes")
          .reduce((sum, test) => sum + parseFloat(test.Cost), 0);
        setTotalCostDue(costDue);
      } catch (err) {
        setError("Failed to fetch patient info. Please try again.");
      }
    };

    fetchPatientInfo();
  }, [id]);

  // Handle test deletion
  const handleDeleteTest = async (testId) => {
    try {
      await api.delete(`/tests/${testId}`);
      const updatedTests = tests.filter((test) => test.Test_ID !== testId);

      setTests(updatedTests);

      // Recalculate total cost due
      const costDue = updatedTests
        .filter((test) => test.Payment_Due === "Yes")
        .reduce((sum, test) => sum + parseFloat(test.Cost), 0);
      setTotalCostDue(costDue);
    } catch (err) {
      setError("Failed to delete test. Please try again.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineHeight = 10;
    let y = margin;

    doc.setFontSize(16);
    doc.text("Patient Info", margin, y);
    y += lineHeight;

    doc.setFontSize(12);
    doc.text(`Patient ID: ${patient.id}`, margin, y);
    y += lineHeight;
    doc.text(`Name: ${patient.name}`, margin, y);
    y += lineHeight;
    doc.text(`Date of Birth: ${convertToIST(patient.dob)}`, margin, y);
    y += lineHeight;
    doc.text(`Father's Name: ${patient.father_name}`, margin, y);
    y += lineHeight;
    doc.text(`Husband's Name: ${patient.husband_name}`, margin, y);
    y += lineHeight;
    doc.text(`Gender: ${patient.gender}`, margin, y);
    y += lineHeight;
    doc.text(`Mobile: ${patient.mobile}`, margin, y);
    y += lineHeight * 2;

    doc.setFontSize(16);
    doc.text("Tests", margin, y);
    y += lineHeight;

    doc.setFontSize(12);
    tests.forEach((test, index) => {
      const testInfo = `${index + 1}. Test ID: ${test.Test_ID}, Test: ${test.Tests}, Cost: ${test.Cost}, Test Performed: ${test.Test_Performed}, Payment Due: ${test.Payment_Due}, Department: ${test.department}`;
      const splitText = doc.splitTextToSize(testInfo, pageWidth - 2 * margin);
      doc.text(splitText, margin, y);
      y += splitText.length * lineHeight;
    });

    y += lineHeight;
    doc.setFontSize(14);
    doc.text(`Total Cost Due: ${totalCostDue}`, margin, y);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Patient Info</h2>

      {/* Patient Details */}
      <div className="mb-4">
        <p>
          <strong>Patient ID:</strong> {patient.id}
        </p>
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Date of Birth:</strong> {convertToIST(patient.dob)}
        </p>
        <p>
          <strong>Father's Name:</strong> {patient.father_name}
        </p>
        <p>
          <strong>Husband's Name:</strong> {patient.husband_name}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender}
        </p>
        <p>
          <strong>Mobile:</strong> {patient.mobile}
        </p>
      </div>

      {/* Tests Table */}
      <h3 className="text-xl font-bold mb-4">Tests</h3>
      {tests.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Test ID</th>
              <th className="py-2 px-4 border">Test</th>
              <th className="py-2 px-4 border">Cost</th>
              <th className="py-2 px-4 border">Test Performed</th>
              <th className="py-2 px-4 border">Payment Due</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.Test_ID}>
                <td className="py-2 px-4 border">{test.Test_ID}</td>
                <td className="py-2 px-4 border">{test.Tests}</td>
                <td className="py-2 px-4 border">{test.Cost}</td>
                <td className="py-2 px-4 border">{test.Test_Performed}</td>
                <td className="py-2 px-4 border">{test.Payment_Due}</td>
                <td className="py-2 px-4 border">{test.department}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDeleteTest(test.Test_ID)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tests available for this patient.</p>
      )}

      {/* Total Cost Due */}
      <div className="mt-4">
        <strong>Total Cost Due:</strong> {totalCostDue}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>

      {/* PDF Button */}
      <button
        onClick={generatePDF}
        className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default PatientInfo;
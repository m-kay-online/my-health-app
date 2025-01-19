import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import api from "../api";

const TestMaster = () => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [testCosts, setTestCosts] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    test: "",
    testPerformed: "Not Selected",
    paymentDue: "Not Selected",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTestId, setEditTestId] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error); // Added error handling
      }
    };

    const fetchTests = async () => {
      try {
        const response = await api.get("/tests");
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error); // Added error handling
      }
    };

    const fetchTestCosts = async () => {
      try {
        const response = await api.get("/tests/test-costs");
        setTestCosts(response.data);
      } catch (error) {
        console.error("Error fetching test costs:", error); // Added error handling
      }
    };

    fetchPatients();
    fetchTests();
    fetchTestCosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedTestCost = testCosts.find(
      (test) => test.test_name === formData.test
    );
    if (!selectedTestCost) {
      console.error("Test cost not found"); // Added error handling
      return;
    }

    const selectedPatient = patients.find(
      (patient) => patient.id === parseInt(formData.patientId)
    );
    if (!selectedPatient) {
      console.error("Patient not found"); // Added error handling
      return;
    }

    const newTest = {
      ...formData,
      name: selectedPatient.name, // Set the name field
      cost: selectedTestCost.cost,
    };

    try {
      if (isEditing) {
        await api.put(`/tests/${editTestId}`, newTest);
        setIsEditing(false);
        setEditTestId(null);
      } else {
        console.log(newTest); // Added logging for debugging
        await api.post("/tests", newTest);
      }

      setFormData({
        patientId: "",
        name: "", // Reset name field
        test: "",
        testPerformed: "Not Selected",
        paymentDue: "Not Selected",
      });

      const response = await api.get("/tests");
      setTests(response.data);
    } catch (error) {
      console.error("Error saving test:", error); // Added error handling
    }
  };

  const handleEdit = (test) => {
    setFormData({
      patientId: test.Patient_ID,
      name: test.Name, 
      test: (test.Tests).toLowerCase(),
      testPerformed: test.Test_Performed,
      paymentDue: test.Payment_Due,
    });
    setIsEditing(true);
    setEditTestId(test.id); // Ensure editTestId is set correctly
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tests/${id}`);
      const response = await api.get("/tests");
      setTests(response.data);
    } catch (error) {
      console.error("Error deleting test:", error); // Added error handling
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Test Master</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Patient:</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Test:</label>
          <select
            name="test"
            value={formData.test}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Test</option>
            {testCosts.map((test) => (
              <option key={test.id} value={test.test_name}>
                {test.test_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Test Performed:</label>
          <select
            name="testPerformed"
            value={formData.testPerformed}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Done">Done</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Payment Due:</label>
          <select
            name="paymentDue"
            value={formData.paymentDue}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Done">Done</option>
            <option value="No">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditing ? "Edit Details" : "Add Details"}
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4">Test Details</h3>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Patient ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Test</th>
            <th className="py-2 px-4 border">Cost</th>
            <th className="py-2 px-4 border">Test Performed</th>
            <th className="py-2 px-4 border">Payment Due</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={nanoid()}>
              {console.log(test)}
              <td className="py-2 px-4 border">{test.Patient_ID}</td>
              <td className="py-2 px-4 border">{test.Name}</td>
              <td className="py-2 px-4 border">{test.Tests}</td>
              <td className="py-2 px-4 border">{test.Cost}</td>
              <td className="py-2 px-4 border">{test.Test_Performed}</td>
              <td className="py-2 px-4 border">{test.Payment_Due}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(test)}
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestMaster;

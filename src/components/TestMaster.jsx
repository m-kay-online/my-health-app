import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Error fetching patients.");
      }
    };

    const fetchTests = async () => {
      try {
        const response = await api.get("/tests");
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error("Error fetching tests.");
      }
    };

    const fetchTestCosts = async () => {
      try {
        const response = await api.get("/tests/test-costs");
        setTestCosts(response.data);
      } catch (error) {
        console.error("Error fetching test costs:", error);
        toast.error("Error fetching test costs.");
      }
    };

    fetchPatients();
    fetchTests();
    fetchTestCosts();
    setLoading(false);
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
      console.error("Test cost not found");
      toast.error("Test cost not found.");
      return;
    }

    const selectedPatient = patients.find(
      (patient) => patient.id === parseInt(formData.patientId)
    );
    if (!selectedPatient) {
      console.error("Patient not found");
      toast.error("Patient not found.");
      return;
    }

    const newTest = {
      ...formData,
      name: selectedPatient.name,
      cost: selectedTestCost.cost,
      department: selectedTestCost.department,
    };

    try {
      if (isEditing) {
        await api.put(`/tests/${editTestId}`, newTest);
        setIsEditing(false);
        setEditTestId(null);
        toast.success("Test updated successfully!");
      } else {
        await api.post("/tests", newTest);
        toast.success("Test added successfully!");
      }

      setFormData({
        patientId: "",
        name: "",
        test: "",
        testPerformed: "Not Selected",
        paymentDue: "Not Selected",
      });

      const response = await api.get("/tests");
      setTests(response.data);
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("Error saving test.");
    }
  };

  const handleEdit = (test) => {
    setFormData({
      patientId: test.Patient_ID,
      name: test.Name,
      test: test.Tests,
      testPerformed: test.Test_Performed,
      paymentDue: test.Payment_Due,
    });
    setIsEditing(true);
    setEditTestId(test.Test_ID);
  };

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      await api.delete(`/tests/${testId}`);
      const response = await api.get("/tests");
      setTests(response.data);
      toast.success("Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Error deleting test.");
    }
  };

  if (loading) {
    return <div className="text-blue-500 text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-t from-emerald-500 to-sky-600 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Master</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block mb-1 text-gray-700">Patient:</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block mb-1 text-gray-700">Test:</label>
          <select
            name="test"
            value={formData.test}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block mb-1 text-gray-700">Test Performed:</label>
          <select
            name="testPerformed"
            value={formData.testPerformed}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Done">Done</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Payment Due:</label>
          <select
            name="paymentDue"
            value={formData.paymentDue}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          {isEditing ? "Edit Details" : "Add Details"}
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800">Test Details</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border">Test ID</th>
            <th className="py-2 px-4 border">Patient ID</th>
            <th className="py-2 px-4 border">Name</th>
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
            <tr key={test.Test_ID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{test.Test_ID}</td>
              <td className="py-2 px-4 border">{test.Patient_ID}</td>
              <td className="py-2 px-4 border">{test.Name}</td>
              <td className="py-2 px-4 border">{test.Tests}</td>
              <td className="py-2 px-4 border">{test.Cost}</td>
              <td className="py-2 px-4 border">{test.Test_Performed}</td>
              <td className="py-2 px-4 border">{test.Payment_Due}</td>
              <td className="py-2 px-4 border">{test.Department}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(test)}
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(test.Test_ID)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default TestMaster;
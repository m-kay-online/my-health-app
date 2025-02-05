import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../api"; // Axios instance

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    father_name: "",
    husband_name: "",
    gender: "",
    mobile: "",
  });
  const navigate = useNavigate();

  const convertToIST = (utcDateStr) => {
    const utcDate = new Date(utcDateStr);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch patients. Please try again.");
        setLoading(false);
        toast.error("Failed to fetch patients. Please try again.");
      }
    };

    fetchPatients();
  }, []);

  const handleEditClick = (patient) => {
    const formattedDob = convertToIST(patient.dob)
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      dob: formattedDob,
      father_name: patient.father_name,
      husband_name: patient.husband_name,
      gender: patient.gender,
      mobile: patient.mobile,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/patients/${editingPatient.id}`, formData);
      const updatedPatients = patients.map((patient) =>
        patient.id === editingPatient.id ? { ...patient, ...formData } : patient
      );
      setPatients(updatedPatients);
      setEditingPatient(null);
      toast.success("Patient updated successfully!");
    } catch (err) {
      setError("Failed to update patient. Please try again.");
      toast.error("Failed to update patient. Please try again.");
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await api.delete(`/patients/${patientId}`);
      setPatients(patients.filter((patient) => patient.id !== patientId));
      toast.success("Patient deleted successfully!");
    } catch (err) {
      setError("Failed to delete patient. Please try again.");
      toast.error("Failed to delete patient. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-blue-500 text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  return (
    <div className="p-8  min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient List</h2>
      {patients.length === 0 ? (
        <div className="text-white">No patients available.</div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">Patient ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Father's Name</th>
              <th className="py-2 px-4 border">Husband's Name</th>
              <th className="py-2 px-4 border">Gender</th>
              <th className="py-2 px-4 border">Mobile</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{patient.id}</td>
                <td className="py-2 px-4 border">{patient.name}</td>
                <td className="py-2 px-4 border">{patient.father_name}</td>
                <td className="py-2 px-4 border">{patient.husband_name}</td>
                <td className="py-2 px-4 border">{patient.gender}</td>
                <td className="py-2 px-4 border">{patient.mobile}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => navigate(`/patient-info/${patient.id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditClick(patient)}
                    className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingPatient && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Edit Patient</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Father's Name:</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Husband's Name:</label>
              <input
                type="text"
                name="husband_name"
                value={formData.husband_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Mobile:</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PatientDetails;
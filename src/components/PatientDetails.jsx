import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Convert UTC date string to IST and format as YYYY-MM-DD
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
        // Convert each patient's dob to IST
        const updatedPatients = response.data.map((patient) => ({
          ...patient,
          dob: convertToIST(patient.dob),
        }));
        setPatients(updatedPatients);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch patients.");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      dob: patient.dob, // Already converted to IST
      father_name: patient.father_name,
      husband_name: patient.husband_name,
      gender: patient.gender,
      mobile: patient.mobile,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    } catch (err) {
      setError("Failed to update patient.");
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await api.delete(`/patients/${patientId}`);
      setPatients(patients.filter((patient) => patient.id !== patientId));
    } catch (err) {
      setError("Failed to delete patient.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Patient List</h2>
      {patients.length === 0 ? (
        <div>No patients available.</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
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
              <tr key={patient.id}>
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
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Edit Patient</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Other fields remain unchanged */}
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;

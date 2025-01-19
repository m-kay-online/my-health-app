import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const { patientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (patientId) {
      const fetchTests = async () => {
        try {
          const response = await api.get(`/tests/${patientId}`);
          setTests(response.data);
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      };

      fetchTests();
    }
  }, [patientId]);

  const handleDeletePatient = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      await api.delete(`/tests/${id}`);
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Patient ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">DOB</th>
            <th className="py-2 px-4 border">Father's Name</th>
            <th className="py-2 px-4 border">Gender</th>
            <th className="py-2 px-4 border">Mobile</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="py-2 px-4 border">
                <Link to={`/patient/${patient.id}`} className="text-blue-500 hover:underline">{patient.id}</Link>
              </td>
              <td className="py-2 px-4 border">
                <Link to={`/patient/${patient.id}`} className="text-blue-500 hover:underline">{patient.name}</Link>
              </td>
              <td className="py-2 px-4 border">{patient.dob}</td>
              <td className="py-2 px-4 border">{patient.father_name}</td>
              <td className="py-2 px-4 border">{patient.gender}</td>
              <td className="py-2 px-4 border">{patient.mobile}</td>
              <td className="py-2 px-4 border">
                <button onClick={() => navigate(`/edit-patient/${patient.id}`)} className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => handleDeletePatient(patient.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {patientId && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Test Details for Patient ID: {patientId}</h3>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Test ID</th>
                <th className="py-2 px-4 border">Test Name</th>
                <th className="py-2 px-4 border">Result</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="py-2 px-4 border">{test.id}</td>
                  <td className="py-2 px-4 border">{test.name}</td>
                  <td className="py-2 px-4 border">{test.result}</td>
                  <td className="py-2 px-4 border">{test.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
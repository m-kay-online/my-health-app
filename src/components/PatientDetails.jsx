import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const { patientId } = useParams();

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
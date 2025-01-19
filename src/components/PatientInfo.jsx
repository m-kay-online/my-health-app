import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const PatientInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [tests, setTests] = useState([]);
    const [totalCostDue, setTotalCostDue] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await api.get(`/patients/${id}`);
                setPatient(response.data.patient);
                setTests(response.data.tests);
                setTotalCostDue(response.data.totalCostDue);
            } catch (err) {
                setError('Failed to fetch patient info.');
            }
        };

        fetchPatientInfo();
    }, [id]);

    const handleDeleteTest = async (testId) => {
        try {
            await api.delete(`/tests/${testId}`);
            setTests(tests.filter(test => test.Test_ID !== testId));
            setTotalCostDue(tests.filter(test => test.Test_ID !== testId && test.Payment_Due === 'No').reduce((sum, test) => sum + test.Cost, 0));
        } catch (err) {
            setError('Failed to delete test.');
        }
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
            <div className="mb-4">
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Date of Birth:</strong> {patient.dob}</p>
                <p><strong>Father's Name:</strong> {patient.father_name}</p>
                <p><strong>Husband's Name:</strong> {patient.husband_name}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Mobile:</strong> {patient.mobile}</p>
            </div>
            <h3 className="text-xl font-bold mb-4">Tests</h3>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Test ID</th>
                        <th className="py-2 px-4 border">Test</th>
                        <th className="py-2 px-4 border">Cost</th>
                        <th className="py-2 px-4 border">Test Performed</th>
                        <th className="py-2 px-4 border">Payment Due</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map(test => (
                        <tr key={test.Test_ID}>
                            <td className="py-2 px-4 border">{test.Test_ID}</td>
                            <td className="py-2 px-4 border">{test.Tests}</td>
                            <td className="py-2 px-4 border">{test.Cost}</td>
                            <td className="py-2 px-4 border">{test.Test_Performed}</td>
                            <td className="py-2 px-4 border">{test.Payment_Due}</td>
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
            <div className="mt-4">
                <strong>Total Cost Due:</strong> {totalCostDue}
            </div>
        </div>
    );
};

export default PatientInfo;
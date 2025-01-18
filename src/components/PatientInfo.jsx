import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Axios instance

const PatientInfo = () => {
    const { id } = useParams(); // Get patient ID from the URL
    const navigate = useNavigate(); // For navigation
    const [patient, setPatient] = useState(null);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        // Fetch patient details
        api.get(`/patients/${id}`)
            .then((response) => {
                setPatient(response.data);
            })
            .catch((error) => console.error('Error fetching patient:', error));

        // Fetch tests for the patient
        api.get(`/tests/${id}`)
            .then((response) => {
                setTests(response.data);
            })
            .catch((error) => console.error('Error fetching tests:', error));
    }, [id]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    const totalCost = tests.reduce((sum, test) => sum + test.cost, 0);
    const totalPaid = tests.filter((test) => test.paid).reduce((sum, test) => sum + test.cost, 0);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Patient Information</h2>
            <div className="mb-4">
                <strong>Name:</strong> {patient.name}
            </div>
            <div className="mb-4">
                <strong>DOB:</strong> {patient.dob}
            </div>
            <div className="mb-4">
                <strong>Father's Name:</strong> {patient.father_name}
            </div>
            <div className="mb-4">
                <strong>Husband's Name:</strong> {patient.husband_name || 'N/A'}
            </div>
            <div className="mb-4">
                <strong>Gender:</strong> {patient.gender}
            </div>
            <div className="mb-4">
                <strong>Mobile:</strong> {patient.mobile}
            </div>

            <h3 className="text-xl font-bold mb-4">Tests</h3>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Test Name</th>
                        <th className="py-2 px-4 border">Cost</th>
                        <th className="py-2 px-4 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map((test) => (
                        <tr key={test.id}>
                            <td className="py-2 px-4 border">{test.test_name}</td>
                            <td className="py-2 px-4 border">{test.cost}</td>
                            <td className="py-2 px-4 border">{test.paid ? 'Paid' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="text-xl font-bold mt-4">Summary</h3>
            <div className="mb-2">
                <strong>Total Cost:</strong> {totalCost}
            </div>
            <div className="mb-2">
                <strong>Paid:</strong> {totalPaid}
            </div>
            <div className="mb-2">
                <strong>Due:</strong> {totalCost - totalPaid}
            </div>

            <button onClick={() => navigate('/patient-details')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Back</button>
        </div>
    );
};

export default PatientInfo;
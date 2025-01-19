import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Axios instance

const PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/patients');
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch patients.');
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

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
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Gender</th>
                            <th className="py-2 px-4 border">Mobile</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="py-2 px-4 border">{patient.name}</td>
                                <td className="py-2 px-4 border">{patient.gender}</td>
                                <td className="py-2 px-4 border">{patient.mobile}</td>
                                <td className="py-2 px-4 border">
                                    <button
                                        onClick={() => navigate(`/patient-info/${patient.id}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PatientDetails;

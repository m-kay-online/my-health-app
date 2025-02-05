import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../api";

const PatientInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [tests, setTests] = useState([]);
    const [totalCostDue, setTotalCostDue] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await api.get(`/patients/${id}`);
                const { patient: patientData, tests: testsData } = response.data;

                setPatient(patientData);
                setTests(testsData);

                const costDue = testsData
                    .filter((test) => test.Payment_Due === "Yes")
                    .reduce((sum, test) => sum + parseFloat(test.Cost), 0);
                setTotalCostDue(costDue);
            } catch (err) {
                setError("Failed to fetch patient info. Please try again.");
                toast.error("Failed to fetch patient info. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientInfo();
    }, [id]);

    const convertToIST = (utcDateStr) => {
        const utcDate = new Date(utcDateStr);
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);
        return istDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    const generatePDF = async () => {
        setGeneratingPDF(true);
        toast.info("Please wait a few seconds... Generating Preview");
        try {
            const response = await api.get(`/reports/generate-pdf/${id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(url, '_blank');
            toast.success("PDF generated successfully!");
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error generating PDF');
        } finally {
            setGeneratingPDF(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (!window.confirm("Are you sure you want to delete this test?")) return;

        try {
            await api.delete(`/tests/${testId}`);
            const updatedTests = tests.filter((test) => test.Test_ID !== testId);
            setTests(updatedTests);

            const costDue = updatedTests
                .filter((test) => test.Payment_Due === "Yes")
                .reduce((sum, test) => sum + parseFloat(test.Cost), 0);
            setTotalCostDue(costDue);

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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient Info</h2>
            {/* Patient Details */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <p><strong>Patient ID:</strong> {patient.id}</p>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Date of Birth:</strong> {convertToIST(patient.dob)}</p>
                <p><strong>Father's Name:</strong> {patient.father_name}</p>
                <p><strong>Husband's Name:</strong> {patient.husband_name}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Mobile:</strong> {patient.mobile}</p>
            </div>
            {/* Tests Table */}
            <h3 className="text-xl font-bold mb-4 text-gray-800">Tests</h3>
            {tests.length > 0 ? (
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead className="bg-gray-200">
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
                            <tr key={test.Test_ID} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border">{test.Test_ID}</td>
                                <td className="py-2 px-4 border">{test.Tests}</td>
                                <td className="py-2 px-4 border">{test.Cost}</td>
                                <td className="py-2 px-4 border">{test.Test_Performed}</td>
                                <td className="py-2 px-4 border">{test.Payment_Due}</td>
                                <td className="py-2 px-4 border">{test.Department}</td>
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
                <p className="text-white">No tests available for this patient.</p>
            )}
            {/* Total Cost Due */}
            <div className="mt-4 text-white">
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
                className="mt-4 ml-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-green-600"
            >
                Generate PDF
            </button>
            <ToastContainer />
        </div>
    );
};

export default PatientInfo;
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const PatientForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        father_name: '',
        husband_name: '',
        gender: '',
        mobile: '',
    });

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
            await api.post('/patients/patients', formData); // Correct endpoint

            setFormData({
                name: '',
                dob: '',
                father_name: '',
                husband_name: '',
                gender: '',
                mobile: '',
            });

            toast.success('Patient added successfully!');
            
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error('Failed to add patient. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-8 bg-gradient-to-t from-emerald-500 to-sky-600 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
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
                        <option value="">Select</option>
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
                <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Add Patient</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default PatientForm;
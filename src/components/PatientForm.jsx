import React, { useState } from 'react';
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

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

            setError('');
            setSuccess('Patient added successfully!');
            
            if (onSuccess) onSuccess();
        } catch (error) {
            setSuccess('');
            setError('Failed to add patient. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
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
                <div>
                    <label className="block mb-1">Father's Name:</label>
                    <input
                        type="text"
                        name="father_name"
                        value={formData.father_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Husband's Name:</label>
                    <input
                        type="text"
                        name="husband_name"
                        value={formData.husband_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Mobile:</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Patient</button>
            </form>
            {success && <p className="mt-4 text-green-500">{success}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default PatientForm;
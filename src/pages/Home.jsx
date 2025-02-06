import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const [stats, setStats] = useState({
    patients: 0,
    tests: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsResponse = await api.get('/patients');
        const testsResponse = await api.get('/tests');
        const pendingPayments = testsResponse.data.filter(test => test.Payment_Due === 'Yes').length;

        setStats({
          patients: patientsResponse.data.length,
          tests: testsResponse.data.length,
          pendingPayments,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-300 to-cyan-500 to-indigo-600 p-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to the Test Master App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Patients</h2>
          <p className="text-gray-700 text-lg">{stats.patients}</p>
          <Link to="/patient-details" className="text-blue-500 hover:underline">View Details</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Tests</h2>
          <p className="text-gray-700 text-lg">{stats.tests}</p>
          <Link to="/test-master" className="text-blue-500 hover:underline">View Details</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Pending Payments</h2>
          <p className="text-gray-700 text-lg">{stats.pendingPayments}</p>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/new-patient" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Add New Patient</Link>
      </div>
    </div>
  );
};

export default Home;
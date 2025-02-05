import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import TestMaster from './components/TestMaster';
import PatientInfo from './components/PatientInfo';
import Sidebar from './components/Sidebar';
import TestDepartment from './components/TestDepartment';
import PrivateRoute from './components/PrivateRoute';
import { refreshToken } from './api';

const Main = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/' && location.pathname !== '/signup';

    useEffect(() => {
        let timeout;

        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                refreshToken();
            }, 29 * 60 * 1000); // Refresh token 1 minute before it expires
        };

        const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        events.forEach(event => {
            window.addEventListener(event, resetTimeout);
        });

        resetTimeout();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimeout);
            });
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 flex'>
            {showSidebar && <Sidebar />}
            <div className={showSidebar ? 'ml-64 w-full' : 'w-full'}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/new-patient" element={<PrivateRoute><PatientForm onClose={() => window.history.back()} /></PrivateRoute>} />
                    <Route path="/patient-details" element={<PrivateRoute><PatientDetails /></PrivateRoute>} />
                    <Route path="/patient-info/:id" element={<PrivateRoute><PatientInfo /></PrivateRoute>} />
                    <Route path="/test-master" element={<PrivateRoute><TestMaster /></PrivateRoute>} />
                    <Route path="/test-department" element={<PrivateRoute><TestDepartment /></PrivateRoute>} />
                </Routes>
            </div>
        </div>
    );
};

const App = () => (
    <Router>
        <Main />
    </Router>
);

export default App;
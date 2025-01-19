import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import TestMaster from './components/TestMaster';
import PatientInfo from './components/PatientInfo';

const App = () => (
    <div className='h-screen bg-gradient-to-r from-violet-600 to-indigo-600'>
        <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new-patient" element={<PatientForm onClose={() => window.history.back()} />} />
            <Route path="/patient-details" element={<PatientDetails />} />
            <Route path="/patient-info/:id" element={<PatientInfo />} />
            <Route path="/test-master" element={<TestMaster />} />
        </Routes>
    </Router>
    </div>
    
);

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import TestMaster from './components/TestMaster';
import PatientInfo from './components/PatientInfo';
import Sidebar from './components/Sidebar';
import TestDepartment from './components/TestDepartment';

const Main = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/' && location.pathname !== '/signup';

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 flex'>
            {showSidebar && <Sidebar />}
            <div className={showSidebar ? 'ml-64 w-full' : 'w-full'}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/new-patient" element={<PatientForm onClose={() => window.history.back()} />} />
                    <Route path="/patient-details" element={<PatientDetails />} />
                    <Route path="/patient-info/:id" element={<PatientInfo />} />
                    <Route path="/test-master" element={<TestMaster />} />
                    <Route path="/test-department" element={<TestDepartment/>}/>
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
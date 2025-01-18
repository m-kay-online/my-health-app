import { Link } from 'react-router-dom';

const Sidebar = () => (
    <div className="sidebar bg-gray-800 text-white w-64 h-full fixed">
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <nav className="space-y-2">
                <Link to="/new-patient" className="block py-2 px-4 rounded hover:bg-gray-700">New Patient</Link>
                <Link to="/patient-details" className="block py-2 px-4 rounded hover:bg-gray-700">Patient Details</Link>
                <Link to="/test-master" className="block py-2 px-4 rounded hover:bg-gray-700">Test Master</Link>
            </nav>
        </div>
    </div>
);

export default Sidebar;
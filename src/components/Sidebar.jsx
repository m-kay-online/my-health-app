import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="sidebar bg-gray-900 text-white w-64 h-full fixed shadow-lg flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <nav className="space-y-2">
          <Link 
            to="/new-patient" 
            className={`block py-2 px-4 rounded transition duration-300 ${location.pathname === '/new-patient' ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'}`}
          >
            New Patient
          </Link>
          <Link 
            to="/patient-details" 
            className={`block py-2 px-4 rounded transition duration-300 ${location.pathname === '/patient-details' ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'}`}
          >
            Patient Details
          </Link>
          <Link 
            to="/test-master" 
            className={`block py-2 px-4 rounded transition duration-300 ${location.pathname === '/test-master' ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'}`}
          >
            Test Master
          </Link>
          <Link 
            to="/test-department" 
            className={`block py-2 px-4 rounded transition duration-300 ${location.pathname === '/test-department' ? 'bg-gray-700 text-yellow-300' : 'hover:bg-gray-700'}`}
          >
            Test Department
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <button 
          onClick={logout} 
          className="w-full py-2 px-4 bg-blue-950 text-white rounded transition duration-300 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
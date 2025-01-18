// filepath: /D:/Files/File/Work/Codes/Indie Codes/React js/my-health-app/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make API call to backend
      const response = await axios.post('http://localhost:5000/auth/login', {
        username: username,
        password: password
      });

      // Store the JWT in localStorage or cookies
      localStorage.setItem('token', response.data.token);

      // Redirect user to the homepage or dashboard
      navigate('/home');
    } catch (err) {
      setError(err.response ? err.response.data : 'Error logging in');
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <h1 className='text-6xl font-mono mb-4 text-white'>LOGIN</h1> 

      <form className='flex flex-col w-full items-center font-mono text-white text-lg' onSubmit={handleLogin}>
        <div className='m-4 space-x-1'>
          <label className='' htmlFor='usernameInput'>Username : <br/></label>
          <input 
            className='rounded-md w-80 h-8 text-black text-center' 
            placeholder='Enter username here' 
            id='usernameInput'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='mb-4 space-y-1'>
          <label className='' htmlFor='passwordInput'>Password : <br/></label>
          <input 
            type='password' 
            className='rounded-md w-80 h-8 text-black text-center' 
            placeholder='Enter Password here' 
            id='passwordInput'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <div>
          <button type='submit' className='border-2 w-20 h-10 rounded hover:bg-blue-500'>Login</button>
        </div>
      </form>

      <div className='m-5'>
        <button onClick={() => navigate("/signup")} className='text-white border-white bg-gray-800 w-20 h-10 font-mono rounded-md hover:bg-black'>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Login;
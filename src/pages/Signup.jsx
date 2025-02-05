import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}/auth/signup`, {
        username: username,
        password: password
      });

      setSuccess('User created successfully');
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Error creating user');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center bg-gradient-to-r from-green-400 to-blue-500 dark:from-gray-800 dark:to-black'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform hover:scale-105'>
        <h1 className='text-4xl font-bold mb-4 text-center text-gray-800 dark:text-white'>SIGNUP</h1> 

        <form className='flex flex-col' onSubmit={handleSignup}>
          <div className='mb-4'>
            <label className='block text-gray-700 dark:text-gray-300' htmlFor='usernameInput'>Username</label>
            <input 
              className='mt-1 p-2 w-full border rounded-md' 
              placeholder='Enter Username here' 
              id='usernameInput'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 dark:text-gray-300' htmlFor='passwordInput'>Password</label>
            <div className='relative flex items-center'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className='mt-1 p-2 w-full border rounded-md' 
                placeholder='Enter Password here' 
                id='passwordInput'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type='button' 
                className='absolute right-2 top-2 text-gray-600 dark:text-gray-300' 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className='text-red-500 mb-4'>{error}</p>}
          {success && <p className='text-green-500 mb-4'>{success}</p>}
          <button type='submit' className='w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>Signup</button>
        </form>

        <div className='mt-4 text-center'>
          <button onClick={() => navigate('/')} className='text-blue-500 hover:underline'>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
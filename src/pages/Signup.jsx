// filepath: /d:/Files/File/Work/Codes/Indie Codes/React js/my-health-app/src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Make API call to backend
      const response = await axios.post('http://localhost:5000/auth/signup', {
        username: username,
        password: password
      });

      // Handle successful signup
      setSuccess('User created successfully');
      setError('');
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Error creating user');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <h1 className='text-6xl font-mono mb-4 text-white'>SIGNUP</h1> 

      <form className='flex flex-col w-full items-center font-mono text-white text-lg' onSubmit={handleSignup}>
        <div className='m-4 space-x-1'>
          <label className='' htmlFor='usernameInput'>Username : <br/></label>
          <input 
            className='rounded-md w-80 h-8 text-black text-center' 
            placeholder='Enter Username here' 
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
        {success && <p className='text-green-500'>{success}</p>}
        <div>
          <button type='submit' className='border-2 w-20 h-10 rounded hover:bg-blue-500'>Signup</button>
        </div>
      </form>

      <div className='m-5'>
        <button onClick={() => navigate('/')} className='text-white border-white bg-gray-800 w-20 h-10 font-mono rounded-md hover:bg-black'>
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
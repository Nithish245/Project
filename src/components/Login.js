import React, { useState, useContext } from 'react';
import AuthContext from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(username);
    navigate('/');
  };

  return (
    <div className='login'>
    <div className='login-page'>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
    </div>
  );
};

export default Login;

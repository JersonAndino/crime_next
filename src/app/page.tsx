// import { redirect } from "next/navigation";

// export default function Home() {
//   redirect('/mapa');
//   return null;
// }

// pages/index.tsx

"use client"
import { useState } from 'react';
import axios from 'axios';
import { environment } from '@/environments/environment';

const Home = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(environment.backendUrl+'/auth/create-user/', formData);
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(environment.backendUrl+'/auth/login/', {
        username: formData.username,
        password: formData.password,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(environment.backendUrl+'/auth/forgot-password/', { email: formData.email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(environment.backendUrl+'/auth/logout/');
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      <div>
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <button onClick={handleRegister}>Register</button>
      </div>

      <div>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h2>Forgot Password</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <button onClick={handleForgotPassword}>Reset Password</button>
      </div>

      <div>
        <h2>Logout</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Home;
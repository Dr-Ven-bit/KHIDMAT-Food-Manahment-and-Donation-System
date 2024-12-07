// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/background.jpg';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', cnic: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    alert('Form is being submitted');
    try {
      // Send email, role, cnic, and newPassword
      const response = await axios.post('http://localhost:5000/auth/forgot-password', {
        email: formData.email,
        cnic: formData.cnic,
      });
      console.log(response.data)
      const { token, role } = response.data;
      // // Save token to localStorage
      // localStorage.setItem('token', token);
      // localStorage.setItem('role', user.role);
      console.log("token", token);
      console.log("role is", role);
      console.log('Email are:', formData.email);  // Should log the correct email
      // console.log('Role:', formData.role);     // Should log the correct role
      console.log('password',formData.newPassword)

      // Navigate to OTP verification page with email and role
      navigate('/verify-otp', { state: { email: formData.email, role: role, newPassword:formData.newPassword, cnic:formData.cnic } });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to initiate password reset');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-md  w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#111111] mb-6">Forgot Password</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]"
          />
          <input
            name="cnic"
            type="text"
            placeholder="CNIC"
            
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            // onChange={handleInputChange}
            onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                e.target.value = value;
              handleInputChange({ target: { name: 'cnic', value } });  // Update the form data with the limited value
            }}
            onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
            // onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#5cccf1] text-[#111111] rounded-md hover:bg-[#48b4dc] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5cccf1]"
          >
            Confirm Passward
          </button>
        </form>
        <a href="/login" className="text-[#5cccf1] hover:underline ml-2 transition duration-200 ease-in-out">
          I have already account?
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;

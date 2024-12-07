// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../assets/images/background.jpg';

const LoginPage = () => {
    const [cnic, setCnic] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous error

        try {
            // Call the backend API to log in
            const response = await axios.post('http://localhost:5000/auth/login', { cnic: cnic, password });

            const { token, user } = response.data;

            // Save token to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            const role = user.role.toLowerCase(); // Convert to lowercase to match backend roles

            switch (role) {
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'coordinator':
                    navigate('/coordinator-dashboard');
                    break;
                case 'foodprovider':
                    navigate('/foodprovider-dashboard');
                    break;
                case 'sponsor':
                    navigate('/sponsor-dashboard');
                    break;
                case 'volunteer':
                    navigate('/volunteer-dashboard');
                    break;
                default:
                    setError('Invalid role');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center text-[#111111] mb-6">Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* <input
                        type="text"
                        placeholder="CNIC"
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value.replace(/\D/g, ''))} // Remove non-numeric characters
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" // Input styling
                    /> */}
                    <input
                        type="number"
                        // name="cnic"
                        placeholder="CNIC without Dash"
                        value={cnic}
                        
                        onKeyDown={(e) => {
                            // Allow only numeric input and Backspace/Tab keys
                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                                // e.preventDefault();
                            }
                        }}
                        onPaste={(e) => {
                            // Validate pasted data
                            let pastedData = e.clipboardData.getData('text');
                            if (!/^\d{1,13}$/.test(pastedData)) {
                                // e.preventDefault(); // Prevent if pasted data is not numeric or exceeds 13 digits
                            }
                        }}
                        onChange={(e) => {
                            // Get the input value, remove non-numeric characters, and limit to 13 digits
                            let value = e.target.value.replace(/\D/g, '').slice(0, 13); // Keep only digits and limit to 13
                            setCnic(value); // Update state
                        }}
                        // onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
                        required
                        inputMode="numeric"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" // Input styling
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" // Input styling
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#5cccf1] text-[#111111] rounded-md hover:bg-[#48b4dc] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5cccf1]" // Button color and hover effect
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <a href="/forgot-password" className="text-[#5cccf1] hover:underline transition duration-200 ease-in-out">
                        Forgot Password?
                    </a>
                    <br />
                    <a href="/register" className="text-[#5cccf1] hover:underline ml-2 transition duration-200 ease-in-out">
                        Create a khidmat Account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        cnic: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/reset-password', formData);
            if (response.data.message) {
                // Redirect to OTP verification page
                window.location.href = '/otp-verification';
            }
        } catch (error) {
            console.error(error);
            alert('Password reset failed.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="cnic"
                    placeholder="CNIC"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;

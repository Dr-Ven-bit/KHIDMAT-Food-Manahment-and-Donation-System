import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure state from location
    const { email, role, newPassword, cnic } = location.state || {};

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the request body for OTP verification
            const requestBody = { email, role, otp };

            // Add optional fields for password reset scenario
            if (newPassword && cnic) {
                requestBody.newPassword = newPassword;
                requestBody.cnic = cnic;
            }

            const response = await axios.post('http://localhost:5000/auth/verify-otp', requestBody);

            console.log('OTP Verified:', response.data);
            navigate('/login');  // Redirect after successful OTP verification
        } catch (error) {
            setError(error.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#5cccf1] text-[#111111] rounded-md hover:bg-[#48b4dc] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5cccf1]"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const OTPVerificationPage = () => {
//     const [otp, setOtp] = useState('');
//     const navigate = useNavigate();

//     const handleVerifyOTP = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:5000/auth/verify-otp', { otp });
//             alert('OTP verified successfully');
//             // Store new token received after successful OTP verification (optional)
//             localStorage.setItem('token', response.data.token);
//             navigate('/reset-password');  // Redirect to reset password page or login page
//         } catch (error) {
//             console.error('OTP verification failed:', error);
//             alert('OTP verification failed: ' + (error.response?.data?.message || 'An error occurred'));
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
//                 <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">OTP Verification</h1>
//                 <form onSubmit={handleVerifyOTP} className="space-y-4">
//                     <input
//                         type="text"
//                         placeholder="OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                     />
//                     <button
//                         type="submit"
//                         className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//                     >
//                         Verify OTP
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default OTPVerificationPage;

// import React, { useState } from 'react';
// import axios from 'axios';

// const VerifyOTP = () => {
//     const [otp, setOtp] = useState('');
//     const [error, setError] = useState('');

//     const handleOtpChange = (e) => {
//         setOtp(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         console.log(token);
//         try {
//             const response = await axios.patch('http://localhost:5000/auth/verifyEmail', { otp }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             alert('Email verified successfully');
//             // Redirect after successful verification
//             window.location.href = '/login';
//         } catch (error) {
//             setError(error.response.data.message || 'Verification failed');
//         }
//     };

//     return (
//         <div>
//             <h2>Enter OTP</h2>
//             <form onSubmit={handleSubmit}>
//                 <input name="otp" placeholder="OTP" value={otp} onChange={handleOtpChange} required />
//                 <button type="submit">Verify</button>
//             </form>
//             {error && <p>{error}</p>}
//         </div>
//     );
// };

// export default VerifyOTP;

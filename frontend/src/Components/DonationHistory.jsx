import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '../assets/deleteicon.png';

const DonationHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [showProfile, setShowProfile] = useState(false); // Profile visibility state
    const [SponsorDetails, setSponsorDetails] = useState({
        name: '',
        fatherName: '',
        cnic: '',
        role: '',
        email: ''  // Initialize email to prevent undefined error
    });


    // Check if user is authenticated on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        } else {
            fetchHistory(token);  // Fetch donation history using the valid token
        }
    }, [navigate]);
    const fetchHistory = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/sponsor/donation-history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching donation history:', error);
        }
    };

    useEffect(() => {
        if (showProfile) {
            fetchSponsorDetails();
        }
    }, [showProfile]);

    const fetchSponsorDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/sponsor/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSponsorDetails(response.data.sponsor);  // Access the 'coordinator' object from the response
            console.log(response.data.sponsor);
        } catch (error) {
            console.error('Error fetching Sponsor details:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <button
                className="bg-[#5cccf1] hover:bg-[#45b8db] transition-all text-white mb-5 px-4 py-2 rounded-md absolute top-5 right-5 shadow-md"
                onClick={toggleProfile}
            >
                {showProfile ? 'Close Profile' : 'View Profile'}
            </button>

            {/* Profile Popup */}
            {showProfile && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 px-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-lg max-h-screen overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                            onClick={toggleProfile}
                        >
                            <img className="w-10 h-10" src={DeleteIcon} alt="Close Profile" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Coordinator Profile</h2>
                        <p><strong>Name:</strong> {SponsorDetails?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {SponsorDetails?.email || 'N/A'}</p>
                        <p><strong>CNIC:</strong> {SponsorDetails?.cnic || 'N/A'}</p>
                        <p><strong>Role:</strong> {SponsorDetails?.role || 'N/A'}</p>
                        {/* Logout Button Inside Popup */}
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded mt-4 shadow-lg"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Donation History</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Sponsor Name</th>
                        <th className="border px-4 py-2">Account Title</th>
                        <th className="border px-4 py-2">Account Type</th>
                        <th className="border px-4 py-2">Amount</th>
                        <th className="border px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <tr key={item._id}>
                                <td className="border px-4 py-2">
                                    {item?.sponsor?.name || 'No sponsor name'}
                                </td>
                                <td className="border px-4 py-2">{item.transferName || 'N/A'}</td>
                                <td className="border px-4 py-2">{item.accountType || 'N/A'}</td>
                                <td className="border px-4 py-2">{item.amount || 'N/A'}</td>
                                <td className="border px-4 py-2 text-blue-500">{item.status || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border px-4 py-2 text-center">
                                No donation history found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default DonationHistory;

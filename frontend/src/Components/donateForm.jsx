import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '../assets/deleteicon.png';

const Donate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: '',
        accountType: '',
        transferName: '',
        donorPhoneNumber: '',
        screenshot: null,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [accountDetails, setAccountDetails] = useState('select bank');
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
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, screenshot: e.target.files[0] });
    };

    const handleAccountTypeChange = (e) => {
        const selectedAccount = e.target.value;
        setFormData({ ...formData, accountType: selectedAccount });

        if (selectedAccount === 'jazzcash') {
            setAccountDetails('Account Name: tayyab | Account No: 03034037524');
        } else if (selectedAccount === 'easypaisa') {
            setAccountDetails('Account Name: EasyPaisa | Account No: 0987654321');
        } else if (selectedAccount === 'meezan') {
            setAccountDetails('Account Name: Meezan Bank | Account No: 1122334455');
        }
        else {
            setAccountDetails(null); // Hide details if no selection or default
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setAlertMessage('Please log in to submit donation.');
            setIsSuccess(false);
            setShowAlert(true);
            return;
        }

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]);
        });

        try {
            await axios.post('http://localhost:5000/sponsor/donate', formDataObj, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAlertMessage('Donation submitted successfully');
            setIsSuccess(true);
            setShowAlert(true);
        } catch (error) {
            setAlertMessage('Error submitting donation. Please try again.');
            setIsSuccess(false);
            setShowAlert(true);
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
    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     navigate('/login');
    // };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
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
            <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="Number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount in PKR"
                    className="mb-4 p-2 w-full border border-gray-300 rounded"
                />

                <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleAccountTypeChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="" disabled>Select Bank</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="meezan">Meezan Bank</option>
                </select>
                {accountDetails && (
                    <p className="text-blue-600 text-sm font-bold">{accountDetails}</p>
                )}
                <input
                    type="text"
                    onChange={(e) => {
                        let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                        e.target.value = value; // Explicitly update the input's value in the UI
                        handleChange({ target: { name: 'transferName', value } });  // Update the form data with the limited value
                    }}
                    name="transferName"
                    value={formData.transferName}
                    // onChange={handleChange}
                    placeholder="Account Sender Title Name"
                    className="mb-4 p-2 w-full border border-gray-300 rounded"
                />
                <input
                    type="Number"
                    name="donorPhoneNumber"
                    value={formData.donorPhoneNumber}
                    // onChange={handleChange}
                    onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                        e.target.value = value;
                        handleChange({ target: { name: 'donorPhoneNumber', value } });  // Update the form data with the limited value
                    }}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 11)}

                    placeholder="Account Sender  Phone Number"
                    className="mb-4 p-2 w-full border border-gray-300 rounded"
                />
                <input
                    type="file"
                    name="screenshot"
                    onChange={handleFileChange}
                    className="mb-4 p-2 w-full border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-700"
                >
                    Submit Donation
                </button>
            </form>

            {showAlert && (
                <div
                    className={`mt-4 p-2 w-full ${isSuccess ? 'bg-green-200' : 'bg-red-200'
                        }`}
                >
                    {alertMessage}
                </div>
            )}

            {/* <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white p-2 w-full rounded hover:bg-red-700"
            >
                Logout
            </button> */}
        </div>
    );
};

export default Donate;



// // DonateForm.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const DonateForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         cnic: '',
//         phoneNumber: '',
//         amount: '',
//         accountType: 'jazzcash', // default selection
//         transferName: '',
//         screenshot: null,
//     });
// const [accountDetails, setAccountDetails] = useState('');

//     const handleInputChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleFileChange = (e) => {
//         setFormData({
//             ...formData,
//             screenshot: e.target.files[0],
//         });
//     };

// const handleAccountTypeChange = (e) => {
//     const selectedAccount = e.target.value;
//     setFormData({ ...formData, accountType: selectedAccount });

//     if (selectedAccount === 'jazzcash') {
//         setAccountDetails('Account Name: JazzCash | Account No: 1234567890');
//     } else if (selectedAccount === 'easypaisa') {
//         setAccountDetails('Account Name: EasyPaisa | Account No: 0987654321');
//     } else if (selectedAccount === 'meezan') {
//         setAccountDetails('Account Name: Meezan Bank | Account No: 1122334455');
//     }
// };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         for (const key in formData) {
//             formDataToSend.append(key, formData[key]);
//         }

//         try {
//             await axios.post('http://localhost:5000/api/donate', formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             alert('Donation submitted successfully!');
//         } catch (error) {
//             console.error(error);
//             alert('Failed to submit donation');
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">Donate Now</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Donor Name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="cnic"
//                     placeholder="CNIC"
//                     value={formData.cnic}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="phoneNumber"
//                     placeholder="Phone Number"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
//                 <input
//                     type="number"
//                     name="amount"
//                     placeholder="Payment Amount"
//                     value={formData.amount}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="transferName"
//                     placeholder="Account Sender Title Name"
//                     value={formData.transferName}
//                     onChange={handleInputChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
// <select
//     name="accountType"
//     value={formData.accountType}
//     onChange={handleAccountTypeChange}
//     className="w-full border p-2 rounded"
//     required
// >
//     <option value="jazzcash">JazzCash</option>
//     <option value="easypaisa">EasyPaisa</option>
//     <option value="meezan">Meezan Bank</option>
// </select>
// {accountDetails && (
//     <p className="text-gray-600 text-sm">{accountDetails}</p>
// )}
//                 <input
//                     type="file"
//                     name="screenshot"
//                     onChange={handleFileChange}
//                     className="w-full border p-2 rounded"
//                     required
//                 />
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 text-white p-2 rounded"
//                 >
//                     Submit Donation
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default DonateForm;

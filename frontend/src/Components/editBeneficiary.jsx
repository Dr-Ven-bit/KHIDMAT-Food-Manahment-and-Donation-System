import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '../assets/deleteicon.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';
import AdminIcon from '../assets/logo.png';

const EditBeneficiary = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [editedBeneficiary, setEditedBeneficiary] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false); // Profile visibility state
    const [VolunteerDetails, setVolunteerDetails] = useState({
        name: '',
        fatherName: '',
        cnic: '',
        role: '',
        email: ''  // Initialize email to prevent undefined error
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/volunteer/edit', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBeneficiaries(response.data);
            } catch (error) {
                console.error('Error fetching beneficiaries:', error);
            }
        };
        fetchBeneficiaries();
    }, []);

    const handleEditChange = (e) => {
        setEditedBeneficiary({ ...editedBeneficiary, [e.target.name]: e.target.value });
    };

    const handleEditClick = (beneficiary) => {
        setEditedBeneficiary(beneficiary);
        setIsModalOpen(true);
    };

    const handleUpdateClick = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/volunteer/${editedBeneficiary._id}`, editedBeneficiary, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBeneficiaries(beneficiaries.map(b => (b._id === editedBeneficiary._id ? response.data : b)));
            setAlertMessage('Beneficiary updated successfully!');
            setIsSuccess(true);
            setEditedBeneficiary(null);
        } catch (error) {
            setAlertMessage('Failed to update beneficiary');
            setIsSuccess(false);
        } finally {
            setShowAlert(true);
            setIsModalOpen(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (window.confirm('Are you sure you want to finalize the submission? Once submitted, you will not be able to edit any of these beneficiaries.')) {
            try {
                const updatedBeneficiaries = beneficiaries.map(b => ({ ...b, isChecked: true }));

                await Promise.all(
                    updatedBeneficiaries.map(b =>
                        axios.put(`http://localhost:5000/volunteer/${b._id}`, b, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                    )
                );

                alert('List submitted successfully!');
                setBeneficiaries(updatedBeneficiaries.filter(b => !b.isChecked));
                setEditedBeneficiary(null);
            } catch (error) {
                console.error('Error submitting beneficiaries:', error);
            }
        }
    };

    // Fetch coordinator details when showProfile is true
    useEffect(() => {
        if (showProfile) {
            fetchVolunteerDetails();
        }
    }, [showProfile]);


    const handleDeleteClick = async () => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            try {
                await axios.delete(`http://localhost:5000/volunteer/beneficiary/${editedBeneficiary._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBeneficiaries(beneficiaries.filter(b => b._id !== editedBeneficiary._id));
                setAlertMessage('Beneficiary deleted successfully!');
                setIsSuccess(true);
            } catch (error) {
                setAlertMessage('Failed to delete beneficiary');
                setIsSuccess(false);
            } finally {
                setShowAlert(true);
                setIsModalOpen(false);
            }
        }
    };

    const fetchVolunteerDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/volunteer/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVolunteerDetails(response.data.volunteer);  // Access the 'coordinator' object from the response
            console.log(response.data.volunteer);
        } catch (error) {
            console.error('Error fetching Coordinator details:', error);
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Logout Button */}
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
                        <p><strong>Name:</strong> {VolunteerDetails?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {VolunteerDetails?.email || 'N/A'}</p>
                        <p><strong>CNIC:</strong> {VolunteerDetails?.cnic || 'N/A'}</p>
                        <p><strong>Role:</strong> {VolunteerDetails?.role || 'N/A'}</p>
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
            {/* Sidebar */}
            <aside className="w-64 bg-[#000000] text-white min-h-screen shadow-md flex-shrink-0">
                <div className="px-4 py-4">
                    <img className='w-22' src={AdminIcon} alt="Admin Icon" />
                    <h1 className="text-2xl font-bold">Volunteer Panel</h1>
                </div>
                <p className='text-base pl-4 font-bold'><strong>Menu</strong></p>

                <nav className="px-4">
                    <ul>
                        <li className="mb-3">
                            <Link
                                to="/volunteer-dashboard"
                                className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/volunteer-dashboard'
                                    ? 'bg-white text-black'
                                    : 'hover:bg-[#5cccf1] hover:text-white'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/volunteer/edit-beneficiary"
                                className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/volunteer/edit-beneficiary'
                                    ? 'bg-white text-black'
                                    : 'hover:bg-[#5cccf1] hover:text-white'
                                    }`}
                            >
                                Edit Beneficiary
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/volunteer/collect-food"
                                className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/volunteer/collect-food'
                                    ? 'bg-white text-black'
                                    : 'hover:bg-[#5cccf1] hover:text-white'
                                    }`}
                            >
                                Collect Food
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/volunteer/distribute-to-beneficiary"
                                className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/volunteer/distribute-to-beneficiary'
                                    ? 'bg-white text-black'
                                    : 'hover:bg-[#5cccf1] hover:text-white'
                                    }`}
                            >
                                Food Deliveries to Beneficiary
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10">
                <h2 className="text-3xl font-bold mb-6">Edit Beneficiary</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Father Name</th>
                            <th className="py-2 px-4">CNIC</th>
                            <th className="py-2 px-4">Phone Number</th>
                            <th className="py-2 px-4">Family Income</th>
                            <th className="py-2 px-4">Family Size</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beneficiaries.map(beneficiary => (
                            <tr key={beneficiary._id} className="hover:bg-gray-100 transition">
                                <td className="py-2 px-4 text-center">{beneficiary.name}</td>
                                <td className="py-2 px-4 text-center">{beneficiary.fatherName}</td>
                                <td className="py-2 px-4 text-center">{beneficiary.cnic}</td>
                                <td className="py-2 px-4 text-center">{beneficiary.phoneNumber}</td>
                                <td className="py-2 px-4 text-center">{beneficiary.familyIncome}</td>
                                <td className="py-2 px-4 text-center">{beneficiary.familySize}</td>
                                <td className="py-2 px-4 text-center">
                                    <button
                                        onClick={() => handleEditClick(beneficiary)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded transition-transform hover:scale-105"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Editing Beneficiary */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-90">
                            <h2 className="text-2xl font-bold mb-4">Edit Beneficiary</h2>
                            {['name', 'fatherName', 'cnic', 'phoneNumber', 'familySize','familyIncome'].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label className="block text-sm font-bold capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
                                    {/* <input
                                        type="text"
                                        name={field}
                                        value={editedBeneficiary[field]}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    /> */}


                                    {(field === 'name' || field === 'fatherName') && (
                                        <input
                                            type="text"
                                            name={field}
                                            value={editedBeneficiary[field]}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphabet characters
                                                handleEditChange({ target: { name: field, value } });
                                            }}
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}

                                    {/* CNIC - Numeric only, 13 digits */}
                                    {field === 'cnic' && (
                                        <input
                                            type="text"
                                            name="cnic"
                                            value={editedBeneficiary.cnic}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 13); // Numeric only, limit to 13 digits
                                                handleEditChange({ target: { name: 'cnic', value } });
                                            }}
                                            maxLength="13"
                                            minLength="13"
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}

                                    {/* Phone Number & Family Income - Numeric only, 11 digits */}
                                    {(field === 'phoneNumber') && (
                                        <input
                                            type="text"
                                            name={field}
                                            value={editedBeneficiary[field]}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 11); // Numeric only, limit to 11 digits
                                                handleEditChange({ target: { name: field, value } });
                                            }}
                                            maxLength="11"
                                            minLength="11"
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}

                                    {/* Address - Allows both alphabets and numbers */}
                                    {field === 'address' && (
                                        <input
                                            type="text"
                                            name="address"
                                            value={editedBeneficiary.address}
                                            onChange={handleEditChange} // No special validation required for address
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}

                                    {/* Family Size - Numeric only, max 19 */}
                                    {field === 'familySize' && (
                                        <input
                                            type="text"
                                            name="familySize"
                                            value={editedBeneficiary.familySize}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Numeric only
                                                if (parseInt(value) <= 19 || value === '') { // Ensure value is <= 19
                                                    handleEditChange({ target: { name: 'familySize', value } });
                                                }
                                            }}
                                            maxLength="2"
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}
                                    {field === 'familyIncome' && (
                                        <input
                                            type="text"
                                            name="familyIncome"
                                            value={editedBeneficiary.familyIncome}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Numeric only
                                                if (parseInt(value) <= 99999 || value === '') { // Ensure value is <= 19
                                                    handleEditChange({ target: { name: 'familyIncome', value } });
                                                }
                                            }}
                                            maxLength="5"
                                            required
                                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                                    onClick={handleDeleteClick}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                                    onClick={handleUpdateClick}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alert Popup */}
                {showAlert && (
                    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
                        <div className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="mb-4">
                                <img
                                    src={isSuccess ? SuccessIcon : FailureIcon}
                                    alt={isSuccess ? "Success" : "Failure"}
                                    className="mx-auto mb-2 w-16 h-16"
                                />
                                <p>{alertMessage}</p>
                            </div>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                onClick={() => setShowAlert(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded-md transition-transform hover:scale-105 hover:bg-green-600"
                        onClick={handleFinalSubmit}
                    >
                        Final Submit
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EditBeneficiary;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import SuccessIcon from '../assets/successicon.png';
// import FailureIcon from '../assets/Failedicon.png';
// import AdminIcon from '../assets/admin.png';

// const EditBeneficiary = () => {
//     const [beneficiaries, setBeneficiaries] = useState([]);
//     const [editedBeneficiary, setEditedBeneficiary] = useState(null);
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const fetchBeneficiaries = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/volunteer/edit', {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });
//                 setBeneficiaries(response.data);
//             } catch (error) {
//                 console.error('Error fetching beneficiaries:', error);
//             }
//         };
//         fetchBeneficiaries();
//     }, []);

//     const handleEditChange = (e) => {
//         setEditedBeneficiary({ ...editedBeneficiary, [e.target.name]: e.target.value });
//     };

//     const handleEditClick = (beneficiary) => {
//         setEditedBeneficiary(beneficiary);
//         setIsModalOpen(true);
//     };

//     const handleUpdateClick = async () => {
//         try {
//             const response = await axios.put(`http://localhost:5000/volunteer/${editedBeneficiary._id}`, editedBeneficiary, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             setBeneficiaries(beneficiaries.map(b => (b._id === editedBeneficiary._id ? response.data : b)));
//             setAlertMessage('Beneficiary updated successfully!');
//             setIsSuccess(true);
//             setEditedBeneficiary(null);
//         } catch (error) {
//             setAlertMessage('Failed to update beneficiary');
//             setIsSuccess(false);
//         } finally {
//             setShowAlert(true);
//             setIsModalOpen(false);
//         }
//     };

//     const handleFinalSubmit = async () => {
//         if (window.confirm('Are you sure you want to finalize the submission? Once submitted, you will not be able to edit any of these beneficiaries.')) {
//             try {
//                 const updatedBeneficiaries = beneficiaries.map(b => ({ ...b, isChecked: true }));

//                 await Promise.all(
//                     updatedBeneficiaries.map(b =>
//                         axios.put(`http://localhost:5000/volunteer/${b._id}`, b, {
//                             headers: {
//                                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//                             }
//                         })
//                     )
//                 );

//                 alert('List submitted successfully!');
//                 setBeneficiaries(updatedBeneficiaries.filter(b => !b.isChecked));
//                 setEditedBeneficiary(null);
//             } catch (error) {
//                 console.error('Error submitting beneficiaries:', error);
//             }
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/login');
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 relative">
//             <button
//                 className="bg-slate-400 text-white mb-5 px-2 rounded-md absolute top-0 right-0"
//                 onClick={handleLogout}
//             >
//                 Logout
//             </button>
//             <div className="flex">
//                 <aside className="w-64 bg-gray-800 text-white min-h-screen">
//                     <div className="px-10 py-5">
//                         <img className="px-8" src={AdminIcon} alt="Admin" />
//                         <h1 className="text-xl  text-center font-bold text-white mt-2">Volunteer Panel</h1>
//                     </div>
//                     <nav className="p-4">
//                         <ul>
//                             <li className="mb-2">
//                                 <p className="text-sm mb-1">Menu</p>
//                                 <Link
//                                     to="/volunteer-dashboard"
//                                     className={`flex items-center p-2 rounded ${location.pathname === '/volunteer-dashboard' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                                 >
//                                     <span className="ml-2">Dashboard</span>
//                                 </Link>
//                                 <Link
//                                     to="/volunteer/edit-beneficiary"
//                                     className={`flex items-center p-2 rounded ${location.pathname === '/volunteer/edit-beneficiary' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                                 >
//                                     <span className="ml-2">Edit Beneficiary</span>
//                                 </Link>
//                                 <Link
//                                     to="/volunteer/collect-food"
//                                     className={`flex items-center p-2 rounded ${location.pathname === '/volunteer/collect-food' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                                 >
//                                     <span className="ml-2">Collect Food</span>
//                                 </Link>
//                             </li>
//                         </ul>
//                     </nav>
//                 </aside>
//                 <main className="flex-1 p-8">
//                     <h2 className="text-2xl font-bold mb-6">Edit Beneficiary</h2>
//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead className="bg-black text-white">
//                             <tr>
//                                 <th className="py-2 px-4 border-b">Name</th>
//                                 <th className="py-2 px-4 border-b">Father Name</th>
//                                 <th className="py-2 px-4 border-b">CNIC</th>
//                                 <th className="py-2 px-4 border-b">Phone Number</th>
//                                 <th className="py-2 px-4 border-b">Family Size</th>
//                                 <th className="py-2 px-4 border-b">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {beneficiaries.map(beneficiary => (
//                                 <tr key={beneficiary._id} className="hover:bg-gray-100">
//                                     <td className="py-2 px-4 border-b text-center">{beneficiary.name}</td>
//                                     <td className="py-2 px-4 border-b text-center">{beneficiary.fatherName}</td>
//                                     <td className="py-2 px-4 border-b text-center">{beneficiary.cnic}</td>
//                                     <td className="py-2 px-4 border-b text-center">{beneficiary.phoneNumber}</td>
//                                     <td className="py-2 px-4 border-b text-center">{beneficiary.familySize}</td>
//                                     <td className="py-2 px-4 border-b text-center">
//                                         <button
//                                             onClick={() => handleEditClick(beneficiary)}
//                                             className="bg-blue-500 text-white py-1 px-3 rounded"
//                                         >
//                                             Edit
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {isModalOpen && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                             <div className="bg-white p-8 rounded shadow-md w-96">
//                                 <h2 className="text-2xl mb-4">Edit Beneficiary</h2>
//                                 <label className="block text-sm font-medium mb-2">Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={editedBeneficiary.name}
//                                     onChange={handleEditChange}
//                                     className="border border-gray-300 p-2 w-full mb-4 rounded"
//                                 />
//                                 <label className="block text-sm font-medium mb-2">Father Name</label>
//                                 <input
//                                     type="text"
//                                     name="fatherName"
//                                     value={editedBeneficiary.fatherName}
//                                     onChange={handleEditChange}
//                                     className="border border-gray-300 p-2 w-full mb-4 rounded"
//                                 />
//                                 <label className="block text-sm font-medium mb-2">CNIC</label>
//                                 <input
//                                     type="text"
//                                     name="cnic"
//                                     value={editedBeneficiary.cnic}
//                                     onChange={handleEditChange}
//                                     className="border border-gray-300 p-2 w-full mb-4 rounded"
//                                 />
//                                 <label className="block text-sm font-medium mb-2">Phone Number</label>
//                                 <input
//                                     type="text"
//                                     name="phoneNumber"
//                                     value={editedBeneficiary.phoneNumber}
//                                     onChange={handleEditChange}
//                                     className="border border-gray-300 p-2 w-full mb-4 rounded"
//                                 />
//                                 <label className="block text-sm font-medium mb-2">Family Size</label>
//                                 <input
//                                     type="number"
//                                     name="familySize"
//                                     value={editedBeneficiary.familySize}
//                                     onChange={handleEditChange}
//                                     className="border border-gray-300 p-2 w-full mb-4 rounded"
//                                 />
//                                 <div className="flex justify-end space-x-2">
//                                     <button
//                                         className="bg-gray-500 text-white py-2 px-4 rounded"
//                                         onClick={() => setIsModalOpen(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         className="bg-blue-500 text-white py-2 px-4 rounded"
//                                         onClick={handleUpdateClick}
//                                     >
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                     {showAlert && (
//                         <div className={`alert ${isSuccess ? 'alert-success' : 'alert-failure'} mt-4`} role="alert">
//                             <span>{alertMessage}</span>
//                             <img src={isSuccess ? SuccessIcon : FailureIcon} alt="status icon" />
//                         </div>
//                     )}
//                     <div className="mt-4 flex justify-end">
//                         <button
//                             className="bg-green-500 text-white py-2 px-4 rounded"
//                             onClick={handleFinalSubmit}
//                         >
//                             Final Submit
//                         </button>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default EditBeneficiary;

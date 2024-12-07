import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png';
import DeleteIcon from '../assets/deleteicon.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const FoodProviderDashboard = () => {
    const [foodProviders, setFoodProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [showEditButton, setShowEditButton] = useState(false);
    const [showProfile, setShowProfile] = useState(false); // Profile visibility state
    const [adminDetails, setAdminDetails] = useState({
        name: '',
        fatherName: '',
        cnic: '',
        role: ''
    });


    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchFoodProviders();
        }
    }, []);

    useEffect(() => {
        setFilteredProviders(
            foodProviders.filter(provider =>
                provider.cnic.includes(searchTerm) ||
                provider.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, foodProviders]);

    const fetchFoodProviders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin/food-providers/unverified', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFoodProviders(response.data);
        } catch (error) {
            console.error('Error fetching food providers:', error);
            setFoodProviders([]);
        }
    };

    const handleCheckProvider = (provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
        setShowEditButton(false);  // Ensure that it's not in edit mode
    };

    const handleVerifyProvider = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/admin/food-providers/verify/${selectedProvider._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlertMessage('Provider verified successfully');
            setIsSuccess(true);
            setShowEditButton(true);
            fetchFoodProviders();
        } catch (error) {
            console.error('Error verifying provider:', error);
            setAlertMessage('Failed to verify provider. Please try again.');
            setIsSuccess(false);
        } finally {
            setShowAlert(true);
            setIsModalOpen(false);
        }
    };

    const handleRejectProvider = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/admin/food-providers/remove/${selectedProvider._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlertMessage('Provider removed successfully');
            setIsSuccess(true);
            fetchFoodProviders();
        } catch (error) {
            console.error('Error removing provider:', error);
            setAlertMessage('Failed to remove provider. Please try again.');
            setIsSuccess(false);
        } finally {
            setShowAlert(true);
            setIsModalOpen(false);
        }
    };

    const handleEditProvider = (provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
        setShowEditButton(true);  // Set to edit mode
    };

    const handleSaveProvider = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/admin/food-providers/update/${selectedProvider._id}`, selectedProvider, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlertMessage('Provider details updated successfully');
            setIsSuccess(true);
            fetchFoodProviders();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating provider:', error);
            setAlertMessage('Failed to update provider. Please try again.');
            setIsSuccess(false);
        } finally {
            setShowAlert(true);
        }
    };

    const fetchAdminDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdminDetails(response.data.admin);  // Access the 'admin' object from the response
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };

    useEffect(() => {
        if (showProfile) {
            fetchAdminDetails();  // Fetch admin details only when the profile is toggled open
        }
    }, [showProfile]);  // Dependency array with `showProfile`




    // Moved handleLogout outside of handleSaveProvider
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className="min-h-screen bg-white text-[#111111] relative">
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
                            className="absolute top-4 right-4 w-8 h-8  rounded-full flex items-center justify-center"
                            onClick={toggleProfile}
                        >
                            <img className="w-10 h-10 " src={DeleteIcon} alt="Close Profile" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
                        <p><strong>Name:</strong> {adminDetails.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {adminDetails.email || 'N/A'}</p>
                        <p><strong>CNIC:</strong> {adminDetails.cnic || 'N/A'}</p>
                        <p><strong>Role:</strong> {adminDetails.role || 'N/A'}</p>
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
            <div className="flex">
                <aside className="w-64 bg-[#000000] text-[#ffffff] min-h-screen shadow-md">
                    <div className="px-4 py-4">
                        <img className='w-22' src={AdminIcon} alt="Admin Icon" />

                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                    </div>
                    <p className='text-base pl-4 font-bold'><strong>Menu</strong></p>

                    <nav className="px-4">
                        <ul>
                            <li className="mb-3">
                                <Link
                                    to="/admin-dashboard"
                                    className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/admin-dashboard'
                                        ? 'bg-slate-50 text-black'
                                        : 'hover:bg-[#5cccf1] hover:text-white'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="mb-3">
                                <Link
                                    to="/admin/verify-food-provider"
                                    className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/admin/verify-food-provider'
                                        ? 'bg-white text-black'
                                        : 'hover:bg-[#5cccf1] hover:text-white'
                                        }`}
                                >
                                    Verify Food Provider
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/check-payments"
                                    className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/admin/check-payments'
                                        ? 'bg-white text-black'
                                        : 'hover:bg-[#5cccf1] hover:text-white'
                                        }`}
                                >
                                    Check Payments
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-10">
                    <h1 className="text-2xl font-bold">Food Providers Listing</h1>
                    <input
                        type="text"
                        placeholder="Search by CNIC, Area or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg my-6 shadow-sm"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-[#000000] text-white">
                                    <th className="py-2 px-4 text-left">Sr.No</th>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">CNIC</th>
                                    <th className="py-2 px-4 text-left">Phone Number</th>
                                    <th className="py-2 px-4 text-left">Restorant Name</th>
                                    <th className="py-2 px-4 text-left">Restorant Address</th>
                                    <th className="py-2 px-4 text-left">Area</th>
                                    <th className="py-2 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProviders.length > 0 ? (
                                    filteredProviders.map((provider, index) => (
                                        <tr key={provider._id}>
                                            <td className="py-2 px-4 border text-center">{index + 1}</td>   
                                            <td className="py-2 px-4 border text-center">{provider.name}</td>
                                            <td className="py-2 px-4 border text-center">{provider.cnic}</td>
                                            <td className="py-2 px-4 border text-center">{provider.phoneNumber}</td>
                                            <td className="py-2 px-4 border text-center">{provider.restorantName}</td>
                                            <td className="py-2 px-4 border text-center">{provider.restaurantAddress}</td>
                                            <td className="py-2 px-4 border text-center">{provider.area}</td>
                                            <td className="py-2 px-4 border text-center">
                                                {provider.isVerified ? (
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleEditProvider(provider)}
                                                    >
                                                        Edit
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-500 hover:text-green-700"
                                                        onClick={() => handleCheckProvider(provider)}
                                                    >
                                                        Check
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            No providers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && selectedProvider && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
                                {showEditButton ? (
                                    <form onSubmit={handleSaveProvider}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={selectedProvider.name}
                                                onChange={(e) => setSelectedProvider({ ...selectedProvider, name: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">CNIC</label>
                                            <input
                                                type="text"
                                                name="cnic"
                                                value={selectedProvider.cnic}
                                                onChange={(e) => setSelectedProvider({ ...selectedProvider, cnic: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={selectedProvider.phoneNumber}
                                                onChange={(e) => setSelectedProvider({ ...selectedProvider, phoneNumber: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Area</label>
                                            <input
                                                type="text"
                                                name="area"
                                                value={selectedProvider.area}
                                                onChange={(e) => setSelectedProvider({ ...selectedProvider, area: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Restaurant Address</label>
                                            <input
                                                type="text"
                                                name="restaurantAddress"
                                                value={selectedProvider.restaurantAddress}
                                                onChange={(e) => setSelectedProvider({ ...selectedProvider, restaurantAddress: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
                                        
                                                onClick={handleRejectProvider || setIsModalOpen(false)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <p className="mb-4">Do you want to verify this provider?</p>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                                onClick={handleVerifyProvider}
                                            >
                                                Verify
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                                                onClick={handleRejectProvider}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                </main>
            </div>
        </div>
    );

};

export default FoodProviderDashboard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import AdminIcon from '../assets/admin.png';
// import SuccessIcon from '../assets/successicon.png';
// import FailureIcon from '../assets/Failedicon.png';

// const FoodProviderDashboard = () => {
//     const [foodProviders, setFoodProviders] = useState([]);
//     const [filteredProviders, setFilteredProviders] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedProvider, setSelectedProvider] = useState(null);
//     const [showEditButton, setShowEditButton] = useState(false);

//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             navigate('/login');
//         } else {
//             fetchFoodProviders();
//         }
//     }, []);

//     useEffect(() => {
//         setFilteredProviders(
//             foodProviders.filter(provider =>
//                 provider.cnic.includes(searchTerm) ||
//                 provider.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 provider.name.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//         );
//     }, [searchTerm, foodProviders]);

//     const fetchFoodProviders = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:5000/admin/food-providers/unverified', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setFoodProviders(response.data);
//         } catch (error) {
//             console.error('Error fetching food providers:', error);
//             setFoodProviders([]);
//         }
//     };

//     const handleCheckProvider = (provider) => {
//         setSelectedProvider(provider);
//         setIsModalOpen(true);
//     };

//     const handleVerifyProvider = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.patch(`http://localhost:5000/admin/food-providers/verify/${selectedProvider._id}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setAlertMessage('Provider verified successfully');
//             setIsSuccess(true);
//             setShowEditButton(true);
//             fetchFoodProviders();
//         } catch (error) {
//             console.error('Error verifying provider:', error);
//             setAlertMessage('Failed to verify provider. Please try again.');
//             setIsSuccess(false);
//         } finally {
//             setShowAlert(true);
//             setIsModalOpen(false);
//         }
//     };

//     const handleRejectProvider = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete(`http://localhost:5000/admin/food-providers/remove/${selectedProvider._id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setAlertMessage('Provider rejected and removed successfully');
//             setIsSuccess(true);
//             fetchFoodProviders();
//         } catch (error) {
//             console.error('Error removing provider:', error);
//             setAlertMessage('Failed to remove provider. Please try again.');
//             setIsSuccess(false);
//         } finally {
//             setShowAlert(true);
//             setIsModalOpen(false);
//         }
//     };

//     const handleEditProvider = (provider) => {
//         setSelectedProvider(provider);
//         setIsModalOpen(true);
//     };

//     const handleSaveProvider = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:5000/admin/food-providers/update/${selectedProvider._id}`, selectedProvider, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setAlertMessage('Provider details updated successfully');
//             setIsSuccess(true);
//             fetchFoodProviders();
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error('Error updating provider:', error);
//             setAlertMessage('Failed to update provider. Please try again.');
//             setIsSuccess(false);
//         } finally {
//             setShowAlert(true);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 relative">
//             <button className="bg-slate-400 text-white mb-5 px-2 rounded-md absolute top-0 right-0" onClick={() => navigate('/login')}>
//                 Logout
//             </button>
//             <div className="flex">
//                 <aside className="w-64 bg-gray-800 text-white min-h-screen">
//                     <div className="px-10">
//                         <img className="px-4" src={AdminIcon} alt="" />
//                         <h1 className="text-xl font-bold text-white">Admin Panel</h1>
//                     </div>
//                 </aside>
//                 <main className="flex-1 p-8">
//                     <h1 className="text-2xl font-bold">Food Providers Listing</h1>
//                     <input
//                         type="text"
//                         placeholder="Search by CNIC, Area or Name"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full px-3 py-2 border rounded-lg my-4"
//                     />
//                     <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
//                         <thead>
//                             <tr>
//                                 <th className="border border-gray-300 px-4 py-2">CNIC</th>
//                                 <th className="border border-gray-300 px-4 py-2">Name</th>
//                                 <th className="border border-gray-300 px-4 py-2">Area</th>
//                                 <th className="border border-gray-300 px-4 py-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredProviders.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="4" className="text-center border border-gray-300 px-4 py-2 text-gray-500">
//                                         No providers found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredProviders.map((provider) => (
//                                     <tr key={provider._id}>
//                                         <td className="border border-gray-300 px-4 py-2">{provider.cnic}</td>
//                                         <td className="border border-gray-300 px-4 py-2">{provider.name}</td>
//                                         <td className="border border-gray-300 px-4 py-2">{provider.area}</td>
//                                         <td className="border border-gray-300 px-4 py-2">
//                                             {provider.isVerified ? (
//                                                 <button onClick={() => handleEditProvider(provider)} className="text-blue-500">
//                                                     Edit
//                                                 </button>
//                                             ) : (
//                                                 <button onClick={() => handleCheckProvider(provider)} className="text-green-500">
//                                                     Check
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>

//                     </table>

//                     {isModalOpen && selectedProvider && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                             <div className="bg-white p-6 rounded-xl relative">
//                                 {showEditButton ? (
//                                     <form onSubmit={handleSaveProvider}>
//                                         <div className="mb-2">
//                                             <label>Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="name"
//                                                 value={selectedProvider.name}
//                                                 onChange={(e) =>
//                                                     setSelectedProvider({ ...selectedProvider, name: e.target.value })
//                                                 }
//                                                 className="w-full px-3 py-2 border rounded-lg"
//                                             />
//                                         </div>
//                                         <div className="mb-2">
//                                             <label>CNIC</label>
//                                             <input
//                                                 type="text"
//                                                 name="cnic"
//                                                 value={selectedProvider.cnic}
//                                                 onChange={(e) =>
//                                                     setSelectedProvider({ ...selectedProvider, cnic: e.target.value })
//                                                 }
//                                                 className="w-full px-3 py-2 border rounded-lg"
//                                             />
//                                         </div>
//                                         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">Save</button>
//                                     </form>
//                                 ) : (
//                                     <div className="text-center">
//                                         <p>Do you want to verify or reject this provider?</p>
//                                         <div className="flex justify-around mt-4">
//                                             <button onClick={handleVerifyProvider} className="bg-green-500 text-white px-4 py-2 rounded-lg">
//                                                 Verify
//                                             </button>
//                                             <button onClick={handleRejectProvider} className="bg-red-500 text-white px-4 py-2 rounded-lg">
//                                                 Reject
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {showAlert && (
//                         <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
//                             <div className="bg-white p-6 rounded-xl">
//                                 <img className="mx-auto" src={isSuccess ? SuccessIcon : FailureIcon} alt="" />
//                                 <h1 className="text-center text-2xl font-semibold">{alertMessage}</h1>
//                                 <button
//                                     onClick={() => setShowAlert(false)}
//                                     className="block bg-gray-300 text-gray-800 px-4 py-2 mt-4 mx-auto rounded-lg"
//                                 >
//                                     OK
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default FoodProviderDashboard;

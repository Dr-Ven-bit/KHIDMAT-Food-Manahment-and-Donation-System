import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png';
import DeleteIcon from '../assets/deleteicon.png';
// import SuccessIcon from '../assets/successicon.png';
// import FailureIcon from '../assets/Failedicon.png';

const ManageFoodDeliveries = () => {
    const [foodDeliveries, setFoodDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('waiting');
    const [notification, setNotification] = useState({ message: '', type: '' }); // New notification state
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

    // Fetch food deliveries
    const fetchFoodDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/volunteer/food-deliveries', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setFoodDeliveries(response.data);
            setFilteredDeliveries(response.data.filter(food => food.status === 'waiting'));
        } catch (error) {
            console.error('Error fetching food deliveries:', error);
        }
    };

    useEffect(() => {
        fetchFoodDeliveries();
    }, []);

    useEffect(() => {
        let filteredData = foodDeliveries;

        // Apply search filter
        if (searchQuery) {
            filteredData = filteredData.filter(food => food.nameFood.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Apply status filter
        if (statusFilter === 'waiting') {
            filteredData = filteredData.filter(food => food.status === 'waiting');
        } else if (statusFilter === 'received') {
            filteredData = filteredData.filter(food => food.status === 'received');
        } else if (statusFilter === 'delivered' || statusFilter === 'not delivered') {
            filteredData = filteredData.filter(food => food.status === 'delivered' || food.status === 'not delivered');
        }

        setFilteredDeliveries(filteredData);
    }, [statusFilter, foodDeliveries, searchQuery]);

    // Handle status change for food delivery
    const handleStatusChange = async (foodId, action) => {
        try {
            await axios.post('http://localhost:5000/volunteer/food-delivery-status', { foodId, action }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFoodDeliveries();
            showNotification('Status updated successfully!', 'success'); // Trigger success notification
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('Failed to update status.', 'error'); // Trigger error notification
        }
    };

    // Handle delivery status change
    const handleDeliveryStatus = async (foodId, status) => {
        try {
            await axios.post('http://localhost:5000/volunteer/delivery-status', { foodId, status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFoodDeliveries();
            showNotification('Delivery status updated successfully!', 'success'); // Trigger success notification
        } catch (error) {
            console.error('Error updating delivery status:', error);
            showNotification('Failed to update delivery status.', 'error'); // Trigger error notification
        }
    };


    // Notification function
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Hide after 3 seconds
    };

    // Open the modal to update status
    const openModal = (food) => {
        setSelectedFood(food);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (showProfile) {
            fetchVolunteerDetails();
        }
    }, [showProfile]);

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

            <div className="flex">
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
                <main className="flex-1 p-10">
                    <h2 className="text-2xl font-bold mb-6">Manage Food Deliveries</h2>

                    {/* Search bar */}
                    <input
                        type="text"
                        placeholder="Search by food name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg mb-6 shadow-sm"
                    />

                    {/* Status filter buttons */}
                    <div className="flex justify-around mb-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${statusFilter === 'waiting'
                                ? 'bg-[#5cccf1] text-white'
                                : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                                }`}
                            onClick={() => setStatusFilter('waiting')}
                        >
                            Waiting
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${statusFilter === 'received'
                                ? 'bg-[#5cccf1] text-white'
                                : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                                }`}
                            onClick={() => setStatusFilter('received')}
                        >
                            Received
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${statusFilter === 'delivered'
                                ? 'bg-[#5cccf1] text-white'
                                : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                                }`}
                            onClick={() => setStatusFilter('delivered')}
                        >
                            Delivered
                        </button>
                    </div>

                    {/* Generate Report Button */}
                    {/* <div className="mb-4">
                        <button
                            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:scale-105 transition-transform"
                            onClick={handleGenerateReport}
                        >
                            Generate Report
                        </button>
                    </div> */}

                    {/* Food Deliveries Table */}
                    <table className="w-full bg-white border border-gray-200 shadow-sm">
                        <thead className="bg-[#000000] text-white">
                            <tr>
                                <th className="py-2 px-4 text-left">Food Name</th>
                                <th className="py-2 px-4 text-left">Quantity</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map((food) => (
                                <tr key={food._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{food.nameFood}</td>
                                    <td className="py-2 px-4 border">{food.quantityFood}</td>
                                    <td className="py-2 px-4 border">{food.status}</td>
                                    <td className="py-2 px-4 border">
                                        {(statusFilter === 'waiting' || statusFilter === 'received') && (
                                            <button
                                                onClick={() => openModal(food)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:shadow-md transition-transform transform hover:scale-105"
                                            >
                                                Check
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Notification Popup */}
                    {notification.message && (
                        <div className={`fixed top-5 right-5 p-4 rounded shadow-lg z-50
                            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {notification.message}
                        </div>
                    )}

                    {/* Modal for updating status */}
                    {isModalOpen && selectedFood && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded shadow-md w-96">
                                <h2 className="text-2xl mb-4">Update Status for {selectedFood.nameFood}</h2>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        className="bg-gray-500 text-white py-2 px-4 rounded"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                    {statusFilter === 'waiting' && (
                                        <>
                                            <button
                                                className="bg-green-500 text-white py-2 px-4 rounded"
                                                onClick={() => handleStatusChange(selectedFood._id, 'accept')}
                                            >
                                                Mark as Received
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded"
                                                onClick={() => handleStatusChange(selectedFood._id, 'reject')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {statusFilter === 'received' && (
                                        <>
                                            <button
                                                className="bg-green-500 text-white py-2 px-4 rounded"
                                                onClick={() => handleDeliveryStatus(selectedFood._id, 'delivered')}
                                            >
                                                Mark as Delivered
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded"
                                                onClick={() => handleDeliveryStatus(selectedFood._id, 'not delivered')}
                                            >
                                                Not Delivered
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ManageFoodDeliveries;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import AdminIcon from '../assets/admin.png';

// const ManageFoodDeliveries = () => {
//     const [foodDeliveries, setFoodDeliveries] = useState([]);
//     const [filteredDeliveries, setFilteredDeliveries] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedFood, setSelectedFood] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [statusFilter, setStatusFilter] = useState('waiting');

//     const navigate = useNavigate();
//     const location = useLocation();

//     // Fetch food deliveries
//     const fetchFoodDeliveries = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/volunteer/food-deliveries', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             setFoodDeliveries(response.data);
//             setFilteredDeliveries(response.data.filter(food => food.status === 'waiting'));
//         } catch (error) {
//             console.error('Error fetching food deliveries:', error);
//         }
//     };

//     useEffect(() => {
//         fetchFoodDeliveries();
//     }, []);

//     useEffect(() => {
//         let filteredData = foodDeliveries;

//         // Apply search filter
//         if (searchQuery) {
//             filteredData = filteredData.filter(food => food.nameFood.toLowerCase().includes(searchQuery.toLowerCase()));
//         }

//         // Apply status filter
//         if (statusFilter === 'waiting') {
//             filteredData = filteredData.filter(food => food.status === 'waiting');
//         } else if (statusFilter === 'received') {
//             filteredData = filteredData.filter(food => food.status === 'received');
//         } else if (statusFilter === 'delivered' || statusFilter === 'not delivered') {
//             filteredData = filteredData.filter(food => food.status === 'delivered' || food.status === 'not delivered');
//         }

//         setFilteredDeliveries(filteredData);
//     }, [statusFilter, foodDeliveries, searchQuery]);

//     // Handle status change for food delivery
//     const handleStatusChange = async (foodId, action) => {
//         try {
//             await axios.post('http://localhost:5000/volunteer/food-delivery-status', { foodId, action }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             fetchFoodDeliveries();
//         } catch (error) {
//             console.error('Error updating status:', error);
//         }
//     };

//     // Handle delivery status change
//     const handleDeliveryStatus = async (foodId, status) => {
//         try {
//             await axios.post('http://localhost:5000/volunteer/delivery-status', { foodId, status }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             fetchFoodDeliveries();
//         } catch (error) {
//             console.error('Error updating delivery status:', error);
//         }
//     };

//     // Generate report
//     const handleGenerateReport = async () => {
//         try {
//             const response = await axios.post('http://localhost:5000/volunteer/generate-report', {}, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             alert(`Report generated successfully!`);
//         } catch (error) {
//             console.error('Error generating report:', error);
//         }
//     };

//     // Open the modal to update status
//     const openModal = (food) => {
//         setSelectedFood(food);
//         setIsModalOpen(true);
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
//                         <h1 className="text-xl text-center font-bold text-white mt-2">Volunteer Panel</h1>
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
//                                     to="/volunteer/food-deliveries"
//                                     className={`flex items-center p-2 rounded ${location.pathname === '/volunteer/food-deliveries' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                                 >
//                                     <span className="ml-2">Manage Food Deliveries</span>
//                                 </Link>
//                             </li>
//                         </ul>
//                     </nav>
//                 </aside>
//                 <main className="flex-1 p-8">
//                     <h2 className="text-2xl font-bold mb-6">Manage Food Deliveries</h2>

//                     {/* Search bar */}
//                     <input
//                         type="text"
//                         placeholder="Search by food name..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="border px-4 py-2 mb-4 w-full"
//                     />

//                     {/* Status filter buttons */}
//                     <div className="mb-4 space-x-2">
//                         <button
//                             className={`bg-blue-500 text-white py-2 px-4 rounded ${statusFilter === 'waiting' && 'bg-blue-700'}`}
//                             onClick={() => setStatusFilter('waiting')}
//                         >
//                             Waiting
//                         </button>
//                         <button
//                             className={`bg-green-500 text-white py-2 px-4 rounded ${statusFilter === 'received' && 'bg-green-700'}`}
//                             onClick={() => setStatusFilter('received')}
//                         >
//                             Received
//                         </button>
//                         <button
//                             className={`bg-yellow-500 text-white py-2 px-4 rounded ${statusFilter === 'delivered' && 'bg-yellow-700'}`}
//                             onClick={() => setStatusFilter('delivered')}
//                         >
//                             Delivered
//                         </button>
//                     </div>

//                     {/* Generate Report Button */}
//                     <div className="mb-4">
//                         <button
//                             className="bg-purple-500 text-white py-2 px-4 rounded"
//                             onClick={handleGenerateReport}
//                         >
//                             Generate Report
//                         </button>
//                     </div>

//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead className="bg-black text-white">
//                             <tr>
//                                 <th className="py-2 px-4 border-b">Food Name</th>
//                                 <th className="py-2 px-4 border-b">Quantity</th>
//                                 <th className="py-2 px-4 border-b">Status</th>
//                                 <th className="py-2 px-4 border-b">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredDeliveries.map((food) => (
//                                 <tr key={food._id} className="hover:bg-gray-100">
//                                     <td className="py-2 px-4 border-b text-center">{food.nameFood}</td>
//                                     <td className="py-2 px-4 border-b text-center">{food.quantityFood}</td>
//                                     <td className="py-2 px-4 border-b text-center">{food.status}</td>
//                                     <td className="py-2 px-4 border-b text-center">
//                                         {(statusFilter === 'waiting' || statusFilter === 'received') && (
//                                             <button
//                                                 onClick={() => openModal(food)}
//                                                 className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
//                                             >
//                                                 Check
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* Modal for updating status */}
//                     {isModalOpen && selectedFood && (
//                         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                             <div className="bg-white p-8 rounded shadow-md w-96">
//                                 <h2 className="text-2xl mb-4">Update Status for {selectedFood.nameFood}</h2>
//                                 <div className="flex justify-end space-x-2">
//                                     <button
//                                         className="bg-gray-500 text-white py-2 px-4 rounded"
//                                         onClick={() => setIsModalOpen(false)}
//                                     >
//                                         Close
//                                     </button>
//                                     {statusFilter === 'waiting' && (
//                                         <>
//                                             <button
//                                                 className="bg-green-500 text-white py-2 px-4 rounded"
//                                                 onClick={() => handleStatusChange(selectedFood._id, 'accept')}
//                                             >
//                                                 Mark as Received
//                                             </button>
//                                             <button
//                                                 className="bg-red-500 text-white py-2 px-4 rounded"
//                                                 onClick={() => handleStatusChange(selectedFood._id, 'reject')}
//                                             >
//                                                 Reject
//                                             </button>
//                                         </>
//                                     )}
//                                     {statusFilter === 'received' && (
//                                         <>
//                                             <button
//                                                 className="bg-green-500 text-white py-2 px-4 rounded"
//                                                 onClick={() => handleDeliveryStatus(selectedFood._id, 'delivered')}
//                                             >
//                                                 Mark as Delivered
//                                             </button>
//                                             <button
//                                                 className="bg-red-500 text-white py-2 px-4 rounded"
//                                                 onClick={() => handleDeliveryStatus(selectedFood._id, 'not delivered')}
//                                             >
//                                                 Not Delivered
//                                             </button>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default ManageFoodDeliveries;
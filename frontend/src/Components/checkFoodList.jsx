// src/components/FoodStatusPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png'; // Update the path as necessary
import DeleteIcon from '../assets/deleteicon.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const FoodStatusPage = () => {
  const [foodProviders, setFoodProviders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState('waiting');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null); // Food selected for assignment
  const [showProfile, setShowProfile] = useState(false); // Profile visibility state
  const [CoordinatorDetails, setCoordinatorDetails] = useState({
    name: '',
    fatherName: '',
    cnic: '',
    role: '',
    email: ''  // Initialize email to prevent undefined error
  });


  const navigate = useNavigate();
  const location = useLocation();

  // Fetch food providers on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchFoodProviders();
    }
  }, []);

  // Filter food items based on search term and active tab
  useEffect(() => {
    const filtered = [];
    foodProviders.forEach(provider => {
      const filteredFood = provider.AddFoodList.filter(
        food =>
          food.status === activeTab &&
          (food.nameFood.toLowerCase().includes(searchTerm.toLowerCase()) ||
            food.quantityFood.toString().includes(searchTerm))
      );
      if (filteredFood.length) {
        filtered.push({ ...provider, AddFoodList: filteredFood });
      }
    });
    setFilteredFoodItems(filtered);
  }, [searchTerm, foodProviders, activeTab]);

  const fetchFoodProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/coordinator/coordinator-area', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoodProviders(res.data.data); // Set the food providers
      console.log(res.data.data, "Food providers with AddFoodList");
    } catch (error) {
      console.error('Error fetching food providers:', error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/coordinator/by-area', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming the API populates the addFoodToDeliver array
      setVolunteers(res.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const assignFood = async (foodId, volunteerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/coordinator/assign',
        { foodId, volunteerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchVolunteers(); // Update volunteer counters
      setAlertMessage('Food successfully assigned!');
      setIsSuccess(true);
      setShowAlert(true);
    } catch (error) {
      console.error('Error assigning food:', error);
      setAlertMessage('Failed to assign food. Please try again.');
      setIsSuccess(false);
      setShowAlert(true);
    }
  };

  // const fetchCoordinators = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://localhost:5000/coordinator/volunteers/unverified', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setCoordinators(response.data);
  //   } catch (error) {
  //     console.error('Error fetching coordinators:', error);
  //     setCoordinators([]);
  //   }
  // };




  // Fetch coordinator details when showProfile is true
  useEffect(() => {
    if (showProfile) {
      fetchCoordinatorDetails();
    }
  }, [showProfile]);

  const fetchCoordinatorDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/coordinator/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoordinatorDetails(response.data.coordinator);  // Access the 'coordinator' object from the response
      console.log(response.data.coordinator);
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



  const handleAssignClick = (food) => {
    setSelectedFood(food);
    fetchVolunteers(); // Fetch volunteers when assigning
  };

  const handleVolunteerClick = (volunteerId) => {
    if (selectedFood) {
      assignFood(selectedFood._id, volunteerId);
      setSelectedFood(null); // Reset selected food
    }
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
            <p><strong>Name:</strong> {CoordinatorDetails?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {CoordinatorDetails?.email || 'N/A'}</p>
            <p><strong>CNIC:</strong> {CoordinatorDetails?.cnic || 'N/A'}</p>
            <p><strong>Role:</strong> {CoordinatorDetails?.role || 'N/A'}</p>
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
        <aside className="w-64 bg-[#000000] text-[#ffffff] min-h-screen shadow-md">
          <div className="px-4 py-4">
            <img className="w-22" src={AdminIcon} alt="Admin Icon" />
            <h1 className="text-2xl font-bold">Coordinator Panel</h1>
          </div>
          <p className='text-base pl-4 font-bold'><strong>Menu</strong></p>
          <nav className="px-4">
            <ul>
              <li className="mb-3">
                <Link
                  to="/coordinator-dashboard"
                  className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator-dashboard'
                    ? 'bg-slate-50 text-black'
                    : 'hover:bg-[#5cccf1] hover:text-white'
                    }`}
                >
                  DashBoard
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/coordinator/check-food-list"
                  className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/check-food-list'
                    ? 'bg-white text-black'
                    : 'hover:bg-[#5cccf1] hover:text-white'
                    }`}
                >
                  Check Food List
                </Link>
              </li>
              <li>
                <Link
                  to="/coordinator/allocation-beneficiaries"
                  className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/allocation-beneficiaries'
                    ? 'bg-white text-black'
                    : 'hover:bg-[#5cccf1] hover:text-white'
                    }`}
                >
                  Allocation Beneficiaries
                </Link>
                <Link
                  to="/coordinator/Beneficiaries-List"
                  className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/Beneficiaries-List'
                    ? 'bg-white text-black'
                    : 'hover:bg-[#5cccf1] hover:text-white'
                    }`}
                >
                  Beneficiaries List
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold">Food Status</h1>
          

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search food by name or quantity"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg my-6 shadow-sm"
          />

          {/* Status Tabs */}
          <div className="flex justify-around mb-4">
            <button
              onClick={() => setActiveTab('waiting')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'waiting'
                  ? 'bg-[#5cccf1] text-white'
                  : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                }`}
            >
              Waiting
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'received'
                  ? 'bg-[#5cccf1] text-white'
                  : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                }`}
            >
              Received
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-2 rounded-lg ${activeTab ==='delivered'
                  ? 'bg-[#5cccf1] text-white'
                  : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab('not delivered')}
              className={`px-4 py-2 rounded-lg ${activeTab ==='not delivered'
                  ? 'bg-[#5cccf1] text-white'
                  : 'bg-slate-50 hover:bg-[#5cccf1] hover:text-white transition-all'
                }`}
            >
             Not Delivered
            </button>
          </div>

          {/* Food Items */}
          <div className="mt-4">
            {filteredFoodItems.length === 0 ? (
              <p className="text-gray-500">No food items found.</p>
            ) : (
              filteredFoodItems.map((provider) => (
                <div
                  key={provider._id}
                  className="p-4 border rounded-lg mb-4 bg-white shadow-md"
                >
                  <h2 className="text-lg font-semibold">
                    {provider.restorantName} - {provider.area}
                  </h2>

                  <table className="w-full mt-4 border-collapse">
                    <thead>
                      <tr className="bg-[#000000] text-white">
                        <th className="py-2 px-4 text-left">Food Name</th>
                        <th className="py-2 px-4 text-left">Quantity</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Assigned</th>
                        <th className="py-2 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {provider.AddFoodList.map((food) => (
                        <tr key={food._id}>
                          <td className="py-2 px-4 border">{food.nameFood}</td>
                          <td className="py-2 px-4 border">{food.quantityFood} units</td>
                          <td className="py-2 px-4 border">{food.status}</td>
                          <td className="py-2 px-4 border">
                            {food.assignedTo ? 'Assigned' : 'Not Assigned'}
                          </td>
                          <td className="py-2 px-4 border">
                            {food.status === 'waiting' && (
                              <button
                                onClick={() => handleAssignClick(food)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 hover:shadow-md transition-transform transform hover:scale-105"
                              >
                                Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Volunteers Modal */}
      {selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Assign "{selectedFood.nameFood}" to Volunteer
            </h2>
            {volunteers.length === 0 ? (
              <p className="text-gray-500">No volunteers available in your area.</p>
            ) : (
                <ul>
                  {volunteers.map((volunteer) => (
                    <li key={volunteer._id} className="flex justify-between items-center mb-2">
                      <span>{volunteer.name}</span>
                      <span>Tasks: {volunteer.addFoodToDeliver.length}</span> {/* Task count */}
                      <button
                        onClick={() => handleVolunteerClick(volunteer._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 hover:shadow-md transition-transform transform hover:scale-105"
                      >
                        Assign
                      </button>
                    </li>
                  ))}
                </ul>
            )}
            <button
              onClick={() => setSelectedFood(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 hover:shadow-md transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Alert Message */}
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
    </div>
  );


};

export default FoodStatusPage;

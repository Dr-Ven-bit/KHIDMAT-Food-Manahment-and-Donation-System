import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '../assets/deleteicon.png';
import AdminIcon from '../assets/logo.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const CoordinatorDashboard = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Profile visibility state
  const [adminDetails, setAdminDetails] = useState({
    name: '',
    fatherName: '',
    cnic: '',
    role: '',
    email:''
  });


  const [newCoordinator, setNewCoordinator] = useState({
    cnic: '',
    password: '',
    name: '',
    fatherName: '',
    area: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchCoordinators();
    }
  }, []);

  useEffect(() => {
    setFilteredCoordinators(
      coordinators.filter((coordinator) =>
        coordinator.cnic.includes(searchTerm)
      )
    );
  }, [searchTerm, coordinators]);

  const fetchCoordinators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/coordinators', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoordinators(response.data);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
      setCoordinators([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoordinator({ ...newCoordinator, [name]: value });
  };

  const handleAddCoordinator = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to add this coordinator?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/admin/add-coordinator', newCoordinator, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchCoordinators();
        setShowAddForm(false);
        setNewCoordinator({
          cnic: '',
          password: '',
          name: '',
          fatherName: '',
          area: '',
          email: '',
          phoneNumber: '',
          address: '',
          gender: ''
        });
        setIsSuccess(true);
        setAlertMessage('Coordinator added successfully');
      } catch (error) {
        setIsSuccess(false);
        if (error.response && error.response.data && error.response.data.msg) {
          setAlertMessage(error.response.data.msg);
        } else {
          setAlertMessage('Failed to add coordinator. Please try again.');
        }
      } finally {
        setShowAlert(true);
      }
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



  const handleRemoveCoordinator = async (coordinatorId) => {
    if (window.confirm('Are you sure you want to remove this coordinator?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/admin/remove-coordinator/${coordinatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlertMessage('Coordinator removed successfully');
        fetchCoordinators();
      } catch (error) {
        console.error('Error removing coordinator:', error);
        setAlertMessage('Failed to remove coordinator. Please try again.');
        setIsSuccess(false);
      } finally {
        setShowAlert(true);
      }
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Coordinators Listing</h1>
            <button
              className="bg-[#5cccf1] hover:bg-[#45b8db] transition-all text-white py-2 mr-8 mt-6 px-6 rounded-md shadow-lg"
              onClick={() => setShowAddForm(true)}
            >
              Add Coordinator
            </button>
          </div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by CNIC"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border rounded-md shadow-sm"
            />
          </div>

          {showAddForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 px-4">
              <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-lg max-h-screen overflow-y-auto">
                <button
                  className="absolute top-4 right-4 w-8 h-8  rounded-full flex items-center justify-center"
                  onClick={() => setShowAddForm(false)}
                >
                  <img className="w-4" src={DeleteIcon} alt="Delete" />
                </button>
                <form

                  onSubmit={handleAddCoordinator}>
                  <div className='font-light text-xs mb-1'>
                    Enter CNIC
                  </div>
                  <div className="mb-2">
                    <input
                      type="number"
                      name="cnic"
                      placeholder="1234567890000"
                      onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
                      inputMode="numeric"
                      value={newCoordinator.cnic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Enter Passward
                  </div>
                  <div className="mb-2">
                    <input
                      type="password"
                      name="password"
                      placeholder="*********"
                      value={newCoordinator.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Enter Name
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="John"
                      
                      value={newCoordinator.name}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                        e.target.value = value; // Explicitly update the input's value in the UI
                        handleInputChange({ target: { name: 'name', value } });  // Update the form data with the limited value
                      }}
                      // onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {/* <input
                      type="text"
                      name="name"
                      placeholder="John"
                      value={newCoordinator.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    /> */}
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Enter Father's Name
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Kalia"
                      value={newCoordinator.fatherName}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                        e.target.value = value; // Explicitly update the input's value in the UI
                        handleInputChange({ target: { name: 'fatherName', value } });  // Update the form data with the limited value
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Select Area
                  </div>
                  <select
                    name="area"
                    value={newCoordinator.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Area</option>
                    <option value="Ravi">Ravi</option>
                    <option value="Shalamar">Shalamar</option>
                    <option value="Wagha">Wagha</option>
                    <option value="Aziz Bhatti">Aziz Bhatti</option>
                    <option value="Data Gunj Buksh">Data Gunj Buksh</option>
                    <option value="Gulberg">Gulberg</option>
                    <option value="Samanabad">Samanabad</option>
                    <option value="Iqbal Town">Iqbal Town</option>
                    <option value="Nishtar">Nishtar</option>
                  </select>

                  <div className='font-light text-xs mb-1'>
                    Enter Email
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="abc@gmail.com"
                      value={newCoordinator.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Enter Phone Number
                  </div>
                  <div className="mb-2">
                    <input
                      type='number'
                      name="phoneNumber"
                      onInput={(e) => e.target.value = e.target.value.slice(0, 11)}
                      required
                      placeholder="03000000000"
                      value={newCoordinator.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Enter Address
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="address"
                      placeholder="abc street anarkali lahore"
                      value={newCoordinator.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className='font-light text-xs mb-1'>
                    Select Gender
                  </div>
                  <div className="mb-2">
                    <select
                      name="gender"
                      value={newCoordinator.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>


                  <button type="submit" className="bg-green-500 text-white py-2 px-2 rounded-xl">
                    Submit
                  </button>
                </form>
              </div>
            </div>

          )}

          {showAlert && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded shadow-md w-1/3 h-1/2 text-center ">
                <div className='flex items-center justify-center mb-1'>
                  {isSuccess ? (
                    <img src={SuccessIcon} alt="Success" />
                  ) : (
                    <img src={FailureIcon} alt="Failure" />
                  )}
                </div>

                <p>{alertMessage}</p>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                  onClick={() => setShowAlert(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#000000] text-white">
                  <th className="py-2 px-4 text-left">Sr.No</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Father's Name</th>
                  <th className="py-2 px-4 text-left">CNIC</th>
                  <th className="py-2 px-4 text-left">Area</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoordinators.length > 0 ? (
                  filteredCoordinators.map((coordinator,index) => (
                    <tr key={coordinator.cnic}>
                      <td className="py-2 px-4 border">{ index + 1}</td>
                     <td className="py-2 px-4 border">{coordinator.name}</td>
                     <td className="py-2 px-4 border">{coordinator.fatherName}</td>
                     <td className="py-2 px-4 border">{coordinator.cnic}</td>
                     <td className="py-2 px-4 border">{coordinator.area}</td>
                     <td className="py-2 px-4 border">{coordinator.phoneNumber}</td>
                      <td className="py-2 px-4 border text-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md shadow-sm transition-all"
                          onClick={() => handleRemoveCoordinator(coordinator._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center">
                      No coordinators found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

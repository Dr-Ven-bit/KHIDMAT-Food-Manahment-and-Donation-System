
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png';
import SuccessIcon from '../assets/successicon.png';
import DeleteIcon from '../assets/deleteicon.png';
import FailureIcon from '../assets/Failedicon.png';

const CoordinatorDashboard = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [showEditButton, setShowEditButton] = useState(false);
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
      coordinators.filter(coordinator =>
        coordinator.cnic.includes(searchTerm) ||
        coordinator.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coordinator.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, coordinators]);

  const fetchCoordinators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/coordinator/volunteers/unverified', {
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

  const handleCheckCoordinator = (coordinator) => {
    setSelectedCoordinator(coordinator);
    setIsModalOpen(true);
    setShowEditButton(false);
  };

  const handleVerifyCoordinator = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/coordinator/volunteers/verify/${selectedCoordinator._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage('Coordinator verified successfully');
      setIsSuccess(true);
      fetchCoordinators();
    } catch (error) {
      console.error('Error verifying coordinator:', error);
      setAlertMessage('Failed to verify coordinator. Please try again.');
      setIsSuccess(false);
    } finally {
      setShowAlert(true);
      setIsModalOpen(false);
    }
  };

  const handleRejectCoordinator = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/coordinator/volunteers/remove/${selectedCoordinator._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage('Coordinator removed successfully');
      setIsSuccess(true);
      fetchCoordinators();
    } catch (error) {
      console.error('Error removing coordinator:', error);
      setAlertMessage('Failed to remove coordinator. Please try again.');
      setIsSuccess(false);
    } finally {
      setShowAlert(true);
      setIsModalOpen(false);
    }
  };

  const handleEditCoordinator = (coordinator) => {
    setSelectedCoordinator(coordinator);
    setIsModalOpen(true);
    setShowEditButton(true);
  };

  const handleSaveCoordinator = async () => {
    try {
     
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/coordinator/volunteers/update/${selectedCoordinator._id}`, selectedCoordinator, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage('Coordinator details updated successfully');
      setIsSuccess(true);
      fetchCoordinators();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating coordinator:', error);
      setAlertMessage('Failed to update coordinator. Please try again.');
      setIsSuccess(false);
    } finally {
      setShowAlert(true);
    }
  };

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
        <aside className="w-64 bg-[#000000] text-[#ffffff] min-h-screen shadow-md">
          <div className="px-4 py-4">
            <img className='w-22' src={AdminIcon} alt="Admin Icon" />

            <h1 className="text-2xl font-bold">Coordinate Panel</h1>
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
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold">Coordinators Listing</h1>
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
                  <th className="py-2 px-4 text-left">Father Name</th>
                  <th className="py-2 px-4 text-left">CNIC</th>
                  <th className='py-2 px-4 text-left'>Phone Number</th>
                  <th className="py-2 px-4 text-left">Area</th>
                  <th className="py-2 px-4 text-left">status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoordinators.length > 0 ? (
                  filteredCoordinators.map((coordinator, index) => (
                    <tr key={coordinator._id}>
                      <td className="py-2 px-4 border ">{index + 1}</td>
                      <td className="py-2 px-4 border ">{coordinator.name}</td>
                      <td className="py-2 px-4 border ">{coordinator.fatherName}</td>
                      <td className="py-2 px-4 border ">{coordinator.cnic}</td>
                      <td className="py-2 px-4 border ">{coordinator.phoneNumber}</td>
                      <td className="py-2 px-4 border ">{coordinator.area}</td>
                      <td className="py-2 px-4 border text-blue-500 ">{coordinator.isVerified?"verified":"not verified"}</td>
                      <td className="py-2 px-4 border text-center">
                        {coordinator.isVerified ? (
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditCoordinator(coordinator)}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={() => handleCheckCoordinator(coordinator)}
                          >
                            Check
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No coordinators found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && selectedCoordinator && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
                {showEditButton ? (
                  <form onSubmit={handleSaveCoordinator}>
                    <div className="mb-4">
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={selectedCoordinator.name}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Father Name</label>
                      <input
                        type="text"
                        name="name"
                        value={selectedCoordinator.fatherName}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, fatherName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">CNIC</label>
                      <input
                        type="number"
                        name="cnic"
                        value={selectedCoordinator.cnic}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, cnic: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        name="area"
                        value={selectedCoordinator.phoneNumber}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">G mail</label>
                      <input
                        type="text"
                        name="area"
                        value={selectedCoordinator.email}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Address</label>
                      <input
                        type="text"
                        name="area"
                        value={selectedCoordinator.address}
                        onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, address: e.target.value })}
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

                        onClick={handleRejectCoordinator || setIsModalOpen(false)}
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
                    <p className="mb-4">Do you want to verify this coordinator?</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded-lg"
                        onClick={handleVerifyCoordinator}
                      >
                        Verify
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                        onClick={handleRejectCoordinator}
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

export default CoordinatorDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import AdminIcon from '../assets/logo.png'; // Update the path as necessary
import SuccessIcon from '../assets/successicon.png';
import DeleteIcon from '../assets/deleteicon.png';
import FailureIcon from '../assets/Failedicon.png';

const CoordinatorDashboard = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [deliveredFoods, setDeliveredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [foodQuantity, setFoodQuantity] = useState(0);
  const [availableVolunteers, setAvailableVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [autoSelectedBeneficiaries, setAutoSelectedBeneficiaries] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [showProfile, setShowProfile] = useState(false); // Profile visibility state
  const [CoordinatorDetails, setCoordinatorDetails] = useState({
    name: '',
    fatherName: '',
    cnic: '',
    role: '',
    email: ''  // Initialize email to prevent undefined error
  });

  const navigate = useNavigate();
  const location = useLocation(); // Add this to track the current location

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTotalBeneficiaries();
      fetchDeliveredFoods();
      fetchAvailableVolunteers();
    }
  }, []);

  const fetchTotalBeneficiaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/volunteer/filtered-beneficiaries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries: ', error);
    }
  };

  const fetchDeliveredFoods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/volunteer/delivered-foods', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeliveredFoods(response.data);
    } catch (error) {
      console.error('Error fetching delivered foods: ', error);
    }
  };

  const fetchAvailableVolunteers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/volunteer/available-volunteers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAvailableVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers: ', error);
    }
  };

  useEffect(() => {
    if (selectedFood && foodQuantity > 0) {
      const shuffledBeneficiaries = [...beneficiaries].sort(() => 0.5 - Math.random());
      let selectedBeneficiaries = [];
      let totalAllocatedFood = 0;

      for (let beneficiary of shuffledBeneficiaries) {
        if (totalAllocatedFood + beneficiary.allocatedFood <= foodQuantity) {
          selectedBeneficiaries.push(beneficiary);
          totalAllocatedFood += beneficiary.allocatedFood;
        }
        if (totalAllocatedFood >= foodQuantity) {
          break;
        }
      }

      setAutoSelectedBeneficiaries(selectedBeneficiaries);
    }
  }, [selectedFood, foodQuantity, beneficiaries]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/volunteer/allocate-food',
        {
          foodId: selectedFood,
          volunteerId: selectedVolunteer
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status === 200) {
        fetchTotalBeneficiaries();
        fetchDeliveredFoods();
        setAutoSelectedBeneficiaries(response.data.selectedBeneficiaries);
        setSelectedFood('');
        setFoodQuantity(0);
        setSelectedVolunteer('');
        setIsSuccess(true);
        setAlertMessage('Allocation Successful');
      }
    } catch (error) {
      console.error('Error allocating food: ', error);
      setIsSuccess(false);
      setAlertMessage('Allocation Failed');
    }
    setShowAlert(true);
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
    <div className="min-h-screen bg-white text-[#111111] flex">
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

      {/* Sidebar */}
      <aside className="w-64 bg-[#000000] text-[#ffffff] min-h-screen shadow-md flex-shrink-0">
        <div className="px-4 py-4">
          <img className="w-22" src={AdminIcon} alt="Admin Icon" />
          <h1 className="text-2xl font-bold">Coordinator Panel</h1>
        </div>
        <p className="text-base pl-4 font-bold"><strong>Menu</strong></p>
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
            </li>
            <li>
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
      <div className="flex-grow flex flex-col bg-white text-[#111111] p-10">
        <h1 className="text-2xl font-bold mb-6">Coordinator Dashboard</h1>

        {/* Food and Beneficiary Selection */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 shadow-md rounded-lg flex flex-col flex-grow">
          {/* Food Selection */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Select Food (Delivered):</label>
            <select
              value={selectedFood}
              onChange={(e) => {
                setSelectedFood(e.target.value);
                const food = deliveredFoods.find((f) => f._id === e.target.value);
                setFoodQuantity(food ? food.quantity : 0);
              }}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              required
            >
              <option value="">Select a food</option>
              {deliveredFoods.map((food) => (
                <option key={food._id} value={food._id}>
                  {food.nameFood}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-selected Beneficiaries */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Auto-selected Beneficiaries:</label>
            <p className="mb-2 text-gray-700">Selected {autoSelectedBeneficiaries.length} Beneficiaries</p>
            <ul className="list-disc pl-6">
              {autoSelectedBeneficiaries.map((beneficiary) => (
                <li key={beneficiary._id}>
                  {beneficiary.name} (Allocated Food: {beneficiary.allocatedFood})
                </li>
              ))}
            </ul>
          </div>

          {/* Volunteer Selection */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Select Volunteer:</label>
            <select
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              required
            >
              <option value="">Select a volunteer</option>
              {availableVolunteers.map((volunteer) => (
                <option key={volunteer._id} value={volunteer._id}>
                  {volunteer.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#5cccf1] hover:bg-[#45b8db] text-white px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>

        {/* Alert Modal */}
        {showAlert && (
          <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
              <div className="mb-4">
                <img
                  src={isSuccess ? SuccessIcon : FailureIcon}
                  alt={isSuccess ? 'Success' : 'Failure'}
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
    </div>
  );

};

export default CoordinatorDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CoordinatorDashboard = () => {
//   const [beneficiaries, setBeneficiaries] = useState([]);
//   const [deliveredFoods, setDeliveredFoods] = useState([]);
//   const [selectedFood, setSelectedFood] = useState('');
//   const [foodQuantity, setFoodQuantity] = useState(0);
//   const [availableVolunteers, setAvailableVolunteers] = useState([]);
//   const [selectedVolunteer, setSelectedVolunteer] = useState('');
//   const [autoSelectedBeneficiaries, setAutoSelectedBeneficiaries] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchTotalBeneficiaries();
//       fetchDeliveredFoods();
//       fetchAvailableVolunteers();
//     }
//   }, []);

//   // Fetch beneficiaries
//   const fetchTotalBeneficiaries = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/volunteer/filtered-beneficiaries', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setBeneficiaries(response.data);
//     } catch (error) {
//       console.error("Error fetching beneficiaries: ", error);
//     }
//   };

//   // Fetch delivered foods
//   const fetchDeliveredFoods = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/volunteer/delivered-foods', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setDeliveredFoods(response.data);
//     } catch (error) {
//       console.error("Error fetching delivered foods: ", error);
//     }
//   };

//   // Fetch available volunteers
//   const fetchAvailableVolunteers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/volunteer/available-volunteers', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setAvailableVolunteers(response.data);
//     } catch (error) {
//       console.error("Error fetching volunteers: ", error);
//     }
//   };

//   // Auto-select beneficiaries based on allocatedFood
//   useEffect(() => {
//     if (selectedFood && foodQuantity > 0) {
//       const shuffledBeneficiaries = [...beneficiaries].sort(() => 0.5 - Math.random());
//       let selectedBeneficiaries = [];
//       let totalAllocatedFood = 0;

//       for (let beneficiary of shuffledBeneficiaries) {
//         if (totalAllocatedFood + beneficiary.allocatedFood <= foodQuantity) {
//           selectedBeneficiaries.push(beneficiary);
//           totalAllocatedFood += beneficiary.allocatedFood;
//         }
//         if (totalAllocatedFood >= foodQuantity) {
//           break;
//         }
//       }

//       setAutoSelectedBeneficiaries(selectedBeneficiaries);
//     }
//   }, [selectedFood, foodQuantity, beneficiaries]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/volunteer/allocate-food', {
//         foodId: selectedFood,
//         volunteerId: selectedVolunteer,
//       }, {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });

//       // If allocation was successful, update the beneficiaries list and show success alert
//       if (response.status === 200) {
//         // Refresh data after allocation
//         fetchTotalBeneficiaries();
//         fetchDeliveredFoods();

//         // Set the selected beneficiaries to the ones returned by the backend
//         setAutoSelectedBeneficiaries(response.data.selectedBeneficiaries);

//         // Reset the food and volunteer selection
//         setSelectedFood('');
//         setFoodQuantity(0);
//         setSelectedVolunteer('');

//         alert("Allocation Successful");
//       }
//     } catch (error) {
//       console.error("Error allocating food: ", error);
//       alert("Allocation Failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-5">
//       <h1 className="text-2xl font-bold mb-4">Coordinator Dashboard</h1>

//       {/* Food and Beneficiary Selection */}
//       <form onSubmit={handleSubmit}>
//         {/* Food Selection */}
//         <div className="mb-4">
//           <label>Select Food (Delivered):</label>
//           <select
//             value={selectedFood}
//             onChange={(e) => {
//               setSelectedFood(e.target.value);
//               const food = deliveredFoods.find(f => f._id === e.target.value);
//               setFoodQuantity(food ? food.quantity : 0);
//             }}
//             className="w-full px-3 py-2 border rounded"
//             required
//           >
//             <option value="">Select a food</option>
//             {deliveredFoods.map((food) => (
//               <option key={food._id} value={food._id}>
//                 {food.nameFood}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Auto-selected Beneficiaries */}
//         <div className="mb-4">
//           <label>Auto-selected Beneficiaries:</label>

//           {/* Beneficiary count display */}
//           <p className="mb-2">Selected {autoSelectedBeneficiaries.length} Beneficiaries</p>

//           <ul className="list-disc pl-5">
//             {autoSelectedBeneficiaries.map((beneficiary) => (
//               <li key={beneficiary._id}>{beneficiary.name} (Allocated Food: {beneficiary.allocatedFood})</li>
//             ))}
//           </ul>
//         </div>

//         {/* Volunteer Selection */}
//         <div className="mb-4">
//           <label>Select Volunteer:</label>
//           <select
//             value={selectedVolunteer}
//             onChange={(e) => setSelectedVolunteer(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             required
//           >
//             <option value="">Select a volunteer</option>
//             {availableVolunteers.map((volunteer) => (
//               <option key={volunteer._id} value={volunteer._id}>
//                 {volunteer.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default CoordinatorDashboard;

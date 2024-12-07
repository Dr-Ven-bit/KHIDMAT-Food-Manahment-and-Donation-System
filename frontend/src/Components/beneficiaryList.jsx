import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png';
import DeleteIcon from '../assets/deleteicon.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const BeneficiariesList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
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
      fetchBeneficiaries();
    }
  }, []);

  useEffect(() => {
    setFilteredBeneficiaries(
      beneficiaries.filter(beneficiary =>
        beneficiary.cnic.includes(searchTerm) ||
        beneficiary.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, beneficiaries]);

  const fetchBeneficiaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/coordinator/beneficiaries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      setBeneficiaries([]);
    }
  };

  const handleDeleteBeneficiary = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/coordinator/beneficiaries/remove/${selectedBeneficiary._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage('Beneficiary removed successfully');
      setIsSuccess(true);
      fetchBeneficiaries();
    } catch (error) {
      console.error('Error removing beneficiary:', error);
      setAlertMessage('Failed to remove beneficiary. Please try again.');
      setIsSuccess(false);
    } finally {
      setShowAlert(true);
      setIsModalOpen(false);
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
          <h1 className="text-2xl font-bold">Beneficiaries List</h1>
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
                  <th className="py-2 px-4 text-left">Phone Number</th>
                  <th className="py-2 px-4 text-left">Family Size</th>
                  <th className="py-2 px-4 text-left">Family Income</th>
                  <th className="py-2 px-4 text-left">Family Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.length > 0 ? (
                  filteredBeneficiaries.map((beneficiary, index) => (
                    <tr key={beneficiary._id}>
                      <td className="py-2 px-4 border text-center">{index + 1}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.name}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.fatherName}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.cnic}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.phoneNumber}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.familySize}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.familyIncome}</td>
                      <td className="py-2 px-4 border text-center">{beneficiary.status}</td>
                      <td className="py-2 px-4 border text-center">
                        <button
                          className="text-red-500 hover:text-red-700 transition-all"
                          onClick={() => {
                            setSelectedBeneficiary(beneficiary);
                            setIsModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No beneficiaries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Delete Confirmation */}
          {isModalOpen && selectedBeneficiary && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
                <p className="mb-4">Are you sure you want to delete this beneficiary?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                    onClick={handleDeleteBeneficiary}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert */}
          {showAlert && (
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 mt-4 rounded-lg shadow-md ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="flex items-center">
                <img src={isSuccess ? SuccessIcon : FailureIcon} alt="Alert Icon" className="mr-2" />
                <span>{alertMessage}</span>
              </div>
              <button
                className="ml-auto text-lg font-bold"
                onClick={() => setShowAlert(false)}
              >
                &times;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BeneficiariesList;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import AdminIcon from '../assets/logo.png';
// import SuccessIcon from '../assets/successicon.png';
// import FailureIcon from '../assets/Failedicon.png';

// const BeneficiariesList = () => {
//   const [beneficiaries, setBeneficiaries] = useState([]);
//   const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchBeneficiaries();
//     }
//   }, []);

//   useEffect(() => {
//     setFilteredBeneficiaries(
//       beneficiaries.filter(beneficiary =>
//         beneficiary.cnic.includes(searchTerm) ||
//         beneficiary.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, beneficiaries]);

//   const fetchBeneficiaries = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/coordinator/beneficiaries', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setBeneficiaries(response.data);
//     } catch (error) {
//       console.error('Error fetching beneficiaries:', error);
//       setBeneficiaries([]);
//     }
//   };

//   const handleDeleteBeneficiary = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/coordinator/beneficiaries/remove/${selectedBeneficiary._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlertMessage('Beneficiary removed successfully');
//       setIsSuccess(true);
//       fetchBeneficiaries();
//     } catch (error) {
//       console.error('Error removing beneficiary:', error);
//       setAlertMessage('Failed to remove beneficiary. Please try again.');
//       setIsSuccess(false);
//     } finally {
//       setShowAlert(true);
//       setIsModalOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-white text-[#111111] relative">
//       <button
//         className="bg-[#5cccf1] hover:bg-[#45b8db] transition-all text-white mb-5 px-4 py-2 rounded-md absolute top-5 right-5 shadow-md"
//         onClick={handleLogout}
//       >
//         Logout
//       </button>
//       <div className="flex">
//         <aside className="w-64 bg-[#000000] text-[#ffffff] min-h-screen shadow-md flex-shrink-0">
//           <div className="px-4 py-4">
//             <img className="w-22" src={AdminIcon} alt="Admin Icon" />
//             <h1 className="text-2xl font-bold">Coordinator Panel</h1>
//           </div>
//           <p className="text-base pl-4 font-bold"><strong>Menu</strong></p>
//           <nav className="px-4">
//             <ul>
//               <li className="mb-3">
//                 <Link
//                   to="/coordinator-dashboard"
//                   className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator-dashboard'
//                     ? 'bg-slate-50 text-black'
//                     : 'hover:bg-[#5cccf1] hover:text-white'
//                     }`}
//                 >
//                   DashBoard
//                 </Link>
//               </li>
//               <li className="mb-3">
//                 <Link
//                   to="/coordinator/check-food-list"
//                   className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/check-food-list'
//                     ? 'bg-white text-black'
//                     : 'hover:bg-[#5cccf1] hover:text-white'
//                     }`}
//                 >
//                   Check Food List
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/coordinator/allocation-beneficiaries"
//                   className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/allocation-beneficiaries'
//                     ? 'bg-white text-black'
//                     : 'hover:bg-[#5cccf1] hover:text-white'
//                     }`}
//                 >
//                   Allocation Beneficiaries
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/coordinator/Beneficiaries-List"
//                   className={`flex items-center p-3 rounded-lg transition-all ${location.pathname === '/coordinator/Beneficiaries-List'
//                     ? 'bg-white text-black'
//                     : 'hover:bg-[#5cccf1] hover:text-white'
//                     }`}
//                 >
//                   Beneficiaries List
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>
//         {/* Main Content */}
//         <main className="flex-1 p-10">
//           <h1 className="text-2xl font-bold">Coordinator</h1>
//           <input
//             type="text"
//             placeholder="Search by CNIC, Area or Name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-3 border rounded-lg my-6 shadow-sm"
//           />
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-[#000000] text-white">
//                   <th className="py-2 px-4 text-left">Sr.No</th>
//                   <th className="py-2 px-4 text-left">Name</th>
//                   <th className="py-2 px-4 text-left">Father Name</th>
//                   <th className="py-2 px-4 text-left">CNIC</th>
//                   <th className="py-2 px-4 text-left">Phone Number</th>
//                   <th className="py-2 px-4 text-left">family Size</th>
//                   <th className="py-2 px-4 text-left">Family Income</th>
//                   <th className="py-2 px-4 text-left">Family Status</th>
//                   <th className="py-2 px-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBeneficiaries.length > 0 ? (
//                   filteredBeneficiaries.map((beneficiary, index) => (
//                     <tr key={beneficiary._id}>
//                       <td className="py-2 px-4 border text-center">{index + 1}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.name}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.fatherName}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.cnic}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.phoneNumber}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.familySize}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.familyIncome}</td>
//                       <td className="py-2 px-4 border text-center">{beneficiary.status}</td>
//                       <td className="py-2 px-4 border text-center">
//                         <button
//                           className="text-red-500 hover:text-red-700"
//                           onClick={() => {
//                             setSelectedBeneficiary(beneficiary);
//                             setIsModalOpen(true);
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4">
//                       No beneficiaries found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {isModalOpen && selectedBeneficiary && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//               <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
//                 <p className="mb-4">Are you sure you want to delete this beneficiary?</p>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     className="bg-red-500 text-white py-2 px-4 rounded-lg"
//                     onClick={handleDeleteBeneficiary}
//                   >
//                     Yes
//                   </button>
//                   <button
//                     className="bg-gray-500 text-white py-2 px-4 rounded-lg"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     No
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {showAlert && (
//             <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
//               <div className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
//                 <div className="mb-4">
//                   <img
//                     src={isSuccess ? SuccessIcon : FailureIcon}
//                     alt={isSuccess ? "Success" : "Failure"}
//                     className="mx-auto mb-2 w-16 h-16"
//                   />
//                   <p>{alertMessage}</p>
//                 </div>
//                 <button
//                   className="bg-blue-500 text-white py-2 px-4 rounded-md"
//                   onClick={() => setShowAlert(false)}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default BeneficiariesList;

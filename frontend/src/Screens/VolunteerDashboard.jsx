import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import DeleteIcon from '../assets/deleteicon.png';
import AdminIcon from '../assets/logo.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const VolunteerDashboard = () => {
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const [beneficiary, setBeneficiary] = useState({
    name: '',
    fatherName: '',
    cnic: '',
    phoneNumber: '',
    address: '',
    isChecked: false,
    familySize: '',
    status: 'pending',
    isUpdated: false,
    isAllocated: "",
    allocatedFood: 0,
    familyIncome:0
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary((prevBeneficiary) => ({
      ...prevBeneficiary,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/volunteer', beneficiary, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setBeneficiary({
        name: '',
        fatherName: '',
        cnic: '',
        phoneNumber: '',
        address: '',
        isChecked: false,
        familySize: '',
        status: 'pending',
        isUpdated: false,
        isAllocated: "",
        allocatedFood: 0,
        familyIncome:0
      });
      setAlertMessage('Beneficiary added successfully!');
      setIsSuccess(true);
    } catch (error) {
      setAlertMessage('Failed to add beneficiary');
      setIsSuccess(false);
    } finally {
      setShowAlert(true);
    }
  };




  // Fetch coordinator details when showProfile is true
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
    <div className="min-h-screen bg-white text-[#111111] relative flex">

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
      <div className="flex-grow flex flex-col bg-white text-[#111111] p-10">
        <h1 className="text-2xl font-bold mb-6">Add Beneficiary</h1>

        {/* <form onSubmit={handleSubmit} className="bg-gray-50 p-6 shadow-md rounded-lg flex flex-col flex-grow">
          {/* Input Fields 
          {['name', 'fatherName', 'cnic', 'phoneNumber', 'address', 'familySize','familyIncome'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block font-bold mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input
                type="text"
                name={field}
                value={beneficiary[field]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
          ))}
          {/* Submit Button 
          <button
            type="submit"
            className="bg-[#5cccf1] hover:bg-[#45b8db] text-white px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg"
          >
            Add Beneficiary
          </button>
        </form> */}

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 shadow-md rounded-lg flex flex-col flex-grow">
          {/* Input Fields */}
          {['name', 'fatherName', 'cnic', 'phoneNumber', 'address', 'familySize', 'familyIncome'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block font-bold mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>

              {/* Name & Father Name - Alphabet only */}
              {(field === 'name' || field === 'fatherName') && (
                <input
                  type="text"
                  name={field}
                  value={beneficiary[field]}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphabet characters
                    handleChange({ target: { name: field, value } });
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
                  value={beneficiary.cnic}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 13); // Numeric only, limit to 13 digits
                    handleChange({ target: { name: 'cnic', value } });
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
                  value={beneficiary[field]}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11); // Numeric only, limit to 11 digits
                    handleChange({ target: { name: field, value } });
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
                  value={beneficiary.address}
                  onChange={handleChange} // No special validation required for address
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm"
                />
              )}

              {/* Family Size - Numeric only, max 19 */}
              {field === 'familySize' && (
                <input
                  type="text"
                  name="familySize"
                  value={beneficiary.familySize}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Numeric only
                    if (parseInt(value) <= 19 || value === '') { // Ensure value is <= 19
                      handleChange({ target: { name: 'familySize', value } });
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
                  value={beneficiary.familyIncome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Numeric only
                    if (parseInt(value) <= 99999 || value === '') { // Ensure value is <= 19
                      handleChange({ target: { name: 'familyIncome', value } });
                    }
                  }}
                  maxLength="5"
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm"
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#5cccf1] hover:bg-[#45b8db] text-white px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg"
          >
            Add Beneficiary
          </button>
        </form>


        {/* Alert Modal */}
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
    </div>
  );
};

export default VolunteerDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link, useLocation } from 'react-router-dom';

// const VolunteerDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const [beneficiary, setBeneficiary] = useState({
//     name: '', 
//     fatherName: '',
//     cnic: '',
//     phoneNumber: '',
//     address: '',
//     area: '',
//     isChecked: false,//for edit beneficiary
//     familySize: '',
//     status: 'pending',
//     isUpdated: false,
//     isAllocated: "",
//     allocatedFood: 0,
//   });

//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setBeneficiary((prevBeneficiary) => ({
//       ...prevBeneficiary,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/volunteer', beneficiary, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       setBeneficiary({
//         name: '',
//         fatherName: '',
//         cnic: '',
//         phoneNumber: '',
//         address: '',
//         area: '',
//         isChecked: false,//for edit beneficiary
//         familySize: '',
//         status: 'pending',
//         isUpdated: false,
//         isAllocated: "",
//         allocatedFood: 0,
//       });
//       setAlertMessage('Beneficiary added successfully!');
//       setIsSuccess(true);
//     } catch (error) {
//       setAlertMessage('Failed to add beneficiary');
//       setIsSuccess(false);
//     } finally {
//       setShowAlert(true);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 relative">
//       <button
//         className="bg-gray-400 text-white mb-5 px-2 rounded-md absolute top-0 right-0"
//         onClick={handleLogout}
//       >
//         Logout
//       </button>
//       <div className="flex">
//         <aside className="w-64 bg-gray-800 text-white min-h-screen">
//           <div className="px-10 py-5">
//             <h1 className="text-xl text-center font-bold text-white mt-2">Volunteer Panel</h1>
//           </div>
//           <nav className="p-4">
//             <ul>
//               <li className="mb-2">
//                 <p className="text-sm mb-1">Menu</p>
//                 <Link
//                   to="/volunteer-dashboard"
//                   className={`flex items-center p-2 rounded ${location.pathname === '/volunteer-dashboard' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                 >
//                   <span className="ml-2">Dashboard</span>
//                 </Link>
//                 <Link
//                   to="/volunteer/edit-beneficiary"
//                   className={`flex items-center p-2 rounded ${location.pathname === '/volunteer/edit-beneficiary' ? 'bg-white text-black' : 'hover:bg-gray-700'}`}
//                 >
//                   <span className="ml-2">Edit Beneficiary</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         <main className="flex-1 p-8">
//           <div className="bg-white p-8 rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-6 text-center">Add Beneficiary</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={beneficiary.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Father Name:</label>
//                 <input
//                   type="text"
//                   name="fatherName"
//                   value={beneficiary.fatherName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">CNIC:</label>
//                 <input
//                   type="text"
//                   name="cnic"
//                   value={beneficiary.cnic}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Phone Number:</label>
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   value={beneficiary.phoneNumber}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Address:</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={beneficiary.address}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Area:</label>
//                 <input
//                   type="text"
//                   name="area"
//                   value={beneficiary.area}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"  
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Family Size:</label>
//                 <input
//                   type="text"
//                   name="familySize"
//                   value={beneficiary.familySize}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
//                 Add Beneficiary
//               </button>
//             </form>
//           </div>

//           {showAlert && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//               <div className="bg-white p-8 rounded shadow-md w-1/3 text-center">
//                 <p>{alertMessage}</p>
//                 <button
//                   className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
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

// export default VolunteerDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminIcon from '../assets/logo.png';
import DeleteIcon from '../assets/deleteicon.png';
import SuccessIcon from '../assets/successicon.png';
import FailureIcon from '../assets/Failedicon.png';

const CheckPayments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      fetchPayments();
    }
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPopup(true); // Show popup with payment details
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/admin/payments/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(payments.map(payment => payment._id === id ? { ...payment, status } : payment));
      setAlertMessage('Payment status updated successfully');
      setIsSuccess(true);
      setShowAlert(true);
      setShowPopup(false); // Close popup after updating status
    } catch (error) {
      console.error('Error updating payment status:', error);
      setAlertMessage('Failed to update payment status. Please try again.');
      setIsSuccess(false);
      setShowAlert(true);
    }
  };

  // const handleDownloadScreenshot = (url) => {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', 'screenshot.png');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

//   const handleDownloadScreenshot = (url, filename) => {
//     const link = document.createElement('a');
//     link.href = url;

//     // Use the filename passed from the backend or fall back to a default name
//     const fileNameToDownload = filename ? filename : 'screenshot.png';
//     link.setAttribute('download', fileNameToDownload);
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };
  const handleDownloadScreenshot = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;

    // Use the original filename provided by the backend
    const fileNameToDownload = filename ? filename : 'screenshot.png';
    link.setAttribute('download', fileNameToDownload); // Ensure the file is set to download

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link after triggering the download
    document.body.removeChild(link);
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

        {/* Main content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Check Payments</h1>
          <input
            type="text"
            placeholder="Search by Sponsor Name or Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg my-4"
          />
          <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#000000] text-white">
                <th className="border border-gray-300 px-4 py-2">Sr.No</th>
                <th className="border border-gray-300 px-4 py-2">Sponsor Name</th>
                <th className="border border-gray-300 px-4 py-2">Donor Phone Number</th>
                <th className='border border-gray-300 px-4 py-2'>Account Type</th>
                <th className="border border-gray-300 px-4 py-2">Transfer Name</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.filter(payment =>
                payment.sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.sponsor.phoneNumber.includes(searchTerm)
              ).map((payment, index) => (
                <tr key={payment._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.sponsor.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.donorPhoneNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.accountType}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.transferName}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleViewDetails(payment)}
                    >
                      Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Payment Details Popup */}
          {showPopup && selectedPayment && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                <p><strong>Sponsor Name:</strong> {selectedPayment.sponsor.name}</p>
                <p><strong>Amount:</strong> {selectedPayment.amount}</p>

                <p><strong>Transfer Name:</strong> {selectedPayment.transferName}</p>
                <p><strong>Transfer Phone Name:</strong> {selectedPayment.donorPhoneNumber}</p>
                <p><strong>Account Type:</strong> {selectedPayment.accountType}</p>
                
                <p><strong>Status:</strong> {selectedPayment.status}</p>
                <p>
                  <strong>Screenshot:</strong>
                  <button
                    onClick={() => handleDownloadScreenshot(selectedPayment.screenshotUrl, selectedPayment.filename)}
                    className="text-blue-500"
                  >
                    Download
                  </button>
                </p>


                <div className="flex mt-4">
                  <button onClick={() => handleUpdateStatus(selectedPayment._id, 'received')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Mark as Received</button>
                  <button onClick={() => handleUpdateStatus(selectedPayment._id, 'not received')} className="bg-red-500 text-white px-4 py-2 rounded">Mark as Not Received</button>
                  <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Alert Message */}
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
        </main>
      </div>
    </div>
  );


};

export default CheckPayments;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CheckPayments = () => {
//   const [payments, setPayments] = useState([]);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/admin/payments');
//         setPayments(response.data);
//       } catch (error) {
//         console.error('Error fetching payments:', error);
//       }
//     };
//     fetchPayments();
//   }, []);

//   const handleViewDetails = (payment) => {
//     setSelectedPayment(payment);
//     setShowPopup(true); // Show popup with payment details
//   };

//   const handleUpdateStatus = async (id, status) => {
//     try {
//       await axios.patch(`http://localhost:5000/admin/payments/${id}/status`, { status });
//       setPayments(payments.map(payment => payment._id === id ? { ...payment, status } : payment));
//       setShowPopup(false); // Close popup after updating status
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//     }
//   };

//   const handleDownloadScreenshot = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'screenshot.png');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Check Payments</h1>
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 px-4 py-2">Sponsor Name</th>
//             <th className="border border-gray-300 px-4 py-2">Transfer Name</th>
//             <th className="border border-gray-300 px-4 py-2">Phone Number</th>
//             <th className="border border-gray-300 px-4 py-2">Status</th>
//             <th className="border border-gray-300 px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.map((payment) => (
//             <tr key={payment._id}>
//               <td className="border border-gray-300 px-4 py-2">{payment.sponsor.name}</td>
//               <td className="border border-gray-300 px-4 py-2">{payment.transferName}</td>
//               <td className="border border-gray-300 px-4 py-2">{payment.sponsor.phoneNumber}</td>
//               <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
//               <td className="border border-gray-300 px-4 py-2">
//                 <button
//                   className="bg-blue-500 text-white px-2 py-1 rounded"
//                   onClick={() => handleViewDetails(payment)}
//                 >
//                   Check
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showPopup && selectedPayment && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-2">Payment Details</h2>
//             <p><strong>Sponsor Name:</strong> {selectedPayment.sponsor.name}</p>
//             <p><strong>Transfer Name:</strong> {selectedPayment.transferName}</p>
//             <p><strong>Donor Phone Number:</strong> {selectedPayment.sponsor.phoneNumber}</p>
//             <p><strong>Status:</strong> {selectedPayment.status}</p>

//             {selectedPayment.screenshot && (
//               <div className="mt-4">
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                   onClick={() => handleDownloadScreenshot(selectedPayment.screenshot)}
//                 >
//                   Download Screenshot
//                 </button>
//               </div>
//             )}

//             <div className="mt-4">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//                 onClick={() => handleUpdateStatus(selectedPayment._id, 'received')}
//               >
//                 Mark as Received
//               </button>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//                 onClick={() => handleUpdateStatus(selectedPayment._id, 'not received')}
//               >
//                 Mark as Not Received
//               </button>
//             </div>

//             <button
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={() => setShowPopup(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckPayments;

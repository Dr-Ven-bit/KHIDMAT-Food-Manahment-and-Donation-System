import React, { useState,useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '../assets/deleteicon.png';

const AddFoodForm = () => {
    const [foodEntries, setFoodEntries] = useState([{ foodName: '', quantity: '' }]);
    const [showProfile, setShowProfile] = useState(false); // Profile visibility state
    const [foodProviderDetails, setfoodProviderDetails] = useState({
        name: '',
        fatherName: '',
        cnic: '',
        role: '',
        email: ''  // Initialize email to prevent undefined error
    });

    const handleInputChange = (index, event) => {
        const values = [...foodEntries];
        values[index][event.target.name] = event.target.value;
        setFoodEntries(values);
    };

    const handleAddMore = () => {
        setFoodEntries([...foodEntries, { foodName: '', quantity: '' }]);
    };

    const handleRemoveEntry = (index) => {
        const values = [...foodEntries];
        values.splice(index, 1);
        setFoodEntries(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to add food.');
                return;
            }

            await axios.post('http://localhost:5000/food-provider/add-food', { foodEntries }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert('Food entries added successfully!');
        } catch (error) {
            console.error('Error adding food entries:', error);
            alert('Failed to add food entries');
        }
    };
    
    useEffect(() => {
        if (showProfile) {
            fetchfoodProviderDetails();
        }
    }, [showProfile]);

    const fetchfoodProviderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/food-provider/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setfoodProviderDetails(response.data.foodprovider);  // Access the 'coordinator' object from the response
            console.log(response.data.foodprovider);
        } catch (error) {
            console.error('Error fetching foodprovider details:', error);
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
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
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
                        <p><strong>Name:</strong> {foodProviderDetails?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {foodProviderDetails?.email || 'N/A'}</p>
                        <p><strong>CNIC:</strong> {foodProviderDetails?.cnic || 'N/A'}</p>
                        <p><strong>Role:</strong> {foodProviderDetails?.role || 'N/A'}</p>
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
            <h2 className="text-2xl font-bold mb-4">Add Food</h2>
            <form onSubmit={handleSubmit}>
                {foodEntries.map((entry, index) => (
                    <div key={index} className="mb-4">
                        <input
                            type="text"
                            name="foodName"
                            placeholder="Food Name"
                            value={entry.foodName}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-alphabetic characters
                                handleInputChange(index, { target: { name: 'foodName', value } });  // Update the form data for the specific entry
                            }}
                            className="w-full mb-2 p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity in KG"
                            value={entry.quantity}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full mb-2 p-2 border border-gray-300 rounded"
                            required
                        />
                        {foodEntries.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveEntry(index)}
                                className="text-red-500 text-sm"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}


                <button
                    type="button"
                    onClick={handleAddMore}
                    className="bg-green-500 text-white p-2 mb-4 rounded hover:bg-green-700"
                >
                    Add More
                </button>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
          
        </div>
    );
};

export default AddFoodForm;

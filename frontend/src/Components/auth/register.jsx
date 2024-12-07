
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../assets/images/background.jpg';

const Register = () => {

  const [role, setRole] = useState('volunteer'); // default role
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,  // This will update formData with input values
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    alert('Form is being submitted');

    console.log('Form Data:', formData);
    console.log('Role:', role);
    console.log('Email:', formData.email); 

    try {
      const response = await axios.post('http://localhost:5000/auth/register', { ...formData, role });

      console.log('Email:', formData.email);  // Should log the correct email
      console.log('Role:', role);             // Should log the correct role

      // Navigate to OTP verification page with email and role
      // navigate('/otp-verification', { state: { email: formData.email, role } });
      navigate('/verify-otp', { state: { email: formData.email, role: role } });
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const renderForm = () => {
    const genderOptions = (
      <select name="gender" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    );

    switch (role) {
      case 'volunteer':
        return (
          <>
            <input
              name="name"
              placeholder="Name"
              onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                e.target.value = value; // Explicitly update the input's value in the UI
                handleInputChange({ target: { name: 'name', value } });  // Update the form data with the limited value
              }}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="fatherName" placeholder="Father's Name"
              onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                e.target.value = value; // Explicitly update the input's value in the UI
                handleInputChange({ target: { name: 'fatherName', value } });  // Update the form data with the limited value
              }}
              required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />

            <input
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                e.target.value = value;
                handleInputChange({ target: { name: 'phoneNumber', value } });  // Update the form data with the limited value
              }}
              onInput={(e) => e.target.value = e.target.value.slice(0, 11)}

            
              required
              inputMode="numeric"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" // Input styling
            />

            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            {genderOptions}
            <input type="number"
              name="cnic"
              placeholder="CNIC"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              onChange={handleInputChange}

              onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
              required inputMode="numeric" className="outline-none w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111] no-arrows" />
            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <select name="area" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]">
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
            <input name="address" placeholder="Address" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />

          </>
        );
      case 'sponsor':
        return (
          <>
            <input name="name" placeholder="Name"
              onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                e.target.value = value; // Explicitly update the input's value in the UI
                handleInputChange({ target: { name: 'name', value } });  // Update the form data with the limited value
              }}
              
              required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input type="number" name="cnic" placeholder="CNIC" onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
              onChange={handleInputChange}
              onInput={(e) => e.target.value = e.target.value.slice(0, 13)} required inputMode="numeric" className="outline-none w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111] no-arrows" />
            <input type='number' name="phoneNumber" placeholder="Phone Number"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              onChange={handleInputChange}
              onInput={(e) => e.target.value = e.target.value.slice(0, 11)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            {genderOptions}
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />

            <input name="address" placeholder="Address" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
          </>
        );
      case 'foodprovider':
        return (
          <>
            <input name="name" placeholder="Name"
              onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                e.target.value = value; // Explicitly update the input's value in the UI
                handleInputChange({ target: { name: 'name', value } });  // Update the form data with the limited value
              }}
              required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input type="number" name="cnic" placeholder="CNIC"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              
              onChange={handleInputChange} onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
              required inputMode="numeric" className="outline-none w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111] no-arrows" />
            <input type='number' name="phoneNumber" placeholder="Phone Number"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              onChange={handleInputChange} onInput={(e) => e.target.value = e.target.value.slice(0, 11)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            {genderOptions}
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <input name="restorantName" placeholder="Restaurant Name"

              
              onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-numeric characters
                e.target.value = value; // Explicitly update the input's value in the UI
                handleInputChange({ target: { name: 'restorantName', value } });  // Update the form data with the limited value
              }}
              
              
              required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />            
{/* <input name="restaurantName" placeholder="Restaurant Name" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" /> */}
            <input name="restaurantAddress" placeholder="Restaurant Address" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]" />
            <select name="area" onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5cccf1] text-[#111111] placeholder:text-[#111111]">
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#111111] mb-6">Register as {role}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex justify-center mb-4">
          <label className="mr-4">
            <input type="radio" value="volunteer" checked={role === 'volunteer'} onChange={handleRoleChange} />
            Volunteer
          </label>
          <label className="mr-4">
            <input type="radio" value="sponsor" checked={role === 'sponsor'} onChange={handleRoleChange} />
            Sponsor 
          </label>
          <label className="mr-4">
            <input type="radio" value="foodprovider" checked={role === 'foodprovider'} onChange={handleRoleChange} />
            Food Provider
          </label>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <button
            type="submit"
            className="w-full py-2 bg-[#5cccf1] text-[#111111] rounded-md hover:bg-[#48b4dc] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5cccf1]"
          >
            Register
          </button>
        </form>

        <a href="/login" className="text-[#5cccf1] hover:underline ml-2 transition duration-200 ease-in-out">
        I already have an Khidmat Account
        </a>
      </div>
    </div>
  );
};

export default Register;
// SponsorDashboard.js
import React, { useState } from 'react';
import DonateForm from '../Components/donateForm';
import DonationHistory from '../Components/DonationHistory';


const SponsorDashboard = () => {
  const [view, setView] = useState('donate'); // Default view is donate form

  return (
    <div className="container mx-auto">
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setView('donate')}
          className={`p-2 rounded ${view === 'donate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Donate
        </button>
        <button
          onClick={() => setView('history')}
          className={`p-2 rounded ${view === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Donation History
        </button>
      </div>
      {view === 'donate' && <DonateForm />}
      {view === 'history' && <DonationHistory />}
    </div>
  );
};

export default SponsorDashboard;

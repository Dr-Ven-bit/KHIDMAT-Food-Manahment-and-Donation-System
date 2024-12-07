import React, { useState } from 'react';
import AddFoodForm from '../Components/addFoodForm';
import FoodHistory from '../Components/foodHistory';

const FoodProviderDashboard = () => {
  const [view, setView] = useState('addFood'); // Default view is the Add Food form

  return (
    <div className="container mx-auto">
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setView('addFood')}
          className={`p-2 rounded ${view === 'addFood' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Add Food
        </button>
        <button
          onClick={() => setView('history')}
          className={`p-2 rounded ${view === 'history' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Food History
        </button>
      </div>
      {view === 'addFood' && <AddFoodForm />}
      {view === 'history' && <FoodHistory />}
    </div>
  );
};

export default FoodProviderDashboard;

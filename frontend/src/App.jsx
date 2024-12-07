import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/auth/Login';
import ForgotPassword from './Components/auth/forgotPassword';
import AdminDashboard from './screens/AdminDashboard';
import CoordinatorDashboard from './screens/CoordinatorDashboard';
import FoodProviderDashboard from './screens/FoodProviderDashboard';
import SponsorDashboard from './Screens/SponsorDashboard';
import DonationHistory from './Components/DonationHistory';

import VolunteerDashboard from './screens/VolunteerDashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './Components/auth/register';
import VerifyOTP from './Components/auth/otpVerification';
import VerifyFoodProvider from './Components/verifyFoodProvider';
import VerifyPayments from './Components/verifyPayments';
import CheckFoodList from './Components/checkFoodList';
import AllocationBeneficiaries from './Components/allocationBeneficiary';
import EditBeneficiary from './Components/editBeneficiary';
import CollectFood from './Components/colectFood';
import DistributeToBeneficiary from './Components/distributeToBeneficiary';
import BeneficiaryList from './Components/beneficiaryList';

// import DistributedReport from './Components/distributedReport';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/verify-food-provider" element={<PrivateRoute roles={['admin']}><VerifyFoodProvider /></PrivateRoute>} />
        <Route path="/admin/check-payments" element={<PrivateRoute roles={['admin']}><VerifyPayments /></PrivateRoute>} />

        <Route path="/coordinator-dashboard" element={<PrivateRoute roles={['coordinator']}><CoordinatorDashboard /></PrivateRoute>} />
        <Route path="/coordinator/check-food-list" element={<PrivateRoute roles={['coordinator']}><CheckFoodList /></PrivateRoute>} />
        <Route path="/coordinator/allocation-beneficiaries" element={<PrivateRoute roles={['coordinator']}><AllocationBeneficiaries /></PrivateRoute>} />
        <Route path="/coordinator/Beneficiaries-List" element={<PrivateRoute roles={['coordinator']}><BeneficiaryList /></PrivateRoute>} />
        
        <Route path="/foodprovider-dashboard" element={<PrivateRoute roles={['foodprovider']}><FoodProviderDashboard /></PrivateRoute>} />
        <Route path="/sponsor-dashboard" element={<PrivateRoute roles={['sponsor']}><SponsorDashboard /></PrivateRoute>} />
        <Route path="/donation-history" element={<PrivateRoute roles={['sponsor']}><DonationHistory /></PrivateRoute>} />
        
        <Route path="/volunteer-dashboard" element={<PrivateRoute roles={['volunteer']}><VolunteerDashboard /></PrivateRoute>} />
        <Route path="/volunteer/edit-beneficiary" element={<PrivateRoute roles={['volunteer']}><EditBeneficiary /></PrivateRoute>} />
        <Route path="/volunteer/collect-food" element={<PrivateRoute roles={['volunteer']}><CollectFood /></PrivateRoute>} />
        <Route path="/volunteer/distribute-to-beneficiary" element={<PrivateRoute roles={['volunteer']}><DistributeToBeneficiary /></PrivateRoute>} />

      </Routes>
    </Router>
  );
};

export default App;

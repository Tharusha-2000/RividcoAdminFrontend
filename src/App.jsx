// Adminpanel/src/App.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Employees from './pages/Employees.jsx';
import Testimonials from './pages/Testimonials'; 
import ContactRequests from './pages/ContactRequets';
import QuotationRequests from './pages/QuotationRequests.jsx';
import Login from './pages/Login.jsx'; // Import the Login component

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page */}
          <Route path="/dashboard" element={<AdminDashboard />} /> {/* Dashboard page */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contacts" element={<ContactRequests />} />
          <Route path="/quotes" element={<QuotationRequests />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
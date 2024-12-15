// Adminpanel/src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Employees from './pages/Employees.jsx';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path='/employees' element={<Employees />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
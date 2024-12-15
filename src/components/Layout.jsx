// Adminpanel/src/components/Layout.jsx
import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Box
        sx={{
          width: '240px',
          flexShrink: 0,
          position: 'fixed',
          height: '100vh',
          zIndex: 1200,
          backgroundColor: '#ffffff', // Adjust if needed
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          marginLeft: '240px', // Space for the fixed sidebar
          height: '100vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            flexShrink: 0,
            position: 'fixed',
            width: 'calc(100% - 240px)', // Adjust to exclude sidebar width
            zIndex: 1100,
            top: 0,
            backgroundColor: '#1976d2', // Adjust if needed
            color: '#ffffff',
          }}
        >
          <Header />
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px', // Space for the fixed header
            overflowY: 'auto',
            backgroundColor: '', // Adjust background as needed
            height: 'calc(100vh - 64px)', // Remaining height after the header
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

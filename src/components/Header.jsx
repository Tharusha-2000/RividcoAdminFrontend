import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout'; // Import the Logout icon
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png'; // Replace with your logo path

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/'); // Redirect to the login page
      }
    });
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* <img src={Logo} alt="Company Logo" style={{ width: 40, marginRight: 16 }} /> */}
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
        </Box>

        {/* Notifications */}
        <IconButton size="large" aria-label="show new notifications" color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Settings */}
        <IconButton size="large" aria-label="settings" color="inherit">
          <SettingsIcon />
        </IconButton>

        {/* Logout */}
        <IconButton
          size="large"
          edge="end"
          aria-label="logout"
          color="inherit"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
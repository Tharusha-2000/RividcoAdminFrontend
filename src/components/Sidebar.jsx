// Adminpanel/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import logo from '../assets/logo.png';
import PeopleIcon from '@mui/icons-material/People';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#f5f5f5', color: '#333' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <img src={logo} alt="Logo" style={{ width: '80%' }} />
      </Box>
      <List>
        <ListItem button component={Link} to="/" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
          <ListItemIcon sx={{ color: '#333' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/projects" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
          <ListItemIcon sx={{ color: '#333' }}>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component={Link} to="/services" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
          <ListItemIcon sx={{ color: '#333' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>
        <ListItem button component={Link} to="/employees" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
  <ListItemIcon sx={{ color: '#333' }}>
    <PeopleIcon />
  </ListItemIcon>
  <ListItemText primary="Employees" />
</ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
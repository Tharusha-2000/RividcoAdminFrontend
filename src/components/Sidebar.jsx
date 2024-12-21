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
import CommentIcon from '@mui/icons-material/Comment'; 
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';




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
        <ListItem button component={Link} to="/dashboard" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
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
        <ListItem button component={Link} to="/testimonials" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
            <ListItemIcon sx={{ color: '#333' }}>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText primary="Testimonials" />
        </ListItem>
        <ListItem button component={Link} to="/contacts" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
          <ListItemIcon>
            <ContactMailIcon />
          </ListItemIcon>
          <ListItemText primary="Contact Requests" />
        </ListItem>
        <ListItem button component={Link} to="/quotes" sx={{ '&:hover': { backgroundColor: '#e0e0e0' }, color: '#333' }}>
          <ListItemIcon>
            <FormatQuoteIcon />
          </ListItemIcon>
          <ListItemText primary="Quote Requests" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
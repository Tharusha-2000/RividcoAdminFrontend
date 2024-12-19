import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Layout from '../components/Layout.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddServiceForm from '../components/AddServiceForm.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';

function Services() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editService, setEditService] = useState(null);

  const fetchServices = () => {
    axios.get('http://localhost:8080/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the services data!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the services data!',
        });
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceAdded = () => {
    fetchServices();
  };

  const handleServiceUpdated = () => {
    fetchServices();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/services/${id}`)
          .then(() => {
            fetchServices();
            Swal.fire(
              'Deleted!',
              'The service has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the service!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the service!',
            });
          });
      }
    });
  };

  const handleClickOpen = (service = null) => {
    setEditService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditService(null);
  };

  // Filter services based on the search term
  const filteredServices = services.filter(service =>
    service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Services
        </Typography>
        <TextField
          label="Search Services"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            borderRadius: '50px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              '& fieldset': {
                borderRadius: '50px',
              },
            },
          }}
        />
      </Box>
      <Typography>
        Here you can manage your services.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
        + Add New Service
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editService ? 'Update Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <AddServiceForm
            onServiceAdded={() => {
              handleServiceAdded();
              handleClose();
            }}
            onServiceUpdated={() => {
              handleServiceUpdated();
              handleClose();
            }}
            editService={editService}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper} sx={{ marginTop: 2, width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.map((service, index) => (
              <TableRow key={service._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{service.service}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.serviceCategory}</TableCell>
                <TableCell>
                  <img src={service.image} alt={service.service} style={{ width: '100px' }} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(service)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(service._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default Services;
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
import AddTestimonialForm from '../components/AddTestimonialForm.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import config from '../config'; // Import the configuration file

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState(null);

  const fetchTestimonials = () => {
    axios.get(`${config.baseUrl}/api/testimonials`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setTestimonials(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setTestimonials([]);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the testimonials data!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the testimonials data!',
        });
        setTestimonials([]);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleTestimonialAdded = () => {
    fetchTestimonials();
  };

  const handleTestimonialUpdated = () => {
    fetchTestimonials();
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
        axios.delete(`${config.baseUrl}/api/testimonials/${id}`)
          .then(() => {
            fetchTestimonials();
            Swal.fire(
              'Deleted!',
              'The testimonial has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the testimonial!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the testimonial!',
            });
          });
      }
    });
  };

  const handleClickOpen = (testimonial = null) => {
    setEditTestimonial(testimonial);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTestimonial(null);
  };

  // Filter testimonials based on the search term
  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Testimonials
        </Typography>
        <TextField
          label="Search Testimonials"
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
        Here you can manage your testimonials.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
        + Add New Testimonial
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTestimonial ? 'Update Testimonial' : 'Add New Testimonial'}</DialogTitle>
        <DialogContent>
          <AddTestimonialForm
            onTestimonialAdded={() => {
              handleTestimonialAdded();
              handleClose();
            }}
            onTestimonialUpdated={() => {
              handleTestimonialUpdated();
              handleClose();
            }}
            editTestimonial={editTestimonial}
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
              <TableCell>Name</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTestimonials.map((testimonial, index) => (
              <TableRow key={testimonial._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{testimonial.name}</TableCell>
                <TableCell>{testimonial.profession}</TableCell>
                <TableCell>{testimonial.text}</TableCell>
                <TableCell>
                  <img src={testimonial.image} alt={testimonial.name} style={{ width: '100px', height: '100px' }} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(testimonial)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(testimonial._id)}>
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

export default Testimonials;

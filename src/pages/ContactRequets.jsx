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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import config from '../config'; // Import the configuration file
import axios from 'axios';

function ContactRequests() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const fetchContacts = () => {
    axios
      .get(`${config.baseUrl}/api/contacts`)
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the contact requests!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the contact requests!',
        });
        setContacts([]);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios.put(`${config.baseUrl}/api/contacts/${id}`, { status: newStatus })
      .then(() => {
        fetchContacts();
        Swal.fire('Success', `Contact request marked as ${newStatus}`, 'success');
      })
      .catch(error => {
        console.error('There was an error updating the status!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update contact request status!',
        });
      });
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
        axios.delete(`${config.baseUrl}/api/contacts/${id}`)
          .then(() => {
            fetchContacts();
            Swal.fire(
              'Deleted!',
              'The contact request has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the contact request!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the contact request!',
            });
          });
      }
    });
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  // Filter contacts based on the search term
  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered contacts
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Contact Requests
        </Typography>
        <TextField
          label="Search Contacts"
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
        Manage contact requests by updating their status or deleting them.
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2, width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.map((contact, index) => (
              <TableRow key={contact._id}>
                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>{contact.message}</TableCell>
                <TableCell>
                  <Select
                    value={contact.status || 'pending'}
                    onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(contact._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Layout>
  );
}

export default ContactRequests;

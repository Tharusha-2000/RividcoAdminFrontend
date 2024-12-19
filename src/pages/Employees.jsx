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
import AddEmployeeForm from '../components/AddEmployeeForm.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const fetchEmployees = () => {
    axios.get('http://localhost:8080/api/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the employees data!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the employees data!',
        });
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeAdded = () => {
    fetchEmployees();
  };

  const handleEmployeeUpdated = () => {
    fetchEmployees();
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
        axios.delete(`http://localhost:8080/api/employees/${id}`)
          .then(() => {
            fetchEmployees();
            Swal.fire(
              'Deleted!',
              'The employee has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the employee!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the employee!',
            });
          });
      }
    });
  };

  const handleClickOpen = (employee = null) => {
    setEditEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditEmployee(null);
  };

  // Filter employees based on the search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Employees
        </Typography>
        <TextField
          label="Search Employees"
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
        Here you can manage your employees.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
        + Add New Employee
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editEmployee ? 'Update Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <AddEmployeeForm
            onEmployeeAdded={() => {
              handleEmployeeAdded();
              handleClose();
            }}
            onEmployeeUpdated={() => {
              handleEmployeeUpdated();
              handleClose();
            }}
            editEmployee={editEmployee}
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
              <TableCell>Job Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Social Media</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee, index) => (
              <TableRow key={employee._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.description}</TableCell>
                <TableCell>
                  <img src={employee.image} alt={employee.name} style={{ width: '100px' }} />
                </TableCell>
                <TableCell>
                  {employee.socialMedia.map((social, idx) => (
                    <div key={idx}>
                      <strong>{social.platform}:</strong> <a href={social.link} target="_blank" rel="noopener noreferrer">{social.link}</a>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(employee)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(employee._id)}>
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

export default Employees;
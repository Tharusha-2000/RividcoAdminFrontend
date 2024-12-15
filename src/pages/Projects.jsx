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
import AddProjectForm from '../components/AddProjectForm.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchProjects = () => {
    axios.get('http://localhost:8080/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the projects data!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the projects data!',
        });
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = () => {
    fetchProjects();
  };

  const handleProjectUpdated = () => {
    fetchProjects();
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
        axios.delete(`http://localhost:8080/api/projects/${id}`)
          .then(() => {
            fetchProjects();
            Swal.fire(
              'Deleted!',
              'The project has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the project!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the project!',
            });
          });
      }
    });
  };

  const handleClickOpen = (project = null) => {
    setEditProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProject(null);
  };

  // Filter projects based on the search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <TextField
          label="Search Projects"
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
        Here you can manage your projects.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
        + Add New Project
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editProject ? 'Update Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <AddProjectForm
            onProjectAdded={() => {
              handleProjectAdded();
              handleClose();
            }}
            onProjectUpdated={() => {
              handleProjectUpdated();
              handleClose();
            }}
            editProject={editProject}
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
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project, index) => (
              <TableRow key={project._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {project.images.map((image, idx) => (
                    <img key={idx} src={`data:image/png;base64,${image}`} alt={`Project ${idx}`} style={{ width: '100px', marginRight: '10px' }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(project)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(project._id)}>
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

export default Projects;
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';

const AddProjectForm = ({ onProjectAdded, onProjectUpdated, editProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editProject) {
      setTitle(editProject.title);
      setDescription(editProject.description);
      setImages(editProject.images);
    }
  }, [editProject]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prevImages => [...prevImages, reader.result.split(',')[1]]); // Remove the base64 prefix
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      title,
      description,
      images,
    };

    if (editProject) {
      axios.put(`http://localhost:8080/api/projects/${editProject._id}`, newProject)
        .then(response => {
          onProjectUpdated(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Project Updated',
            text: 'The project has been updated successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error updating the project!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the project!',
          });
        });
    } else {
      axios.post('http://localhost:8080/api/projects', newProject)
        .then(response => {
          onProjectAdded(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Project Added',
            text: 'The project has been added successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error adding the project!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the project!',
          });
        });
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editProject ? 'Update Project' : 'Add New Project'}
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            mt: 2,
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa',
            height: '300px', // Increase the height of the drag-and-drop area
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <input {...getInputProps()} />
          {images.length > 0 ? (
            images.map((image, idx) => (
              <Box key={idx} sx={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                <img src={`data:image/png;base64,${image}`} alt={`Uploaded ${idx}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                <IconButton
                  onClick={() => handleRemoveImage(idx)}
                  sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              {isDragActive ? 'Drop the images here ...' : 'Drag \'n\' drop images here, or click to select images'}
            </Typography>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }}>
          {editProject ? 'Update Project' : 'Add Project'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddProjectForm;
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddServiceForm = ({ onServiceAdded, onServiceUpdated, editService }) => {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (editService) {
      setService(editService.service);
      setDescription(editService.description);
      setImage(editService.image);
    }
  }, [editService]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]); // Remove the base64 prefix
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      service,
      description,
      image,
    };

    if (editService) {
      axios.put(`http://localhost:8080/api/services/${editService._id}`, newService)
        .then(response => {
          onServiceUpdated(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Service Updated',
            text: 'The service has been updated successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error updating the service!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the service!',
          });
        });
    } else {
      axios.post('http://localhost:8080/api/services', newService)
        .then(response => {
          onServiceAdded(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Service Added',
            text: 'The service has been added successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error adding the service!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the service!',
          });
        });
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editService ? 'Update Service' : 'Add New Service'}
        </Typography>
        <TextField
          label="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
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
          {image ? (
            <img src={`data:image/png;base64,${image}`} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {isDragActive ? 'Drop the image here ...' : 'Drag \'n\' drop an image here, or click to select an image'}
            </Typography>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }}>
          {editService ? 'Update Service' : 'Add Service'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddServiceForm;
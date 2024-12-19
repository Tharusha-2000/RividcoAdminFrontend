import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase';

const AddServiceForm = ({ onServiceAdded, onServiceUpdated, editService }) => {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceCategories = ['Mini Hydro', 'Rooftop Solar', 'Ground-Mounted Solar', 'Solar Battery Storage','Energy Efficiency Consulting'];

  useEffect(() => {
    if (editService) {
      setService(editService.service);
      setDescription(editService.description);
      setServiceCategory(editService.serviceCategory);
      setImageUrl(editService.image);
    }
  }, [editService]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);

    // Display the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(imageUrl); // If no new image is selected, use the existing image URL
        return;
      }

      const imagePath = `services/${image.name + uuidv4()}`;
      const imageRef = ref(storage, imagePath);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error while uploading file', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const newService = {
        service,
        description,
        serviceCategory,
        image: imageUrl,
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
    } catch (error) {
      console.error('Error while uploading image', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error uploading the image!',
      });
    } finally {
      setLoading(false);
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Service Category</InputLabel>
          <Select
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            label="Service Category"
          >
            {serviceCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {isDragActive ? 'Drop the image here ...' : 'Drag \'n\' drop an image here, or click to select an image'}
            </Typography>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : editService ? 'Update Service' : 'Add Service'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddServiceForm;
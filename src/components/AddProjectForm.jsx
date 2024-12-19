import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase';

const AddProjectForm = ({ onProjectAdded, onProjectUpdated, editProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories =  ['Mini Hydro', 'Rooftop Solar', 'Ground-Mounted Solar', 'Solar Battery Storage','Energy Efficiency Consulting'];

  useEffect(() => {
    if (editProject) {
      setTitle(editProject.title);
      setDescription(editProject.description);
      setCategory(editProject.category);
      setImages(editProject.images.map((url) => ({ url })));
    }
  }, [editProject]);

  const onDrop = (acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles.map((file) => ({ file }))]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      const imagePath = `projects/${uuidv4()}`;
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
      const uploadedImages = await Promise.all(
        images.map((image) => (image.file ? uploadImage(image.file) : image.url))
      );

      const newProject = {
        title,
        description,
        category,
        images: uploadedImages,
      };

      if (editProject) {
        axios.put(`https://rividco.vercel.app/api/projects/${editProject._id}`, newProject)
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
        axios.post('https://rividco.vercel.app/api/projects', newProject)
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
    } catch (error) {
      console.error('Error while uploading images', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error uploading the images!',
      });
    } finally {
      setLoading(false);
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
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
          {images.length > 0 ? (
            images.map((image, idx) => (
              <Box key={idx} sx={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                <img src={image.file ? URL.createObjectURL(image.file) : image.url} alt={`Uploaded ${idx}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : editProject ? 'Update Project' : 'Add Project'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddProjectForm;
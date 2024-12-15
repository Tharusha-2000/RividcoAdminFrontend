import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';

const AddEmployeeForm = ({ onEmployeeAdded, onEmployeeUpdated, editEmployee }) => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [socialMedia, setSocialMedia] = useState([{ platform: '', link: '' }]);

  const socialMediaPlatforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'GitHub'];

  useEffect(() => {
    if (editEmployee) {
      setName(editEmployee.name);
      setJobTitle(editEmployee.jobTitle);
      setDescription(editEmployee.description);
      setImage(editEmployee.image);
      setSocialMedia(editEmployee.socialMedia);
    }
  }, [editEmployee]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]); // Remove the base64 prefix
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  const handleSocialMediaChange = (index, field, value) => {
    const newSocialMedia = [...socialMedia];
    newSocialMedia[index][field] = value;
    setSocialMedia(newSocialMedia);
  };

  const handleAddSocialMedia = () => {
    setSocialMedia([...socialMedia, { platform: '', link: '' }]);
  };

  const handleRemoveSocialMedia = (index) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
      name,
      jobTitle,
      description,
      image,
      socialMedia,
    };

    if (editEmployee) {
      axios.put(`http://localhost:8080/api/employees/${editEmployee._id}`, newEmployee)
        .then(response => {
          onEmployeeUpdated(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Employee Updated',
            text: 'The employee has been updated successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error updating the employee!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the employee!',
          });
        });
    } else {
      axios.post('http://localhost:8080/api/employees', newEmployee)
        .then(response => {
          onEmployeeAdded(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Employee Added',
            text: 'The employee has been added successfully!',
          });
        })
        .catch(error => {
          console.error('There was an error adding the employee!', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the employee!',
          });
        });
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {editEmployee ? 'Update Employee' : 'Add New Employee'}
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
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
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Social Media
        </Typography>
        {socialMedia.map((social, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControl fullWidth margin="normal" required sx={{ mr: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={social.platform}
                onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                label="Platform"
              >
                {socialMediaPlatforms.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Link"
              value={social.link}
              onChange={(e) => handleSocialMediaChange(index, 'link', e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => handleRemoveSocialMedia(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddSocialMedia} sx={{ mb: 2 }}>
          + Add Social Media
        </Button>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }}>
          {editEmployee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddEmployeeForm;
import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Box, IconButton } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../firebase'; // Firebase storage
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config'; // Import your config for baseUrl

const AddTestimonialForm = ({ onTestimonialAdded, onTestimonialUpdated, editTestimonial }) => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); // File for new upload
  const [existingImage, setExistingImage] = useState(''); // URL for existing image
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editTestimonial) {
      setName(editTestimonial.name || '');
      setProfession(editTestimonial.profession || '');
      setText(editTestimonial.text || '');
      setExistingImage(editTestimonial.image || '');
    }
  }, [editTestimonial]);

  const handleImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const imagePath = `testimonials/${uuidv4()}`;
      const imageRef = ref(storage, imagePath);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setUploading(true);
        },
        (error) => {
          console.error('Error uploading file', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = existingImage;

      // Upload new image if a file is selected
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const testimonialData = { name, profession, text, image: imageUrl };

      if (editTestimonial?._id) {
        // Update existing testimonial
        await axios.put(`${config.baseUrl}/api/testimonials/${editTestimonial._id}`, testimonialData);
        onTestimonialUpdated();
        Swal.fire('Success', 'Testimonial updated successfully', 'success');
      } else {
        // Create new testimonial
        await axios.post(`${config.baseUrl}/api/testimonials`, testimonialData);
        onTestimonialAdded();
        Swal.fire('Success', 'Testimonial added successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      Swal.fire('Error', 'Failed to save testimonial', 'error');
    }
  };

  const handleRemoveExistingImage = () => {
    setExistingImage('');
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <Box mt={2}>
        {existingImage && !image && (
          <Box sx={{ position: 'relative', display: 'inline-block', marginBottom: 2 }}>
            <img src={existingImage} alt="Existing" style={{ width: '100px', height: '100px' }} />
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }}
              onClick={handleRemoveExistingImage}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: 'block', marginBottom: '10px' }}
        />
        {uploading && <CircularProgress size={24} />}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={uploading || (!name && !profession && !text)}
      >
        {editTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
      </Button>
    </Box>
  );
};

export default AddTestimonialForm;

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Dynamically import the web3_backend module
const loadWeb3Backend = () => import('../../../declarations/web3_backend');

const CreateAuctionForm = () => {
  const [title, setTitle] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [deadline, setDeadline] = useState(dayjs());
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !basePrice || !deadline || !description || !image) {
      setError('Please provide valid auction details.');
      setSuccess('');
      return;
    }

    const auctionData = {
      title,
      basePrice: parseInt(basePrice),
      deadline: deadline.valueOf(), // Get the timestamp
      description,
      image
    };

    const deadlineDate = new Date(auctionData.deadline);
    const deadlineSeconds = deadlineDate.getTime() / 1000;
    try {
      const web3_backend = await loadWeb3Backend();
      web3_backend.createAuction(auctionData.title, auctionData.description, auctionData.basePrice, auctionData.deadline, auctionData.image);
      setError('');
      setSuccess('Auction created successfully!');
    } catch (error) {
      setError('Failed to create auction.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
      <Typography variant="h6">Create New Auction</Typography>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        type="number"
        fullWidth
        label="Base Price"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
        margin="normal"
        inputProps={{ min: "1" }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" />
          )}
        />
      </LocalizationProvider>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        margin="normal"
      />
      {image && <img src={image} alt="Auction Preview" style={{ width: '200px', marginTop: '10px' }} />}
      <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2 }}>
        Create Auction
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}
    </Box>
  );
};

export default CreateAuctionForm;

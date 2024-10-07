import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const BidForm = ({ auctionId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleBid = async () => {
    if (!bidAmount || parseInt(bidAmount) <= 0) {
      setError('Please enter a valid bid amount.');
      setOpenSnackbar(true);
      setSuccess(false);
      return;
    }

    try {
      const { web3_backend } = await import('../../../declarations/web3_backend');
      await web3_backend.placeBid(auctionId, parseInt(bidAmount));
      setError('');
      setSuccess(true);
      setOpenSnackbar(true);
    } catch (error) {
      setError('Failed to place bid.');
      setSuccess(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Place a Bid
      </Typography>
      <TextField
        fullWidth
        label="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        variant="outlined"
        margin="normal"
        type="number"
        inputProps={{ min: "0" }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2, py: 1.5 }} 
        fullWidth 
        onClick={handleBid}
      >
        Submit Bid
      </Button>

      {/* Snackbar Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success ? 'Bid placed successfully!' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BidForm;

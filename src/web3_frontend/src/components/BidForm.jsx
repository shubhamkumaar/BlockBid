import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const BidForm = ({ auctionId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBid = async () => {
    if (!bidAmount) {
      setError('Please enter a valid bid amount.');
      setSuccess('');
      return;
    }

    try {
      const { web3_backend } = await import('../../../declarations/web3_backend');
      await web3_backend.placeBid(auctionId, parseInt(bidAmount));
      setError('');
      setSuccess('Bid placed successfully!');
    } catch (error) {
      setError('Failed to place bid.');
      setSuccess('');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Place a Bid</Typography>
      <TextField
        fullWidth
        label="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <Button onClick={handleBid}>Submit Bid</Button>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
    </Box>
  );
};

export default BidForm;
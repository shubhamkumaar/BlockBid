import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { web3_backend } from '../../../declarations/web3_backend';

const BidForm = ({ auctionId, currentBid }) => {
  const [bidAmount, setBidAmount] = useState(currentBid);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const handleBid = () => {
    if (parseInt(bidAmount) <= currentBid) {
      setError('Your bid must be higher than the current bid.');
      setSuccess('');
      return;
    }

    const bidData = {
      auctionId,
      bidAmount: parseInt(bidAmount)
    };

    // Place bid logic here (API call, etc.)
    web3_backend.bid(bidData.auctionId, bidData.bidAmount);
    
    setError('');
    setSuccess('Bid placed successfully!');
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6">Place a Bid</Typography>
      <TextField
        type="number"
        label="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" onClick={handleBid} sx={{ marginTop: 2 }}>
        Place Bid
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}
    </Box>
  );
};

export default BidForm;

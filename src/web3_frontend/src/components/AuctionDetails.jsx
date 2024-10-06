import React from 'react';
import { Box, Typography } from '@mui/material';
import BidForm from './BidForm.jsx';


const AuctionDetails = ({ auction }) => {
  if (!auction) {
    return <Typography variant="body1">Select an auction to see details.</Typography>;
  }

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2, marginTop: 2 }}>
      <Typography variant="h6">{auction.title}</Typography>
      <Typography>Current Bid: {auction.maxBid}</Typography>
      <Typography>Time Left: {new Date(auction.deadline).toLocaleString()}</Typography>
      <Typography>Base Price: {auction.basePrice}</Typography>
      <Typography>Description: {auction.description}</Typography>
      <BidForm auctionId={auction.id} currentBid={auction.maxBid} />
    </Box>
  );
};

export default AuctionDetails;

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { web3_backend } from '../../../declarations/web3_backend';

const AuctionList = ({ onAuctionSelect }) => {
  const [auctions, setAuctions] = useState([]);

  // Uncomment and update the fetch logic as needed
  useEffect(() => {
    web3_backend.getAuctions().then(auctions => setAuctions(auctions));
  }, []);

  return (
    <Box>
      <Typography variant="h6">Ongoing Auctions</Typography>
      <List>
        {auctions.map(auction => (
          <ListItem button key={auction.id} onClick={() => console.log(auction.id)}>
            <ListItemText primary={auction.title} secondary={`Current Bid: ${auction.maxBid}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AuctionList;

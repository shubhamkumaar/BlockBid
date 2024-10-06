import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const AuctionList = ({ onAuctionSelect }) => {
  const [auctions, setAuctions] = useState([]);

  // Uncomment and update the fetch logic as needed
  // useEffect(() => {
  //   axios.get('/api/getAuctions')
  //     .then(response => setAuctions(response.data))
  //     .catch(error => console.error('Error fetching auctions:', error));
  // }, []);

  return (
    <Box>
      <Typography variant="h6">Ongoing Auctions</Typography>
      <List>
        {auctions.map(auction => (
          <ListItem button key={auction.id} onClick={() => onAuctionSelect(auction)}>
            <ListItemText primary={auction.title} secondary={`Current Bid: ${auction.maxBid}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AuctionList;

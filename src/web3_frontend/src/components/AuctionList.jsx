import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const AuctionList = ({ onAuctionSelect }) => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const { web3_backend } = await import('../../../declarations/web3_backend');
      const auctions = await web3_backend.getAuctions();
      setAuctions(auctions);
    };

    fetchAuctions();
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

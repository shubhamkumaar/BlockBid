import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      const { web3_backend } = await import('../../../declarations/web3_backend');
      const auctions = await web3_backend.getAuctions();
      setAuctions(auctions);
    };

    fetchAuctions();
  }, []);

  const handleAuctionClick = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <Box>
      <Typography variant="h6">Ongoing Auctions</Typography>
      <List>
        {auctions.map(auction => (
          <ListItem button key={auction.id} onClick={() => handleAuctionClick(auction.id)}>
            <ListItemText primary={auction.title} secondary={`Current Bid: ${auction.maxBid}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AuctionList;

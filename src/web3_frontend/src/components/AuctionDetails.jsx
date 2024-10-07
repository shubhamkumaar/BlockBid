import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      const { web3_backend } = await import('../../../declarations/web3_backend');
      let auctionDetails = await web3_backend.getAuction(parseInt(id));      
      setAuction(auctionDetails);
    };

    fetchAuctionDetails();
  }, [id]);

  if (!auction) {
    return <Typography>Loading...</Typography>;
  }

  function convertMillisecondsToFormattedDateTime(milliseconds) {
    // Create a date object using milliseconds
    let date = new Date(milliseconds);

    // Get the day of the week, day, month, and year
    let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-GB', options);

    // Get the time in hours, minutes, and seconds
    let formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
}

  const dead = convertMillisecondsToFormattedDateTime(parseInt(auction[0].deadline));
  
  return (
    <Box>
      <Typography variant="h4">{auction[0].title}</Typography>
      <Typography variant="body1">{auction[0].description}</Typography>
      <Typography variant="body1">Current Bid: {(auction[0].maxBid).toString()}</Typography>
      <Typography variant="body1">Base Price: {(auction[0].basePrice).toString()}</Typography>
      <Typography variant="body1">Deadline: {dead}</Typography>
      <Typography variant="body1">Image: <img src={auction[0].image} alt={auction[0].title} style={{ maxWidth: '100%' }} /></Typography>

      {/* Add more auction details as needed */}
    </Box>
  );
};

export default AuctionDetails;

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Input, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
const { web3_backend } = await import('../../../declarations/web3_backend');

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const fetchAuctionDetails = async () => {   
    let auctionDetails = await web3_backend.getAuction(parseInt(id));      
    setAuction(auctionDetails);
    console.log(auction);
  };
  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);


  if (!auction) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }


  const convertMillisecondsToFormattedDateTime = (milliseconds) => {
    let date = new Date(milliseconds);
    let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-GB', options);
    let formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  };
  const dead = convertMillisecondsToFormattedDateTime(parseInt(auction[0].deadline));
  
  const placeBid = async () => {
    try {
      console.log("Placing bid");
      
      await web3_backend.bid(parseInt(id), parseInt(bidAmount));
      setError('');
      fetchAuctionDetails();
      setSuccess('Bid placed successfully!');
    } catch (error) {
      setError('Failed to place bid.');
      setSuccess('');
    }
  }
  return (
    <Box>
    <Typography variant="h4">{auction[0].title}</Typography>
    <Typography variant="body1">{auction[0].description}</Typography>
    <Typography variant="body1">Current Bid: {(auction[0].maxBid).toString()}</Typography>
    <Typography variant="body1">Base Price: {(auction[0].basePrice).toString()}</Typography>
    <Typography variant="body1">Deadline: {dead}</Typography>
    <Typography variant="body1">Image: <img src={auction[0].image} alt={auction[0].title} style={{ maxWidth: '100%' }} /></Typography>
    <Input type="text"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter your bid" />
    <Button onClick={placeBid}>Place Bid</Button>
    {error && <Typography color="error">{error}</Typography>}
    {success && <Typography color="primary">{success}</Typography>}
    
  </Box>
  );
};

export default AuctionDetails;

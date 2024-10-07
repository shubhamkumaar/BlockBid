import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Grid, CircularProgress, TextField, Button } from '@mui/material';

const { web3_backend } = await import('../../../declarations/web3_backend');

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isActive, setIsActive] = useState(true); // New state for active/deactive toggle

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      let auctionDetails = await web3_backend.getAuction(parseInt(id));
      setAuction(auctionDetails);
    };

    fetchAuctionDetails();
  }, [id]);

  const convertMillisecondsToFormattedDateTime = (milliseconds) => {
    let date = new Date(milliseconds);
    let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-GB', options);
    let formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  };

  const placeBid = async () => {
    if (!isActive) return; // If auction is deactive, prevent bid placement

    try {
      await web3_backend.bid(parseInt(id), parseInt(bidAmount));
      setError('');
      setSuccess('Bid placed successfully!');
      fetchAuctionDetails(); // Fetch updated auction details after a successful bid
    } catch (error) {
      setError('Failed to place bid.');
      setSuccess('');
    }
  };

  const toggleAuctionStatus = () => {
    setIsActive((prev) => !prev); // Toggle the auction's active/deactive status
  };

  if (!auction) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const deadlineFormatted = convertMillisecondsToFormattedDateTime(parseInt(auction[0].deadline));

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card
            variant="outlined"
            sx={{
              boxShadow: 4,
              borderRadius: '16px',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-8px)' },
              textAlign: 'center'
            }}
          >
            {/* Auction Image */}
            <CardMedia
              component="img"
              height="300"
              image={auction[0].image}
              alt={auction[0].title}
              sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
            />

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {auction[0].title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {auction[0].description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 3 }}>
                Current Bid: <strong>{auction[0].maxBid.toString()}</strong>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Base Price: <strong>{auction[0].basePrice.toString()}</strong>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: 'text.secondary' }}>
                Deadline: {deadlineFormatted}
              </Typography>

              {/* Toggle Auction Status */}
              <Button
                variant="contained"
                color={isActive ? 'error' : 'success'}
                onClick={toggleAuctionStatus}
                sx={{ my: 2 }}
              >
                {isActive ? 'Deactivate' : 'Activate'} Auction
              </Button>

              {/* Display warning message if auction is deactive */}
              {!isActive && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Bidding is disabled. Auction is currently deactive.
                </Typography>
              )}

              {/* Bid Form (disabled when auction is deactive) */}
              <Box sx={{ my: 2 }}>
                <TextField
                  label="Enter your bid"
                  variant="outlined"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  fullWidth
                  sx={{ my: 2 }}
                  disabled={!isActive} // Disable input if auction is deactive
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={placeBid}
                  fullWidth
                  sx={{ py: 1.5, my: 1 }}
                  disabled={!isActive} // Disable button if auction is deactive
                >
                  Place Bid
                </Button>
              </Box>

              {/* Display Error or Success Messages */}
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              {success && <Typography color="primary" sx={{ mt: 2 }}>{success}</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuctionDetails;

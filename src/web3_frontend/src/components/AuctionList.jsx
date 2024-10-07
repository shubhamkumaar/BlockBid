import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuctionList = () => {
  const [auctions, setAuctions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      const { web3_backend } = await import(
        "../../../declarations/web3_backend"
      );
      const auctions = await web3_backend.getAuctions();

      // Ensure that the auction maxBid is properly formatted
      const formattedAuctions = auctions.map((auction) => ({
        ...auction,
        maxBid: auction.maxBid ? auction.maxBid.toString() : "N/A", // Convert maxBid to string
      }));
      setAuctions(formattedAuctions);
    };

    fetchAuctions();
  }, []);

  if (!auctions) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (auctions.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
          }}
        >
          No ongoing auctions
        </Typography>
      </Box>
    );
  }

  const handleAuctionClick = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
        }}
      >
        Ongoing Auctions
      </Typography>
      <List sx={{ maxWidth: 600, margin: "0 auto" }}>
        {auctions.map((auction) => (
          <Paper
            key={auction.id}
            elevation={3}
            sx={{
              mb: 2,
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <ListItem
              button
              onClick={() => handleAuctionClick(auction.id)}
              sx={{ p: 2 }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {auction.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Current Bid: {auction.maxBid}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default AuctionList;

import React from 'react';
import BidForm from './BidForm.jsx';

const AuctionDetails = ({ auction }) => {
  if (!auction) {
    return <div>Select an auction to see details.</div>;
  }

  return (
    <div>
      <h2>{auction.title}</h2>
      <p>Current Bid: {auction.maxBid}</p>
      <p>Time Left: {new Date(auction.deadline).toLocaleString()}</p>
      <p>Base Price: {auction.basePrice}</p>
      <p>Description: {auction.description}</p>
      <BidForm auctionId={auction.id} currentBid={auction.maxBid} />
    </div>
  );
};

export default AuctionDetails;

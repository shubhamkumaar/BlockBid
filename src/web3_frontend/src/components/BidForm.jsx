import React, { useState } from 'react';

const BidForm = ({ auctionId, currentBid }) => {
  const [bidAmount, setBidAmount] = useState(currentBid);

  const handleBid = () => {
    const bidData = {
      auctionId,
      bidAmount: parseInt(bidAmount)
    };

  };

  return (
    <div>
      <h3>Place a Bid</h3>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={handleBid}>Place Bid</button>
    </div>
  );
};

export default BidForm;

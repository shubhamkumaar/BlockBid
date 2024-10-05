import React, { useEffect, useState } from 'react';
// import axios from 'axios';

const AuctionList = ({ onAuctionSelect }) => {
  const [auctions, setAuctions] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/getAuctions')
  //     .then(response => setAuctions(response.data))
  //     .catch(error => console.error('Error fetching auctions:', error));
  // }, []);

  return (
    <div>
      <h2>Ongoing Auctions</h2>
      <ul>
        {auctions.map(auction => (
          <li key={auction.id} onClick={() => onAuctionSelect(auction)}>
            {auction.title} - Current Bid: {auction.maxBid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionList;

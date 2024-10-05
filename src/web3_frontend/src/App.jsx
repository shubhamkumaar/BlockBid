import React, { useState } from 'react';
import AuctionList from './components/AuctionList.jsx';
import AuctionDetails from './components/AuctionDetails.jsx';
import CreateAuctionForm from './components/CreateAuctionForm.jsx';

function App() {
  const [selectedAuction, setSelectedAuction] = useState(null);

  return (
    <div>
      <h1>Auction System</h1>
      <CreateAuctionForm />
      <AuctionList onAuctionSelect={setSelectedAuction} />
      <AuctionDetails auction={selectedAuction} />
    </div>
  );
}

export default App;
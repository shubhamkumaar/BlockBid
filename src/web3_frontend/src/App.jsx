import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import AuctionList from './components/AuctionList.jsx';
import AuctionDetails from './components/AuctionDetails.jsx';
import CreateAuctionForm from './components/CreateAuctionForm.jsx';

function App() {
  const [selectedAuction, setSelectedAuction] = useState(null);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<AuctionList onAuctionSelect={setSelectedAuction} />} />
          <Route path="/create-auction" element={<CreateAuctionForm />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

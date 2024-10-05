import React, { useState } from 'react';

const CreateAuctionForm = () => {
  const [title, setTitle] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleCreateAuction = () => {
    const auctionData = {
      title,
      basePrice: parseInt(basePrice),
      deadline: new Date(deadline).getTime(),
      description,
      image
    };

  };

  return (
    <div>
      <h3>Create New Auction</h3>
      <input
        type="text"
        value={title}
        placeholder="Auction Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        value={basePrice}
        placeholder="Base Price"
        onChange={(e) => setBasePrice(e.target.value)}
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <textarea
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        value={image}
        placeholder="Image URL"
        onChange={(e) => setImage(e.target.value)}
      />
      <button onClick={handleCreateAuction}>Create Auction</button>
    </div>
  );
};

export default CreateAuctionForm;

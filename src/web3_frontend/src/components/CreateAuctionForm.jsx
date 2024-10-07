import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CreateAuctionForm = () => {
  const [title, setTitle] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // For snackbar notification
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !basePrice || !deadline || !description || !image) {
      setError("Please provide valid auction details.");
      return;
    }

    const auctionData = {
      title,
      basePrice: parseInt(basePrice),
      deadline: deadline.valueOf(),
      description,
      image,
    };
    console.log(auctionData.deadline);
    const deadlineDate = new Date(auctionData.deadline);
    const deadlineSeconds = deadlineDate.getTime();

    try {
      const create = async () => {
        const { web3_backend } = await import(
          "../../../declarations/web3_backend"
        );
        await web3_backend.createAuction(
          auctionData.title,
          auctionData.description,
          auctionData.basePrice,
          parseInt(deadlineSeconds),
          auctionData.image
        );
      };
      await create();

      setError("");
      setSuccess(true); // Trigger snackbar success
      setOpenSnackbar(true); // Open snackbar

      // Redirect to another page after 2 seconds (e.g., auction list page)
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Failed to create auction.");
      setOpenSnackbar(true); // Show error snackbar
    }
  };

  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "0 auto",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
      >
        Create New Auction
      </Typography>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <TextField
        type="number"
        fullWidth
        label="Base Price"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
        margin="normal"
        inputProps={{ min: "1" }}
        variant="outlined"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          )}
        />
      </LocalizationProvider>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      {image && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <img
            src={image}
            alt="Auction Preview"
            style={{
              width: "200px",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, py: 1.5 }}
        onClick={handleSubmit}
      >
        Create Auction
      </Button>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success ? "Auction created successfully!" : error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateAuctionForm;

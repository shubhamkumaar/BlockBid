import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import ListIcon from '@mui/icons-material/FormatListBulleted';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2196f3', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BlockBid
        </Typography>
        <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/create-auction" startIcon={<CreateIcon />}>
          Create Auction
        </Button>
        {/* <Button color="inherit" component={Link} to="/auctions" startIcon={<ListIcon />}>
          Auctions
        </Button> */}
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/create-auction">Create Auction</MenuItem>
        {/* <MenuItem onClick={handleClose} component={Link} to="/auctions">Auctions</MenuItem> */}
      </Menu>
    </AppBar>
  );
};

export default Navbar;

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract AuctionTable {
    struct Auction {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 deadline;
        uint256 basePrice;
        uint256 minIncrement;
        uint256 maxBid;
        address maxBidder;
        string image;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public noOfAuctions = 0;
    
    function createAuction(address _owner, string memory _title, string memory _description, uint256 _basePrice, uint256 _deadline, string memory _image) public returns(uint256) {
        Auction memory auction = auctions[noOfAuctions];

        require(auction.deadline<block.timestamp, "The deadline should be in the future");
        require(auction.basePrice>0, "The base price should be higher than 0");
        require(auction.minIncrement>0, "The minimum increment should be higher than 0");

        auction.id = noOfAuctions;
        auction.owner = _owner;
        auction.title = _title;
        auction.description = _description;
        auction.deadline = _deadline;
        auction.basePrice = _basePrice;
        auction.minIncrement = 1;
        auction.maxBid = _basePrice;
        auction.image = _image;
        auction.active = true;
        noOfAuctions++;
        return noOfAuctions-1;
    }

    function startAuction(uint256 _id) public {
        Auction storage auction = auctions[_id];
        require(auction.owner == msg.sender, "Only the owner can start the auction");
        auction.active = true;
    }

    function closeAuction(uint256 _id) public {
        Auction storage auction = auctions[_id];
        require(auction.owner == msg.sender, "Only the owner can close the auction");
        auction.active = false;
    }

    function changeDeadline(uint256 _id, uint256 _deadline) public {
        Auction storage auction = auctions[_id];
        require(auction.owner == msg.sender, "Only the owner can change the deadline");
        require(auction.deadline > block.timestamp, "The deadline has passed");
        auction.deadline = _deadline;
        auction.active = true;
    }

    function getMinIncrement(uint256 _id) public view returns(uint256) {
        return auctions[_id].minIncrement / 100;
    }

    function getAuction(uint256 _id) public returns(Auction memory) {
        if(auctions[_id].deadline<block.timestamp) {
            closeAuction(_id);
        }
        return auctions[_id];
    }

    function getAuctions() public returns(Auction[] memory) {
        Auction[] memory _auctions = new Auction[](noOfAuctions);
        for(uint256 i = 0; i < noOfAuctions; i++) {
            _auctions[i] = auctions[i];
            if(_auctions[i].deadline<block.timestamp) {
                closeAuction(i);
            }
        }
        return _auctions;
    }

    function bid(uint256 _id, uint256 _bid) public {
        Auction storage auction = auctions[_id];
        require(auction.active, "Auction is not active");
        if(auction.deadline>block.timestamp) {
            closeAuction(_id);
        }
        require(block.timestamp < auction.deadline, "Auction has ended");
        require(_bid > auction.maxBid, "Bid is not higher than max bid");
        require(_bid >= auction.basePrice, "Bid is lower than start price");
        require(_bid - auction.maxBid >= auction.minIncrement, "Bid is not higher than min increment");
        auction.maxBid = _bid;
        auction.maxBidder = msg.sender;
    }

    function payBid(uint256 _id) public payable{
        Auction storage auction = auctions[_id];
        require(auction.active, "Auction is not active");
        require(auction.maxBidder == msg.sender, "Only the max bidder can pay");
        require(msg.value == auction.maxBid, "The value should be equal to the max bid");

        (bool success, ) = payable(auction.owner).call{value: auction.maxBid}("");

        if(success) {
            auction.active = false;
        }
    }
}
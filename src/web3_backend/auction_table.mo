import Nat "mo:base/Nat";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";

actor AuctionTable {
    // Define the Auction structure
    public type Auction = {
        id: Nat;
        owner: Principal;
        title: Text;
        description: Text;
        deadline: Time.Time;
        basePrice: Nat;
        minIncrement: Nat;
        maxBid: Nat;
        maxBidder: Principal;
        image: Text;
        active: Bool;
    };

    // State variables
    var auctions : HashMap.HashMap<Nat, Auction> = HashMap.HashMap<Nat, Auction>();
    var noOfAuctions : Nat = 0;

    // Function to create a new auction
    public func createAuction(
        owner: Principal,
        title: Text,
        description: Text,
        basePrice: Nat,
        deadline: Time.Time,
        image: Text
    ) : async Nat {
        // Ensure deadline is in the future
        let currentTime = Time.now();
        if (deadline < currentTime) {
            throw Debug.print("The deadline should be in the future");
        };

        // Ensure basePrice is greater than 0
        if (basePrice <= 0) {
            throw Debug.print(debug_show("The base price should be higher than 0"));
        };

        // Initialize minIncrement to 1
        let minIncrement : Nat = 1;

        // Create the auction
        let auction : Auction = {
            id = noOfAuctions;
            owner = owner;
            title = title;
            description = description;
            deadline = deadline;
            basePrice = basePrice;
            minIncrement = minIncrement;
            maxBid = basePrice;
            maxBidder = Principal.self(); // Initially, no bidder
            image = image;
            active = true;
        };

        // Insert into the auctions map
        HashMap.put<Nat, Auction>(auctions, noOfAuctions, auction);
        noOfAuctions += 1;
        return noOfAuctions - 1;
    };

    // Function to start an auction
    public func startAuction(id: Nat) : async () {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                if (auction.owner != Principal.sender()) {
                    throw Debug.print("Only the owner can start the auction");
                };
                let updatedAuction = { auction with active = true };
                HashMap.put<Nat, Auction>(auctions, id, updatedAuction);
            };
            case (_) {
                throw Debug.print("Auction not found");
            };
        };
    };

    // Function to close an auction
    public func closeAuction(id: Nat) : async () {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                if (auction.owner != Principal.sender()) {
                    throw Debug.print("Only the owner can close the auction");
                };
                let updatedAuction = { auction with active = false };
                HashMap.put<Nat, Auction>(auctions, id, updatedAuction);
            };
            case (_) {
                throw Debug.print("Auction not found");
            };
        };
    };

    // Function to change the deadline of an auction
    public func changeDeadline(id: Nat, newDeadline: Time.Time) : async () {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                if (auction.owner != Principal.sender()) {
                    throw Debug.print("Only the owner can change the deadline");
                };
                let currentTime = Time.now();
                if (auction.deadline < currentTime) {
                    throw Debug.print("The deadline has passed");
                };
                let updatedAuction = { auction with deadline = newDeadline; active = true };
                HashMap.put<Nat, Auction>(auctions, id, updatedAuction);
            };
            case (_) {
                throw Debug.print("Auction not found");
            };
        };
    };

    // Function to get the minimum increment
    public query func getMinIncrement(id: Nat) : async ?Nat {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                return ?(auction.minIncrement / 100);
            };
            case (_) {
                return null;
            };
        };
    };

    // Function to get a specific auction
    public query func getAuction(id: Nat) : async ?Auction {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                let currentTime = Time.now();
                if (auction.deadline < currentTime) {
                    await closeAuction(id);
                };
                return ?(HashMap.get<Nat, Auction>(auctions, id));
            };
            case (_) {
                return null;
            };
        };
    };

    // Function to get all auctions
    public query func getAuctions() : async [Auction] {
        var result : [Auction] = [];
        for (id in HashMap.keys<Nat, Auction>(auctions)) {
            switch (HashMap.get<Nat, Auction>(auctions, id)) {
                case (?auction) {
                    let currentTime = Time.now();
                    if (auction.deadline < currentTime & auction.active) {
                        await closeAuction(id);
                        // Fetch the updated auction
                        switch (HashMap.get<Nat, Auction>(auctions, id)) {
                            case (?updatedAuction) {
                                result := Array.append<Auction>(result, [updatedAuction]);
                            };
                            case (_) {};
                        };
                    } else {
                        result := Array.append<Auction>(result, [auction]);
                    };
                };
                case (_) {};
            };
        };
        return result;
    };

    // Function to place a bid
    public func bid(id: Nat, bidAmount: Nat) : async () {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                if (auction.active == false) {
                    throw Debug.print("Auction is not active");
                };
                let currentTime = Time.now();
                if (auction.deadline < currentTime) {
                    await closeAuction(id);
                };
                if (currentTime >= auction.deadline) {
                    throw Debug.print("Auction has ended");
                };
                if (bidAmount <= auction.maxBid) {
                    throw Debug.print("Bid is not higher than max bid");
                };
                if (bidAmount < auction.basePrice) {
                    throw Debug.print("Bid is lower than start price");
                };
                if ((bidAmount - auction.maxBid) < auction.minIncrement) {
                    throw Debug.print("Bid is not higher than min increment");
                };
                let updatedAuction = {
                    auction with
                    maxBid = bidAmount;
                    maxBidder = Principal.sender();
                };
                HashMap.put<Nat, Auction>(auctions, id, updatedAuction);
            };
            case (_) {
                throw Debug.print("Auction not found");
            };
        };
    };

    // Function to pay the bid
    public func payBid(id: Nat) : async () {
        switch (HashMap.get<Nat, Auction>(auctions, id)) {
            case (?auction) {
                if (auction.active == false) {
                    throw Debug.print("Auction is not active");
                };
                if (auction.maxBidder != Principal.sender()) {
                    throw Debug.print("Only the max bidder can pay");
                };
                // Note: Motoko handles canister funds differently. Below is a simplified version.
                // You might need to use Cycles or other mechanisms based on your specific use case.
                
                // Transfer the bid to the owner
                // This requires appropriate setup and permissions.
                // Placeholder for transfer logic:
                // e.g., call owner.principal with the bid amount

                // Assuming a transfer function exists:
                // await owner.transfer(auction.maxBid);

                // For demonstration, we'll just deactivate the auction
                let updatedAuction = { auction with active = false };
                HashMap.put<Nat, Auction>(auctions, id, updatedAuction);
            };
            case (_) {
                throw Debug.print("Auction not found");
            };
        };
    };
};
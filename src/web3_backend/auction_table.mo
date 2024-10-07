import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor class AuctionTable() {
    type Auction = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        deadline : Time.Time;
        basePrice : Nat;
        minIncrement : Nat;
        maxBid : Nat;
        maxBidder : ?Principal;
        image : Text;
        active : Bool;
    };

    private stable var auctions : [var ?Auction] = [var];
    private stable var noOfAuctions : Nat = 0;

    public shared (msg) func createAuction(title : Text, description : Text, basePrice : Nat, _deadline : Time.Time, image : Text) : async Nat {
        Debug.print(debug_show (_deadline));
        Debug.print(debug_show (Time.now() / 1000000));
        assert (_deadline > Time.now() / 1000000);
        assert (basePrice > 0);

        let auction : Auction = {
            id = noOfAuctions;
            owner = msg.caller;
            title = title;
            description = description;
            deadline = _deadline;
            basePrice = basePrice;
            minIncrement = 1;
            maxBid = basePrice;
            maxBidder = null;
            image = image;
            active = true;
        };

        auctions := Array.thaw(Array.append(Array.freeze(auctions), [?auction]));
        noOfAuctions += 1;
        return noOfAuctions - 1;
    };

    public shared (msg) func startAuction(id : Nat) : async () {
        switch (auctions[id]) {
            case (?auction) {
                if (auction.owner != msg.caller) {
                    throw Error.reject("Only the owner can start the auction");
                } else {
                    auctions[id] := ?{ auction with active = true };
                };
            };
            case null {
                throw Error.reject("Auction not found");
            };
        };
    };

    public shared (msg) func closeAuction(id : Nat) : async Text {
        let auction = switch (auctions[id]) {
            case (?a) a;
            case null throw Error.reject("Auction not found");
        };

        if (msg.caller != auction.owner) {
            throw Error.reject("Only the owner can close the auction");
        } else {
            // Update the auction to set active to false
            auctions[id] := ?{ auction with active = false };
            return "Auction closed";
        };
    };

    // public shared (msg) func changeDeadline(id : Nat, newDeadline : Int) : async Text {
    //     assert (id < noOfAuctions);
    //     switch (auctions[id]) {
    //         case (?auction) {
    //             if (auction.owner != msg.caller) {
    //                 throw Error.reject("Only the owner can change the deadline");
    //             };
    //             assert (auction.owner == msg.caller);
    //             if (newDeadline < Time.now() / 1000000) {
    //                 auctions[id] := ?{ auction with active = false };
    //                 auctions[id] := ?{ auction with deadline = newDeadline };
    //                 return "Auction has ended";
    //             };
    //             auctions[id] := ?{
    //                 auction with deadline = newDeadline;
    //                 active = true;
    //             };
    //             return "Deadline Changed";
    //         };
    //         case null {
    //             assert (false);
    //             return "";
    //         };
    //     };
    // };

    public query func getAuction(id : Nat) : async ?Auction {
        return auctions[id];
    };

    public func checkDeadline(id : Nat) : async()  {
        switch (auctions[id]) {
            case (?auction) {
                if (auction.deadline < Time.now() / 1000000) {
                    if(auction.active) {
                        auctions[id] := ?{ auction with active = false };
                    };
                    
                };
            };
            case null {
                return;
            };
        };
    };
    public func getAuctions() : async [Auction] {
        let result = Array.init<Auction>(
            noOfAuctions,
            {
                id = 0;
                owner = Principal.fromText("aaaaa-aa");
                title = "";
                description = "";
                deadline = 0;
                basePrice = 0;
                minIncrement = 0;
                maxBid = 0;
                maxBidder = null;
                image = "";
                active = false;
            },
        );
        for (i in Iter.range(0, noOfAuctions-1)) {
            await checkDeadline(i);
            switch (auctions[i]) {
                case (?auction) {
                    result[i] := auction;
                };
                case null {
                    return [];
                };
            };
        };
        return Array.freeze(result);
    };

    public shared (msg) func bid(id : Nat, bidAmount : Nat) : async () {
        switch (auctions[id]) {
            case (?auction) {
                if (auction.maxBid >= bidAmount) {
                    throw Error.reject("Bid amount should be greater than the current max bid");
                };
                if (auction.deadline < Time.now() / 1000000) {
                    auctions[id] := ?{ auction with active = false };
                    throw Error.reject("Auction has ended");
                };
                if (auction.active == false) {
                    throw Error.reject("Auction is not active");
                };
                assert (auction.active);
                assert (auction.deadline > Time.now() / 1000000);
                assert (auction.maxBid < bidAmount);
                // For the development purspose, we are allowing the owner to bid
                // assert(auction.owner != msg.caller);
                auctions[id] := ?{
                    auction with maxBid = bidAmount;
                    maxBidder = ?msg.caller;
                };
            };
            case null {
                assert (false);
            };
        };
    };

};

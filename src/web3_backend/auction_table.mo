import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor class AuctionTable() {
    type Auction = {
        id : Nat;
        owner : Principal;
        title : Text;
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

    public shared(msg) func createAuction(title : Text, description : Text, basePrice : Nat, _deadline : Time.Time, image : Text) : async Nat {


        assert(_deadline+Time.now() > Time.now());
        assert(basePrice > 0);

        let auction : Auction = {
            id = noOfAuctions;
            owner = msg.caller;
            title = title;
            description = description;
            deadline = _deadline+Time.now();
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

    public shared(msg) func startAuction(id : Nat) : async () {
        assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                assert(auction.owner == msg.caller);
                auctions[id] := ?{auction with active = true};
            };
            case null {
                assert(false);
            };
        };
    };

    public shared(msg) func closeAuction(id : Nat) : async () {
        assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                assert(auction.owner == msg.caller);
                auctions[id] := ?{auction with active = false};
            };
            case null {
                assert(false);
            };
        };
    };

    public shared(msg) func changeDeadline(id : Nat, newDeadline : Int) : async () {
        assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                assert(auction.owner == msg.caller);
                assert(auction.deadline > Time.now());
                auctions[id] := ?{auction with deadline = newDeadline; active = true};
            };
            case null {
                assert(false);
            };
        };
    };

    public query func getMinIncrement(id : Nat) : async Nat {
        assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                auction.minIncrement / 100
            };
            case null {
                0
            };
        }
    };

    public func getAuction(id : Nat) : async ?Auction {
        // assert(id < noOfAuctions);
        return auctions[id];
        // switch (auctions[id]) {
        //     case (?auction) {
        //         if (auction.deadline < Time.now()) {
        //             await closeAuction(id);
        //         };
        //         auctions[id]
        //     };
        //     case null {
        //         null
        //     };
        // }
    };

    public func getAuctions() : async [Auction] {
        let result = Array.init<Auction>(noOfAuctions, {
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
        });
        for (i in Iter.range(0, noOfAuctions - 1)) {
            switch (auctions[i]) {
                case (?auction) {
                    result[i] := auction;
                };
                case null {
                    // Handle the case where the auction is null if necessary
                };
            };
            // switch (auctions[i]) {
            //     case (?auction) {
            //         if (auction.deadline < Time.now()) {
            //             await closeAuction(i);
            //         };
            //         result[i] := auction;
            //     };
            //     case null {};
            // };
        };
        Array.freeze(result)
    };

    public shared(msg) func bid(id : Nat, bidAmount : Nat) : async () {
        // assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                // assert(auction.active);
                // if (auction.deadline < Time.now()) {
                //     await closeAuction(id);
                //     assert(false);
                // };
                // assert(Time.now() < auction.deadline);
                assert(bidAmount > auction.maxBid);
                assert(bidAmount >= auction.basePrice);
                assert(Nat.sub(bidAmount, auction.maxBid) >= auction.minIncrement);
                auctions[id] := ?{auction with maxBid = bidAmount; maxBidder = ?msg.caller};
            };
            case null {
                assert(false);
            };
        };
    };

    // Note: Motoko doesn't have direct access to cryptocurrency transfers.
    // This function would need to be implemented differently, possibly using the Internet Computer's cycles or a separate token system.
    public shared(msg) func payBid(id : Nat) : async () {
        assert(id < noOfAuctions);
        switch (auctions[id]) {
            case (?auction) {
                assert(auction.active);
                switch (auction.maxBidder) {
                    case (?maxBidder) {
                        assert(maxBidder == msg.caller);
                    };
                    case null {
                        assert(false);
                    };
                };
                // Here you would implement the logic for transferring the bid amount
                // This might involve cycles, tokens, or other mechanisms specific to your use case


                auctions[id] := ?{auction with active = false};
            };
            case null {
                assert(false);
            };
        };
    };
}
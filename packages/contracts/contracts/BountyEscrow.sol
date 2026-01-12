// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BountyEscrow is Ownable {
    enum Status { Open, Assigned, Submitted, Completed, Cancelled }

    struct Bounty {
        uint256 id;
        address creator;
        string title;
        string descriptionURI; // IPFS
        uint256 amount;
        uint256 deadline;
        address assignedHunter;
        string submissionURI;
        Status status;
        uint256 createdAt;
    }

    uint256 public nextBountyId;
    mapping(uint256 => Bounty) public bounties;
    IERC20 public mneeToken;

    event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 amount);
    event BountyClaimed(uint256 indexed bountyId, address indexed hunter);
    event WorkSubmitted(uint256 indexed bountyId, string submissionURI);
    event BountyCompleted(uint256 indexed bountyId, address indexed hunter, uint256 amount);

    constructor(address _mneeToken) Ownable(msg.sender) {
        mneeToken = IERC20(_mneeToken);
        nextBountyId = 1;
    }

    function createBounty(string memory _title, string memory _descriptionURI, uint256 _amount, uint256 _duration) external {
        require(_amount > 0, "Amount must be > 0");
        
        mneeToken.transferFrom(msg.sender, address(this), _amount);

        bounties[nextBountyId] = Bounty({
            id: nextBountyId,
            creator: msg.sender,
            title: _title,
            descriptionURI: _descriptionURI,
            amount: _amount,
            deadline: block.timestamp + _duration,
            assignedHunter: address(0),
            submissionURI: "",
            status: Status.Open,
            createdAt: block.timestamp
        });

        emit BountyCreated(nextBountyId, msg.sender, _amount);
        nextBountyId++;
    }

    function claimBounty(uint256 _bountyId) external {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.status == Status.Open, "Bounty not open");
        require(block.timestamp < bounty.deadline, "Bounty expired");

        bounty.status = Status.Assigned;
        bounty.assignedHunter = msg.sender;

        emit BountyClaimed(_bountyId, msg.sender);
    }

    function submitWork(uint256 _bountyId, string memory _submissionURI) external {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.status == Status.Assigned, "Bounty not assigned");
        require(bounty.assignedHunter == msg.sender, "Not the designated hunter");

        bounty.status = Status.Submitted;
        bounty.submissionURI = _submissionURI;

        emit WorkSubmitted(_bountyId, _submissionURI);
    }

    function approveWork(uint256 _bountyId) external {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.creator, "Only creator can approve");
        require(bounty.status == Status.Submitted, "Work not submitted");

        bounty.status = Status.Completed;
        mneeToken.transfer(bounty.assignedHunter, bounty.amount);

        emit BountyCompleted(_bountyId, bounty.assignedHunter, bounty.amount);
    }
}

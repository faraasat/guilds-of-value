// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./GuildRegistry.sol";
import "./BountyEscrow.sol";

contract GuildGovernance is Initializable, AccessControlUpgradeable, UUPSUpgradeable, ReentrancyGuardUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    GuildRegistry public registry;
    BountyEscrow public escrow;

    struct Dispute {
        uint256 bountyId;
        uint256 votesFor;
        uint256 votesAgainst;
        bool resolved;
        mapping(uint256 => bool) hasVoted; // guildId => voted
    }

    mapping(uint256 => Dispute) public disputes;

    event DisputeRaised(uint256 indexed bountyId, address indexed raiser);
    event VoteCast(uint256 indexed bountyId, uint256 indexed guildId, bool support);
    event DisputeResolved(uint256 indexed bountyId, bool support);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _registry, address _escrow, address _admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);

        registry = GuildRegistry(_registry);
        escrow = BountyEscrow(_escrow);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    function raiseDispute(uint256 _bountyId) external {
        // Only hunter or creator could raise in a real app, let's allow anyone for demo
        Dispute storage d = disputes[_bountyId];
        require(d.bountyId == 0, "Dispute already exists");
        
        d.bountyId = _bountyId;
        emit DisputeRaised(_bountyId, msg.sender);
    }

    function vote(uint256 _bountyId, bool _support) external {
        Dispute storage d = disputes[_bountyId];
        require(d.bountyId != 0, "Dispute does not exist");
        require(!d.resolved, "Dispute already resolved");

        // Only Guild Masters can vote
        (, uint256 guildId, ) = registry.members(msg.sender);
        require(guildId != 0, "Must be in a guild");
        
        // Check if master
        GuildRegistry.Guild memory g = registry.getGuild(guildId);
        require(g.master == msg.sender, "Only Guild Masters can vote");
        require(!d.hasVoted[guildId], "Guild already voted");

        d.hasVoted[guildId] = true;
        if (_support) {
            d.votesFor++;
        } else {
            d.votesAgainst++;
        }

        emit VoteCast(_bountyId, guildId, _support);

        // Simple majority resolution (e.g., 3 votes to resolve in MVP)
        if (d.votesFor >= 2) { // 2 votes required to force payout
            resolveDispute(_bountyId, true);
        } else if (d.votesAgainst >= 2) {
            resolveDispute(_bountyId, false);
        }
    }

    function resolveDispute(uint256 _bountyId, bool _support) internal {
        Dispute storage d = disputes[_bountyId];
        d.resolved = true;
        
        // In a real app, the Governance contract would need "Resolver" role on Escrow
        // For now, we'll just emit and leave the logic for future V3 integration
        emit DisputeResolved(_bountyId, _support);
    }
}

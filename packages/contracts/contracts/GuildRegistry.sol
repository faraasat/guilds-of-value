// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GuildRegistry is Ownable {
    struct Guild {
        uint256 id;
        string name;
        address master;
        uint256 stake;
        string metadataURI; // IPFS hash for logo/desc
        bool exists;
    }

    struct Member {
        address memberAddress;
        uint256 guildId;
        uint256 joinedAt;
    }

    uint256 public nextGuildId;
    mapping(uint256 => Guild) public guilds;
    mapping(address => Member) public members;

    IERC20 public mneeToken;

    event GuildCreated(uint256 indexed guildId, string name, address indexed master, uint256 stake);
    event MemberJoined(uint256 indexed guildId, address indexed member);

    constructor(address _mneeToken) Ownable(msg.sender) {
        mneeToken = IERC20(_mneeToken);
        nextGuildId = 1;
    }

    function createGuild(string memory _name, uint256 _stake, string memory _metadataURI) external {
        require(members[msg.sender].guildId == 0, "Already in a guild");
        require(_stake > 0, "Stake must be > 0");

        mneeToken.transferFrom(msg.sender, address(this), _stake);

        guilds[nextGuildId] = Guild({
            id: nextGuildId,
            name: _name,
            master: msg.sender,
            stake: _stake,
            metadataURI: _metadataURI,
            exists: true
        });

        members[msg.sender] = Member({
            memberAddress: msg.sender,
            guildId: nextGuildId,
            joinedAt: block.timestamp
        });

        emit GuildCreated(nextGuildId, _name, msg.sender, _stake);
        emit MemberJoined(nextGuildId, msg.sender);

        nextGuildId++;
    }

    function joinGuild(uint256 _guildId) external {
        require(guilds[_guildId].exists, "Guild does not exist");
        require(members[msg.sender].guildId == 0, "Already in a guild");

        members[msg.sender] = Member({
            memberAddress: msg.sender,
            guildId: _guildId,
            joinedAt: block.timestamp
        });

        emit MemberJoined(_guildId, msg.sender);
    }
    
    function getGuild(uint256 _guildId) external view returns (Guild memory) {
        return guilds[_guildId];
    }
}

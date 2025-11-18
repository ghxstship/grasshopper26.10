// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TicketNFT
 * @dev NFT contract for GVTEWAY event tickets
 * Features:
 * - Minting tickets with metadata
 * - Transfer restrictions (optional)
 * - Ticket verification
 * - Event-specific tickets
 */
contract TicketNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to event ID
    mapping(uint256 => string) private _tokenEvents;
    
    // Mapping from token ID to ticket type
    mapping(uint256 => string) private _tokenTicketTypes;
    
    // Mapping from token ID to transferable status
    mapping(uint256 => bool) private _tokenTransferable;
    
    // Mapping from event ID to authorized minters
    mapping(string => mapping(address => bool)) private _eventMinters;

    // Events
    event TicketMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string eventId,
        string ticketType,
        string tokenURI
    );
    
    event TicketTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    event MinterAuthorized(string indexed eventId, address indexed minter);
    event MinterRevoked(string indexed eventId, address indexed minter);

    constructor() ERC721("GVTEWAY Ticket", "GVTKT") Ownable(msg.sender) {}

    /**
     * @dev Authorize an address to mint tickets for a specific event
     * @param eventId The event ID
     * @param minter The address to authorize
     */
    function authorizeMinter(string memory eventId, address minter) public onlyOwner {
        _eventMinters[eventId][minter] = true;
        emit MinterAuthorized(eventId, minter);
    }

    /**
     * @dev Revoke minting authorization for an address
     * @param eventId The event ID
     * @param minter The address to revoke
     */
    function revokeMinter(string memory eventId, address minter) public onlyOwner {
        _eventMinters[eventId][minter] = false;
        emit MinterRevoked(eventId, minter);
    }

    /**
     * @dev Check if an address is authorized to mint for an event
     * @param eventId The event ID
     * @param minter The address to check
     */
    function isAuthorizedMinter(string memory eventId, address minter) public view returns (bool) {
        return _eventMinters[eventId][minter] || owner() == minter;
    }

    /**
     * @dev Mint a new ticket NFT
     * @param to The address to mint to
     * @param eventId The event ID
     * @param ticketType The ticket type (e.g., "VIP", "General Admission")
     * @param uri The token URI (IPFS metadata)
     * @param transferable Whether the ticket can be transferred
     */
    function mintTicket(
        address to,
        string memory eventId,
        string memory ticketType,
        string memory uri,
        bool transferable
    ) public returns (uint256) {
        require(
            isAuthorizedMinter(eventId, msg.sender),
            "TicketNFT: caller is not authorized to mint for this event"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        _tokenEvents[tokenId] = eventId;
        _tokenTicketTypes[tokenId] = ticketType;
        _tokenTransferable[tokenId] = transferable;

        emit TicketMinted(tokenId, to, eventId, ticketType, uri);
        
        return tokenId;
    }

    /**
     * @dev Get the event ID for a token
     * @param tokenId The token ID
     */
    function getEventId(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "TicketNFT: token does not exist");
        return _tokenEvents[tokenId];
    }

    /**
     * @dev Get the ticket type for a token
     * @param tokenId The token ID
     */
    function getTicketType(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "TicketNFT: token does not exist");
        return _tokenTicketTypes[tokenId];
    }

    /**
     * @dev Check if a token is transferable
     * @param tokenId The token ID
     */
    function isTransferable(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "TicketNFT: token does not exist");
        return _tokenTransferable[tokenId];
    }

    /**
     * @dev Override transfer to enforce transferability rules
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        if (from != address(0)) {
            // Check transferability for existing tokens
            require(
                _tokenTransferable[tokenId],
                "TicketNFT: this ticket is non-transferable"
            );
        }

        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit TicketTransferred(tokenId, from, to);
        }
        
        return previousOwner;
    }

    /**
     * @dev Set transferability for a token (owner only)
     * @param tokenId The token ID
     * @param transferable The new transferability status
     */
    function setTransferable(uint256 tokenId, bool transferable) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "TicketNFT: token does not exist");
        _tokenTransferable[tokenId] = transferable;
    }

    /**
     * @dev Batch mint tickets for an event
     * @param recipients Array of recipient addresses
     * @param eventId The event ID
     * @param ticketType The ticket type
     * @param uris Array of token URIs
     * @param transferable Whether tickets can be transferred
     */
    function batchMintTickets(
        address[] memory recipients,
        string memory eventId,
        string memory ticketType,
        string[] memory uris,
        bool transferable
    ) public returns (uint256[] memory) {
        require(
            recipients.length == uris.length,
            "TicketNFT: recipients and URIs length mismatch"
        );
        require(
            isAuthorizedMinter(eventId, msg.sender),
            "TicketNFT: caller is not authorized to mint for this event"
        );

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = mintTicket(
                recipients[i],
                eventId,
                ticketType,
                uris[i],
                transferable
            );
        }

        return tokenIds;
    }

    /**
     * @dev Verify ticket ownership for an event
     * @param owner The address to check
     * @param eventId The event ID
     */
    function verifyTicketOwnership(address owner, string memory eventId) 
        public 
        view 
        returns (bool, uint256[] memory) 
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory eventTickets = new uint256[](balance);
        uint256 count = 0;

        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_ownerOf(i) == owner && 
                keccak256(bytes(_tokenEvents[i])) == keccak256(bytes(eventId))) {
                eventTickets[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = eventTickets[i];
        }

        return (count > 0, result);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

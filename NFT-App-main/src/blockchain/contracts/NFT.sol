// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFT {
    address public owner;
    address public treasuryWallet;
    address public liquidityWallet;

    uint256 public totalSupply;
    uint256 public royaltyFee = 10; // 10% royalty fee

    mapping(uint256 => address) public tokenOwners;
    mapping(uint256 => string) public tokenURIs; // Mapping to store token URIs

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address _treasuryWallet, address _liquidityWallet) {
        owner = msg.sender;
        treasuryWallet = _treasuryWallet;
        liquidityWallet = _liquidityWallet;
    }

    function mint(string memory _tokenURI) external payable {
        require(msg.value > 0, "Ether value sent should be greater than 0");

        uint256 tokenId = totalSupply + 1;
        totalSupply++;

        tokenOwners[tokenId] = msg.sender;
        tokenURIs[tokenId] = _tokenURI; // Store the token URI
        emit Transfer(address(0), msg.sender, tokenId);

        uint256 royaltyAmount = (msg.value * royaltyFee) / 100;
        uint256 treasuryShare = (royaltyAmount * 6) / 10;
        uint256 liquidityShare = (royaltyAmount * 4) / 10;

        (bool treasurySuccess, ) = treasuryWallet.call{value: treasuryShare}(
            ""
        );
        require(treasurySuccess, "Treasury transfer failed");

        (bool liquiditySuccess, ) = liquidityWallet.call{value: liquidityShare}(
            ""
        );
        require(liquiditySuccess, "Liquidity transfer failed");
    }

    function transfer(address _to, uint256 _tokenId) external {
        require(
            msg.sender == tokenOwners[_tokenId],
            "You do not own this token"
        );
        require(_to != address(0), "Invalid recipient address");

        tokenOwners[_tokenId] = _to;
        emit Transfer(msg.sender, _to, _tokenId);
    }
}

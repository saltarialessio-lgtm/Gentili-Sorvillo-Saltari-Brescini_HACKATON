// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HashStore {
    bytes32 public storedHash;
    address public owner;

    event HashUpdated(bytes32 newHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function setHash(bytes32 _hash) public {
        require(msg.sender == owner, "Only owner"); 
        storedHash = _hash;
        emit HashUpdated(_hash, block.timestamp);
    }

    function getHash() public view returns (bytes32) {
        return storedHash;
    }
}

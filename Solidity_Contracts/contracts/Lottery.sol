// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery{
    address public manager;
    address public lastWinner;
    address[] public players;

    constructor(){
        manager = msg.sender;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    function pickWinner() public restricted{
        uint index = random() % players.length;
        address winner = players[index];
        payable(winner).transfer(address(this).balance);
        lastWinner = winner;
        players = new address[](0);
    }

}

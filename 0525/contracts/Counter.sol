//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint256 value;
    event Count(uint256 value);

    constructor(){}

    function get() public view returns(uint256){
        return value;
    }

 
    function increment() public{
        value += 1;
        emit Count(value);
    }

    function decrement() public{
        value -= 1;
        emit Count(value);
    }
}

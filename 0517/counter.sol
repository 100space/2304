// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint private count;

    constructor() { 
        count = 0;
    }

    function getCount() public view returns (uint){
        return count ;
    }
    function increment () public {
        count++;
    }
    function decrement () public {
        require(count >0, "123" );
        count --;
    }
}
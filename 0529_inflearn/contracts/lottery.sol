//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract Lottery {
    address public owner;

    constructor() public {
        owner = msg.sender;// solidity에서 기본적으로 제공하는 전역변수 
    }
    function getSomValue() public pure returns(uint256 value){

    }
}
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract SimpleStore {
    uint256 public value;
    address public owner;
    
    constructor( uint256 _value){
        value = _value;
        owner = msg.sender;
    }
}
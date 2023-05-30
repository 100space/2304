//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AppleShop {
    //어떤 계정이 얼마의 사과를 가지고 있는지 확실하게 알기 위해서 객체형태로 관리하는 것이 좋다.
    mapping (address=>uint256) public myApple;

    function buy() public {
        myApple[msg.sender] += 1;
    }
}
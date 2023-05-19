// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter{
    uint256 value = 0;

    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns(uint256) {
        // 상태변수를 변화시키지 않고 바로 출력하기 위해서 view를 쓴다.
        return value;
    } 
} 
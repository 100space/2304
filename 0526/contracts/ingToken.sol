//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract IngToken {

    mapping(address => uint256) public balances;
    
    //ex.. 11ETH
    string public name = 'IngToken'; // 토큰이름
    string public symbol = 'ITK'; // 단위이름
    uint8 public decimals = 18; // 1symbol === 10^18
    uint256 public totalSupply = 1000 * 10 ** decimals; // 총 발행량

    //0xA
    constructor(){
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner) public view returns(uint256){
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns(bool) {
        //연산이 필요하기 때문에 send()가 된다... 가스를 소비한다.
        require(balances[msg.sender] >= _value); // false 이면 throw
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }
}


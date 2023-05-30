//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AppleShop {
    //어떤 계정이 얼마의 사과를 가지고 있는지 확실하게 알기 위해서 객체형태로 관리하는 것이 좋다.
    mapping (address=>uint256) public myApple;

    function buy() public payable {
        myApple[msg.sender] += 1;
    }

    function get() public view returns(uint256){
        return myApple[msg.sender];
    }

    //전체 환불
    function sell() public payable {
        uint256 refund = myApple[msg.sender] * 10 ** 18; //1
        myApple[msg.sender] = 0;

        //payalbe(msg.sender) : account 객체 리턴 ( nonce, account, storage, ...)
        payable(msg.sender).transfer(refund); // CA계정에서 가지고 있는 ETH를 의미한다.

        // transfer : solidity 내장 메서드
        // CA에서 payable을 이용해서 객체를 반환하고, 그 객체에게 ETH을 전달한다.

    }
}


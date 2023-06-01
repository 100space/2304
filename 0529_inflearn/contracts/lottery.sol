//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract Lottery {

    struct BetInfo {
        uint256 answerBlockNumber;
        address payable bettor;
        bytes challenges;
    }

    uint256 private _tail;
    uint256 private _head;
    mapping (uint256 => BetInfo) private _bets;
    address public owner;

    uint256 constant internal BLOCK_LIMIT = 256;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BET_AMOUNT = 5 * 10 ** 15; // 0.005
    uint256 private _pot;
    
    constructor() {
        owner = msg.sender;// solidity에서 기본적으로 제공하는 전역변수 
    }
    function getSomeValue() public pure returns(uint256 value){
        return 5;
    }
    function getPot() public view returns(uint256 pot){
        return _pot;
    }

    //Bet :save the bet 

    //Distribute : 결과값 검증

    function getBetInfo ( uint256 index) public view returns (uint256 answerBlockNumber, address bettor, bytes memory challenges){
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }

    function pushBet (bytes memory challenges) public returns(bool){
        BetInfo memory b;
        b.bettor = payable(msg.sender);
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL;
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail ++;
        return true;
    }

    function popBet(uint256 index) public returns (bool){
        //가스를 돌려받게 된다.
        delete _bets[index];
        return true;
    }
}
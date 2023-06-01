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
    
    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    event BET(uint256 index, address bettor, uint256 amount, bytes challenges, uint256 answerBlockNumber);

    constructor() {
        owner = msg.sender;// solidity에서 기본적으로 제공하는 전역변수 
    }

    function getPot() public view returns(uint256 pot){
        return _pot;
    }
    /**
     * @dev 베팅을 한다. 유저는 0.005 ETH를 보내야 하고, 베팅용 1byte 글자를 보낸다.
     * 큐에 저장된 베팅 정보는 이유 distribute 함수에서 해결된다.
     * @param challenges - 매개변수로 글자가 들어온다.
     * @return result 함수가 잘 실행 되었는지 확인하는 bool 값
     */
    //Bet :save the bet 
    function bet (bytes memory challenges) public payable returns (bool result){
        //check the proper ether is sent
        require(msg.value == BET_AMOUNT, "Not enough ETH");
        //push bet to the queue
        require(pushBet(challenges), "Fail to add ad new bet Info");
        // emit event
        emit BET(_tail - 1, msg.sender, msg.value, challenges, block.number + BET_BLOCK_INTERVAL);
        return true;
    } 
    //Distribute : 결과값 검증
    function destribute () public {
        uint256 cur;
        BetInfo memory b;
        BlockStatus currentBlockStatus;
        for (cur=_head; cur < _tail; cur++){
            b = _bets[cur];
            currentBlockStatus = getBlockStatus(b.answerBlockNumber);
            // checkalbe : block.number > AnswerBlockNumber &&  block.number - BLOCK_LIMIT <  AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.Checkable){
                // if win: bettor gets pot

                // if fail: bettor's money goes pot

                // if draw: refund bettor's money
            }
            // not revealed : block.number <= AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.NotRevealed){
                break;
            }
            // Block Limit Passed : block.number >= AnswerBlockNumber + BLOCK_LIMIT
            if(currentBlockStatus == BlockStatus.BlockLimitPassed){
                // refund
                // emit refund
            }
            popBet(cur);

        }
    }

    function getBlockStatus(uint256 answerBlockNumber) internal view returns(BlockStatus) {
        if(block.number > answerBlockNumber &&  block.number - BLOCK_LIMIT <  answerBlockNumber){
            return BlockStatus.Checkable;
        }
        if(block.number <= answerBlockNumber){
            return BlockStatus.NotRevealed;
        }
        if(block.number >= answerBlockNumber + BLOCK_LIMIT){
            return BlockStatus.BlockLimitPassed;
        }
        return BlockStatus.BlockLimitPassed;
    }


    function getBetInfo ( uint256 index) public view returns (uint256 answerBlockNumber, address bettor, bytes memory challenges){
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }

    function pushBet (bytes memory challenges) internal returns(bool){
        BetInfo memory b;
        b.bettor = payable(msg.sender);
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL;
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail ++;
        return true;
    }

    function popBet(uint256 index) internal returns (bool){
        //가스를 돌려받게 된다.
        delete _bets[index];
        return true;
    }
} 
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract Lottery {

    struct BetInfo {
        uint256 answerBlockNumber;
        address payable bettor;
        bytes1 challenges;
    }

    uint256 private _tail;
    uint256 private _head;
    mapping (uint256 => BetInfo) private _bets;
    address payable public owner;

    uint256 constant internal BLOCK_LIMIT = 256;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BET_AMOUNT = 5 * 10 ** 15; // 0.005
    uint256 private _pot=1;
    bool private mode = false; // false : testmode
    bytes32 public answerForTest;

    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    enum BettingResult {Fail, Win, Draw}
    event BET(uint256 index, address bettor, uint256 amount, bytes1 challenges, uint256 answerBlockNumber);
    event WIN(uint256 index, address bettor, uint256 amount, bytes1 challenges, bytes32 answer, uint256 answerBlockNumber);
    event FAIL(uint256 index, address bettor, uint256 amount, bytes1 challenges, bytes32 answer, uint256 answerBlockNumber);
    event DRAW(uint256 index, address bettor, uint256 amount, bytes1 challenges, bytes32 answer, uint256 answerBlockNumber);
    event REFUND(uint256 index, address bettor, uint256 amount, bytes1 challenges, uint256 answerBlockNumber);

    constructor() {
        owner = payable(msg.sender);// solidity에서 기본적으로 제공하는 전역변수 
    }

    function getPot() public view returns(uint256 pot){
        return _pot;
    }
    

     /**
     * @dev 베팅과 정답체크를 한다. 유저는 0.005 ETH를 보내야 하고, 베팅용 1byte 글자를 보낸다.
     * 큐에 저장된 베팅 정보는 이유 distribute 함수에서 해결된다.
     * @param challenges - 매개변수로 글자가 들어온다.
     * @return result 함수가 잘 실행 되었는지 확인하는 bool 값
     */

    function betAndDistribute(bytes1 challenges) public payable returns(bool result){
        bet(challenges);
        destribute();
        return true;
    }

    /**
     * @dev 베팅을 한다. 유저는 0.005 ETH를 보내야 하고, 베팅용 1byte 글자를 보낸다.
     * 큐에 저장된 베팅 정보는 이유 distribute 함수에서 해결된다.
     * @param challenges - 매개변수로 글자가 들어온다.
     * @return result 함수가 잘 실행 되었는지 확인하는 bool 값
     */
    //Bet :save the bet 
    function bet (bytes1 challenges) public payable returns (bool result){
        //check the proper ether is sent
        require(msg.value == BET_AMOUNT, "Not enough ETH");
        //push bet to the queue
        require(pushBet(challenges), "Fail to add ad new bet Info");
        // emit event
        emit BET(_tail - 1, msg.sender, msg.value, challenges, block.number + BET_BLOCK_INTERVAL);
        return true;
    } 


    /**
     * @dev 배팅 결과값을 확인하고 팟머니를 분배한다.
     * 정답 실패 : 팟머니 축척, 정답 맞춤 : 팟머니 획등, 한글자 맞춤or정답확인 불가 : 배팅금액만 획득
     */
    //Distribute : 결과값 검증
    function destribute () public {
        uint256 cur;
        uint256 transferAmount;

        BetInfo memory b;
        BlockStatus currentBlockStatus;
        BettingResult currentBettingResult;
        for (cur=_head; cur < _tail; cur++){
            b = _bets[cur];
            currentBlockStatus = getBlockStatus(b.answerBlockNumber);
            // checkalbe : block.number > AnswerBlockNumber &&  block.number - BLOCK_LIMIT <  AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.Checkable){
                bytes32 answerBlockHash = getAnswerBlockHash(b.answerBlockNumber);
                currentBettingResult = isMatch(b.challenges, getAnswerBlockHash(b.answerBlockNumber));
                // if win: bettor gets pot
                if(currentBettingResult == BettingResult.Win){
                    //transfer pot
                    transferAfterPayingFee(b.bettor, _pot + BET_AMOUNT);
                    //pot=0
                    _pot = 0;
                    //emit event WiN
                    emit WIN(cur, b.bettor, transferAmount, b.challenges, answerBlockHash[0], b.answerBlockNumber);

                }

                // if fail: bettor's money goes pot
                if(currentBettingResult == BettingResult.Fail){
                    //pot = pot + BET_AMOUNT
                    _pot += BET_AMOUNT;
                    //emit event Fail
                    emit FAIL(cur, b.bettor, 0, b.challenges,  answerBlockHash[0], b.answerBlockNumber);
                }

                // if draw: refund bettor's money
                if(currentBettingResult == BettingResult.Fail){
                    //transfer only BET_AMOUNT
                    transferAmount = transferAfterPayingFee(b.bettor, BET_AMOUNT);
                    //emit event Draw
                    emit DRAW(cur, b.bettor, transferAmount, b.challenges,  answerBlockHash[0], b.answerBlockNumber);
                }
            }
            // not revealed : block.number <= AnswerBlockNumber
            if(currentBlockStatus == BlockStatus.NotRevealed){
                break;
            }
            // Block Limit Passed : block.number >= AnswerBlockNumber + BLOCK_LIMIT
            if(currentBlockStatus == BlockStatus.BlockLimitPassed){
                // refund
                transferAmount = transferAfterPayingFee(b.bettor, BET_AMOUNT);
                // emit refund
                emit REFUND(cur, b.bettor, transferAmount, b.challenges, b.answerBlockNumber);
            }
            popBet(cur);
        }
        _head =  cur;
    }

    function transferAfterPayingFee(address payable addr, uint256 amount) internal returns (uint256){
        // uint256 fee =  amount/100;
        uint256 fee = 0;
        uint256 amountWithFee = amount - fee;

        //transfer to addr
        addr.transfer(amountWithFee);
        //transfer to owner
        owner.transfer(fee);
        return amountWithFee;
    }
    function setAnswerForTest (bytes32 answer) public returns(bool result){
        require(msg.sender == owner, "Only owner can set answer for test mode");
        answerForTest = answer;
        return true;
    }
    function getAnswerBlockHash(uint256 answerBlockNumber) internal view returns(bytes32 answer){
        return mode ? blockhash(answerBlockNumber) : answerForTest;
    }

    /**
     * @dev 배팅글자와 정답을 확인한다.
     * @param challenges 사용자가 배팅하는 배팅글자
     * @param answer 정답을 위한 블록해쉬
     * @return 정답결과
     */
    function isMatch (bytes1 challenges, bytes32 answer) public pure returns (BettingResult){
        // challenges 0xab
        // answer 0xab ... ff 32bytes
        bytes memory C = new bytes(2);
        
        C[0] = challenges[0] >> 4;
        C[0] = challenges[0] << 4;
        C[1] = challenges[0] << 4;
        C[1] = challenges[0] >> 4;

        bytes memory A = new bytes(2);

        A[0] = answer[0] >> 4;
        A[0] = answer[0] << 4;
        A[1] = answer[0] << 4;
        A[1] = answer[0] >> 4;
        
         if (A[0] == C[0] && A[1] == C[1]) {
            return BettingResult.Win;
        }
        if (A[0] == C[0] || A[1] == C[1]) {
            return BettingResult.Draw;
        }
        return BettingResult.Fail;
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


    function getBetInfo ( uint256 index) public view returns (uint256 answerBlockNumber, address bettor, bytes1 challenges){
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }

    function pushBet (bytes1 challenges) internal returns(bool){
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
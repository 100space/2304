//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//여태까지 썼던 import는 파일을 가져오는 느낌이지만, solidity에서는 코드만 불러오는 느낌이다.
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IngToken is ERC20 {
    constructor() ERC20("ingToken","ITK"){ // JS의 super 키워드랑 같다.
        _mint(msg.sender, 1000 * (10 ** 18));
    }
    
}   


// 스왑 컨트랙트 (펀딩에 가까움)
// 1 ETH <--> 100ITK
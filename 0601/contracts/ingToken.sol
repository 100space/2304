//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract IngToken is ERC721Enumerable, Ownable{
    uint256 public mint_price = 1 ether; // 1 * (10*18)
    uint256 constant public MAX_TOKEN_COUNT = 100;
     // 일반적으로 다른 언어에서는 멤버변수라고 하고, memory에 저장되지만, 솔리디티에서는 상태변수라고 하고 account storage에 저장이된다.
     mapping(uint256 => string) metadatas;
    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}
    
    function minting() public payable{
        require(msg.value >= mint_price, "Not enough ETH");
        require(MAX_TOKEN_COUNT > ERC721Enumerable.totalSupply() , "MAX TOKEN");


        uint256 tokenId = ERC721Enumerable.totalSupply() + 1;
        payable(Ownable.owner()).transfer(msg.value); // 받은 eth를 바로 전달한다.
        _mint(msg.sender, tokenId);
    }
    
    function tokenURI() public pure returns (string memory){
        // return metadatas[_tokenId];
        return "https://gateway.pinata.cloud/ipfs/QmPwjnvWYN4etA5eW4yAbWCTy2ukEC1Jj5417VLGyH5XpU/1/1.json";
    }
}

팀장 : 백종환
발표자 : 강찬수
배포자 : 이민수
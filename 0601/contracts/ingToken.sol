//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IngToken is ERC721 {
     // 일반적으로 다른 언어에서는 멤버변수라고 하고, memory에 저장되지만, 솔리디티에서는 상태변수라고 하고 account storage에 저장이된다.
     mapping(uint256 => string) metadatas;
    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}
    
    function _minting(uint256 _tokenId) public{
        _mint(msg.sender, _tokenId);
    }
    
    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        return metadatas[_tokenId];
        // return "https://gateway.pinata.cloud/ipfs/QmPwjnvWYN4etA5eW4yAbWCTy2ukEC1Jj5417VLGyH5XpU/1/1.json";
    }
}
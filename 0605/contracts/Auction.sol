//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auction  {
    ERC721 public NFT;

    struct TokenInfo{
        uint256 tokenId;
        uint256 price;
        string tokenURI;
    }

    // tokenId에 대한 가격을 매핑
    mapping(uint256 => uint256) public tokenPrices;

    // 배열에 tokenId 만 넣는다. 판매중인 토큰을 담는 변수이다.
    uint256[] public SaleTokenList;

    constructor(ERC721 _NFT){
        NFT = _NFT;
    } 
    
    //판매
    function SalesToken(uint256 _tokenId, uint256 _price) public {
        address tokenOwner = NFT.ownerOf(_tokenId);
        require(tokenOwner == msg.sender, "you are not NFT owner");
        require(_price > 0 );
        require(tokenPrices[_tokenId]==0, "Already sale" );// 이미 판매 진행중
        require(NFT.isApprovedForAll(msg.sender, address(this))); // 권한을 위임했는가 안했는가?
        
        tokenPrices[_tokenId] = _price;
        SaleTokenList.push(_tokenId);
    }

    // 구매
    function PurchaseToken(uint256 _tokenId) public payable {
        address tokenOwner = NFT.ownerOf(_tokenId);
        require(tokenOwner != msg.sender );
        require(tokenPrices[_tokenId] == msg.value);

        payable(tokenOwner).transfer(msg.value);    
        NFT.transferFrom(tokenOwner, msg.sender, _tokenId);

        tokenPrices[_tokenId] = 0;
        popSaleToken(_tokenId);
    }

    function popSaleToken(uint256 _tokenId) private returns (bool){
        for(uint256 i = 0; i < SaleTokenList.length; i++){
            if(SaleTokenList[i] == _tokenId) {
                SaleTokenList[i] = SaleTokenList[SaleTokenList.length - 1];
                SaleTokenList.pop();
                return true;
            }
        }
        return false;
    }

    // 프론트 단으로 값을 줄 때 메타데이터를 포함한 값을 주어야한다.
    function getSaleTokenList() public view returns (TokenInfo[] memory) {
        require(SaleTokenList.length > 0);
        TokenInfo[] memory list = new TokenInfo[](SaleTokenList.length);

        for(uint256 i = 0; i < SaleTokenList.length; i++){
            uint256 tokenId = SaleTokenList[i];
            uint256 price = tokenPrices[tokenId];
            string memory tokenURI = NFT.tokenURI(tokenId);
            
            list[i] = TokenInfo(tokenId, price, tokenURI);
        } 

        return list;
    }
}
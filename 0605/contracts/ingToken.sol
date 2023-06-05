//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract IngToken is ERC721Enumerable, Ownable{
    uint256 public mint_price = 1 ether; // 1 * (10*18)
    uint256 constant public MAX_TOKEN_COUNT = 100;
     // 일반적으로 다른 언어에서는 멤버변수라고 하고, memory에 저장되지만, 솔리디티에서는 상태변수라고 하고 account storage에 저장이된다.
     mapping(uint256 => string) metadatas;
    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}
    

    // 1가지 타입에 2가지 이상의 타입을 지정하고 싶을 때 사용하는 키워드이며
    // 객체처럼 사용한다.
    struct TokenData { 
        uint256 Rank;
        uint256 Type;
    }

    mapping (uint => TokenData) public tokenDatas;

    function minting() public payable{
        require(msg.value >= mint_price, "Not enough ETH");
        require(MAX_TOKEN_COUNT > ERC721Enumerable.totalSupply() , "MAX TOKEN");


        uint256 tokenId = ERC721Enumerable.totalSupply() + 1;

        TokenData memory data = getRandomNum(msg.sender, tokenId); // {Rank:1, Type:2}
        tokenDatas[tokenId] = data;

        payable(Ownable.owner()).transfer(msg.value); // 받은 eth를 바로 전달한다.
        _mint(msg.sender, tokenId);
    }
    
    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        string memory Rank = Strings.toString(tokenDatas[_tokenId].Rank); // {rank:4, type:1}
        string memory Type = Strings.toString(tokenDatas[_tokenId].Type); // {rank:4, type:1}
        
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/QmUsEKtVS5Gn4rZWbYfD7D4qLLKPf1YbsBWYaSqtmCPBzf",Rank,"/",Type,".json"));
    }

    //pure 인 이유는 data 가 memory이기 때문에 상태변수를 가져다가 쓰는 것이아닌 지금 당장 만들어서 보내는 것이기 때문이다.
    function getRandomNum(address _msgSender, uint256 _tokenId) private pure returns(TokenData memory) {

        //keccak256
        // byte는 어떤 형태로도 변환이 가능하다 그래서 uint256타입으로 변경해서 사용한다.
        // msg.sender + tokenId
        uint256 randomNum = uint256(keccak256(abi.encodePacked(_msgSender, _tokenId)))%100;
        // 0~24  1
        // 25~49  2
        // 50~74  3
        // 75~99  4
        // data.Rank = randomNum을 뽑아서 지정된 범위 1~4중에 하나
        // data.Type = randomNum을 뽑아서 지정된 범위 1~4중에 하나

        TokenData memory data;

        if (randomNum < 5) {
            if (randomNum == 1) {
                data.Rank = 4;
                data.Type = 1;
            } else if (randomNum == 2) {
                data.Rank = 4;
                data.Type = 2;
            } else if (randomNum == 3) {
                data.Rank = 4;
                data.Type = 3;
            } else {
                data.Rank = 4;
                data.Type = 4;
            }
        } else if (randomNum < 13) {
            if (randomNum < 7) {
                data.Rank = 3;
                data.Type = 1;
            } else if (randomNum < 9) {
                data.Rank = 3;
                data.Type = 2;
            } else if (randomNum < 11) {
                data.Rank = 3;
                data.Type = 3;
            } else {
                data.Rank = 3;
                data.Type = 4;
            }
        } else if (randomNum < 37) {
            if (randomNum < 19) {
                data.Rank = 2;
                data.Type = 1;
            } else if (randomNum < 25) {
                data.Rank = 2;
                data.Type = 2;
            } else if (randomNum < 31) {
                data.Rank = 2;
                data.Type = 3;
            } else {
                data.Rank = 2;
                data.Type = 4;
            }
        } else {
            if (randomNum < 52) {
                data.Rank = 1;
                data.Type = 1;
            } else if (randomNum < 68) {
                data.Rank = 1;
                data.Type = 2;
            } else if (randomNum < 84) {
                data.Rank = 1;
                data.Type = 3;
            } else {
                data.Rank = 1;
                data.Type = 4;
            }
        }

        // data.Rank = 1;
        // data.Type = 2;

        return data;
    }
}


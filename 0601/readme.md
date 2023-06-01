# NFT 기초

NFT는 대체 불가능한 토큰이다. 모양은 같지만 고유의 식별자가 있기 때문에 각각의 NFT는 다르다.
영화표를 생각해보면 영화표 자체의 모양은 같다. 하지만 내부에 적혀있는 내용이 다르다.

<br/><br/><br/>

# **1. 민팅 (Minting)**

블록체인에서 새로운 토큰을 생성하는 과정을 의미하며, ERC20 표준을 이용해서 일반적인 토큰(대체 가능한)을 만들고, ERC721 표준을 이용해서 NFT(대체 불가능한)을 만든다.

토큰(ERC20)은 생성할 때 내부 데이터가 중요한 것이 아닌 수량에 의미를 두지만, NFT(ERC721)는 생성할 때 포함되는 데이터가 중요하고 그 데이터는 객체의 형태로 생각하면 이해하기 쉽다.

객체를 이용한 토큰이기 때문에 NFT를 구현하는 컨트랙트 코드는 mapping을 이용한 데이터 지정이 많다. 하지만 객체로 NFT를 민팅하는 과정에서 포함되는 데이터의 종류 및 내용은 어떠한 것도 들어가도 문제가 되지 않기 때문에 민팅의 의미는 객체를 만드는 과정까지라고 말할 수 있다.

<br/><br/><br/>

# **2. NFT 구조 및 Metadata**

```json
{
    "id": "",
    "tokenURI": "http://www.exam.com/adsf/zczcx.json"
}
```

일반적인 NFT의 구조는 고유 식별자인 Id와 tokenURI가 포함된 객체 형태이다.
tokenURI는 NFT에 포함된 데이터에 대한 metadata의 URL이다.
데이터에 대한 상세한 정보를 JSON형태 만들어준다.
PINATA(IPFS 시스템)같은 시스템을 이용해서 업로드를 한 후 URL을 생성해서 사용한다. 이 URL이 TokenURI이다.

<br/><br/><br/>

# **3. ERC721 표준**

NFT는 객체 형태로 되어있다. 간단하게 표현하자면 아래와 같이 표현이 가능하다.

```json
// tokenId : address
{
    "1": "0x0001",
    "2": "0x0002",
    "3": "0x0003",
    "4": "0x0004"
}
```

NFT는 tokenId를 이용해서 소유자의 address를 찾는 것을 쉽게 구현할 수 있지만, 반대로 address를 이용해서 tokenId를 찾는 것은 어렵다. 하나의 Address가 여러 개의 NFT를 보유할 수 있는 일대다 관계이기 때문이다.

기본적으로 제공되는 방법이 아닌 address를 가지고 모든 tokenId의 반복을 돌면서 address와 일치하는 tokenId를 구하는 방법으로 구현할 수 있다. (ex : balanceOf 함수를 이용해서 address가 보유한 NFT의 수량을 알 수 있기 때문에 tokenId의 반복을 돌면서 balanceOf의 갯수가 나오면 종료하는 방식으로 구할 수 있다.)

# **4. ERC721 표준을 이용한 NFT 발행**

```sol

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IngToken is ERC721 {
    mapping(uint256 => string) metadatas;
    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}

    function _minting(uint256 _tokenId) public{
        _mint(msg.sender, _tokenId);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        // return metadatas[_tokenId];
        return "https://gateway.pinata.cloud/ipfs/QmPwjnvWYN4etA5eW4yAbWCTy2ukEC1Jj5417VLGyH5XpU/1/1.json";
    }
}
```

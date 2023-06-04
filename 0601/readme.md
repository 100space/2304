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

<br/><br/><br/>

# **4. ERC721 표준을 이용한 NFT 발행**

```sol

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IngToken is ERC721 {
    constructor(string memory _name, string memory _symbol)ERC721(_name, _symbol){}

    function _minting(uint256 _tokenId) public{
        _mint(msg.sender, _tokenId);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory){
        return "https://gateway.pinata.cloud/ipfs/QmPwjnvWYN4etA5eW4yAbWCTy2ukEC1Jj5417VLGyH5XpU/1/1.json";
    }
}
```

기본적인 NFT 민팅을 위한 컨트랙트 코드이다.
현재는 JSON을 고정적인 값을 넣어주기 때문에 생성된 NFT가 똑같은 메타데이터를 가지고 만들어진다.

각각의 데이터를 개별적인 메타데이터로 만들기 위해서 URL을 반환하는 함수나 어떠한 로직을 이용해서 개별적인 URL을 반환하도록 해서 반환받은 각각 다른 URL을 이용해서 민팅을 하도록 한다.

# ERC721 표준 메서드 종류 및 역할

ERC721은 대체 불가능한 토큰(NFT)를 생성할 때 사용하는 ERC표준이다.
NFT는 객체 형태와 유사하기 때문에, 상태변수가 mapping 타입으로 되어있는 것이 많다.

<br>
<br>
<br>

## ERC721 표준 상태변수

**1. string private \_name** : 토큰의 이름을 저장한다.

**2. string private \_symbol** : 토큰의 심볼(단위)을 저장한다.

**3. mapping(uint256 => address) private \_owners** : \_owner는 특정토큰에 대한 소유자 주소로 매핑이 되어있으며 형태는 아래와 같다.

```json
{
    "tokenId": "address"
}
```

**4. mapping(address => uint256) private \_balances** : 계정과 계정이 소유하고 있는 토큰의 수량으로 매핑이 되어있으며, 계정을 이용해서 토큰의 갯수를 구할 수 있다.

```json
// 예를들어 "0x0000 계정에 NFT가 2개 있다면
{
    "0x0000": 2
}
```

**5. mapping(uint256 => address) private \_tokenApprovals** : 토큰Id와 그 토큰Id에 대한 권한이 있는 계정이 매핑되어 있으며, 토큰Id를 이용해서 토큰Id를 전송할 수 있는 계정을 확인할 수 있다.

```json
{
    "tokenId": "address"
}
```

**6. mapping(address => mapping(address => bool)) private \_operatorApprovals** : 중첩 매핑으로 소유자의 토큰을 권한받은 계정과 승인여부에 대해서 매핑이 되어있다.
승인 상태를 "\_operatorApprovals[소유자계정][대리인계정]"으로 확인할 수 있다.

```json
// 예를 들어 0x0000 계정이 0x1234 계정에게 토큰에 대한 권한을 주었다면
{
    "0x0000": {
        "0x1234": true
    }
}
```

<br>
<br>
<br>

## ERC721 표준 메서드 분석하기

**1. supportsInterface(bytes4 interfaceId)** : 퍼블릭 함수 - 주어진 인터페이스ID가 맞는지 확인하는 함수이다. ERC721표준을 지켜서 NFT를 생성하게 되면 "0x80ac58cd" 값이 맞는지를 확인하는 것이고, T/F로 반환된다.

**2. balanceOf(address owner)** : 퍼블릭 함수 - 특정 주소의 NFT토큰의 갯수를 구하는 함수이다. 해당 컨트랙트의 상태변수로 계정별 토큰의 갯수를 관리하고 있다.

**3. ownerOf(uint256 tokenId)** : 퍼블릭 함수 - 특정 토큰ID를 가지고 있는 계정의 주소를 반환하는 함수이다.

**4. name()** : 퍼블릭 함수 - NFT의 이름을 반환하는 함수이다.

**5. symbol()** : 퍼블릭 함수 - NFT의 심볼(단위)를 반환하는 함수이다.

**6. tokenURI(uint256 tokenId)** : 퍼블릭 함수 - 토큰ID의 URI를 반환하는 함수이다. 보통 json이 업로드 된 경로이다.

**7. \_baseURI()** : 내부 함수 - 필요에 따라 baseURI를 지정하는데 사용하는 함수이다.

**8. approve(address to, uint256 tokenId)** : 퍼블릭 함수 - "to"에게 토큰ID에 해당 하는 NFT를 거래할 수 있는 권한을 주는 함수이다.

**9. getApproved(uint256 tokenId)** : 퍼블릭 함수 - 토큰ID의 권한을 가지고 있는 계정을 반환하는 함수이다. \_tokenApprovals에서 값을 찾는다.

**10. setApprovalForAll(address operator, bool approved)** : 퍼블릭 함수 - 특정 주소가 가지고 있는 모든 NFT에 대한 권한을 부여할 때 사용한다.

**11. isApprovedForAll(adress owner, address operator)** : 퍼블릭 함수 - operator에게 owner가 모든 NFT의 권한을 승인했는지 확인할 때 사용하는 함수이다.

**12. transferFrom(address from, address to, uint256 tokenId)** : 퍼블릭 함수 - NFT를 전송할 때 사용하는 함수이다. (권한을 받은 계정이 사용하는 메서드이다.)

**13. safeTransferFrom(address from, address to, uint256 tokenId)** : 퍼블릭 함수 - 토큰을 안전하게 다른 주소로 이동하기 위해서 사용하는 메서드이다.

**14. safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)** : 퍼블릭 함수 - 토큰을 안전하게 다른 주소로 이동하고 데이터를 전달하는 함수이다.

**15. \_safeTransfer(address from, address to, uint256 tokenId, bytes memory data)** : 내부 함수 - 토큰을 안전하게 이동하는 내부 함수이다.

**16. \_ownerOf(uint256 tokenId)** : 내부 함수 - tokenId를 이용해서 토큰의 소유자의 주소를 반환하는 함수이다.

**17. \_exists(uint tokenId)** : 내부 함수 - 특정 tokenId가 존재하는지 확인하는 함수이다 (T/F)

**18. \_isApprovedOrOwner(address spender, uint256 tokneId)** : 내부 함수 - token의 소유자이거나, 승인을 받은 계정인지를 확인하는 함수이다.

**19. \_safeMint(address to, uint256 tokenId)** : 내부 함수 - 특정 주소에 토큰 ID를 안전하게 발행하는 함수이다.

**20. \_safeMint(address to, uint256 tokenId, bytes memory data)** : 내부 함수 - 특정 주소에 토큰 ID를 안전하게 발행하고, 데이터를 전달하는 함수이다.

**21. \_mint(address to, uint256 tokenId)** : 내부 함수 - 특정 주소로 토큰 Id를 발행하는 함수이다.

**22. \_burn(uint256 tokenId)** : 내부 함수 - 특정 토큰 Id를 소각하는 함수이다.

**23. \_transfer(address from, address to, uint256 tokenId)** : 내부 함수 - 토큰을 다른 주소로 이동하는 함수이다.

**24. \_approve(address to, uint256 tokenId)** : 내부 함수 - 특정 주소에 tokenId에 대한 권한을 주는 함수 이다.

**25. \_setApprovalForAll(address owner, address operator, bool approved)** : 내부 함수 - 특정 주소에 대해서 모든 토큰을 승인 하는 함수이다.

**26. \_requireMinted(uint256 tokenId)** : 내부 함수 - tokenId가 발행 되었는지 확인하는 함수이다. require()를 이용한 예외처리를 할 때 사용할 수 있다.

**27. \_checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data)** : 내부 함수 - 수신하는 주소가 ERC721 인터페이스를 구현했는지 확인하는 함수이다.

**28. \_beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)** : 내부함수 - 토큰을 이동시키기 전에 실행하는 로직이며, 커스텀하여 사용할 수 있다. 4번째 인자값의 batchSize는 한번에 보내게 되는 NFT의 수량이다.

**29. \_afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)** : 내부함수 - 토큰을 이동한 후에 실행하는 로직이며, 커스텀하여 사용할 수 있다. 4번째 인자값의 batchSize는 한번에 보내게 되는 NFT의 수량이다.

**30. \_\_unsafe_increaseBalance(address account, uint256 amount)** : 내부함수 - 특정 주소의 토큰 잔액을 증가시키는 내부 함수이다.

.
.
.
.
.
**3. name()**

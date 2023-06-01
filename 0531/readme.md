# NFT

# **1. NFT란?**

NFT는 Non-Fungible Token의 약자로 대체 불가능한 토큰으로 고유의 값을 갖는 것이 특징이다.
대체 불가능한 토큰이기 때문에 디지털 자산의 소유권을 보장할 수 있다.

'대체 불가능한'의 의미는 토큰안에 있는 내용이 대체 불가능한 것이 아니라, 그 토큰 자체가 고유하다는 것을 의미한다. 조금 더 쉽게 말하자면 NFT는 객체이다.

javascript의 문법을 이용해서 이해해보자면

```js
const a = {}
const b = {}

console.log(a === b) // false
```

빈 객체 2개는 서로 같지 않다.
내용이 빈 값으로 같지만 두개의 객체는 서로 다른 메모리 주소를 가지고 있기 때문에 같지 않다는 값이 나온다.

NFT는 위의 예시와 유사한 개념을 가지고 있다. 각각의 NFT는 각각 다른 객체의 형태를 가지고 있기 때문에 설령 안에 있는 내용이 같은 값이더라도 두개는 다른 값을 의미한다. 그렇게 때문에 고유성을 갖고 대체 불가능하다는 의미를 갖게 되는 것이다.

<br/><br/><br/>

# **2. NFT 구조**

NFT로 많이 알고 있는 분야가 그림 분야이다. 하지만 NFT에는 어떠한 데이터도 포함 될 수 있다.
그림을 포함하는 NFT의 구조를 보면

```js
const nft = {
    tokenId: "0x1234", // 고유 값
    url: "https://example.com/data.json",
}
```

이런식으로 간단한 구조로 되어있다. 이미지나 비디오, 음악 파일 등 어떠한 데이터도 들어 올 수 있지만, 직접적으로 데이터를 객체에 포함시키면 한번의 트렌잭션에 너무 많은 내용이기 때문에, 가스소비가 심하게 될 것이다. 그래서 다른 곳에 데이터를 저장하고, 그 저장한 데이터의 url을 포함하는 객체로 nft를 만든다.

데이터를 저장하는 곳은 일반적인 DB 같은 곳에서 저장하고 url만 가져와도 되지만 일반적인 DB를 이용하는 경우 탈중앙화라고 보기 어렵다. 그래서 분산 파일 시스템(IPFS)에 저장을 하고 url을 이용해서 요청하고 데이터를 가져올 수 있다.

<br/><br/><br/>

# **3. IPFS**

NFT에 들어갈 수 있는 여러 종류의 데이터를 직접적으로 nft객체에 담는 것이 아닌 외부 저장소를 이용하는데 IPFS를 이용하여서 해당 데이터의 URL또는 해시값을 NFT객체에 담는다.

IPFS(분산 파일 시스템)을 이용해서 데이터를 저장한다. IPFS는 데이터를 P2P 네트워크 상에 분산저장하는 프로토콜이다.

IPFS도 P2P 네트워크이기 때문에 P2P네트워크에 참여하기 위해서 직접 노드를 이용해서 참여해서 저장을 해야한다.
하지만 블록체인과 비슷하게 관리를 위해서 많은 시간과 자원이 들기 때문에 블록체인의 infura와 비슷한 개념으로 IPFS Provider인 PINATA를 이용한다.

PINATA를 통해 파일을 업로드하고, IPFS네트워크에 저장할 수 있고, 고유한 URL을 생성하여 URL을 통해서 저장된 데이터에 접근할 수 있다. 이로인해 탈중앙화된 데이터 저장과 공유가 가능하다.

# ERC20 표준 토큰 만들기

## **1. ERC 표준 라이브러리**

오픈제플린 프레임워크에서 제공하는 라이브러리로 ERC-20 토큰, ERC-721 토큰, 컨트랙트 소유권 관리, 엑세스 제어, 타이밍 제어 등의 기능을 포함한 컨트랙트에 대한 표준을 라이브러리로 만들어 제공하므로 스마트 컨트랙트 개발자가 ERC 토큰 표준을 따르면서 토큰을 발행할 수 있도록 도와주는 라이브러리이다.

```sh
$ npm init -y
$ npm install @openzeppelin/contracts
```

ERC20 표준으로 토큰을 만들기 위해서 스마트 컨트랙트 라이브러리를 활용하여 표준의 가이드라인을 지키면서 토큰을 발행하는 스마트 컨트랙트를 작성할 수 있다.

## **2. token/ERC20.sol 파악하기**

openZeppelin에서 제공하는 ERC20 라이브러리의 함수를 확인하고, 각각의 하는 역할을 확인해보려 한다.
파일 내에 있는 주석을 다 지운 상태로 컨트렉트 코드만 보면 아래와 같다.

```sol
// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./extensions/IERC20Metadata.sol";
import "../../utils/Context.sol";

contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    string private _name;
    string private _symbol;


    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}

    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
}

```

**1. name()** : 토큰의 이름을 반환한다.

**2. symbol()** : 토큰의 심볼(단위)를 반환하는 함수이다. (BTC, ETH, ...)

**3. decimals()** : 토큰의 소수점 자리수를 반환한다. 기본적으로 18로 지정되어 있다. (1 ETH = 1 \* 10 \*\* 18)

**4. totalSupply()** : 토큰의 총 발행량을 반환한다. \_mint 함수를 사용하여 자신이 원하는 주소에 초기 발행량을 지정할 수 있다.

**5. balanceOf(address account)** : 매개변수로 전달되는 account의 토큰 잔액을 반환한다.

**6. transfer(address to, uint256 amount)** : 다른 주소로 토큰을 전송할 때 사용하는 메서드이다. 첫번 째 인자값에 토큰을 받는 사람, 두번 째 인자값으로 보낼 값을 적는다.

**7. allowance(address owner, address spender)** : owner가 spender에게 사용할 수 있는 권한을 부여한 **토큰의 양을 반환**하는 메서드이다. owner가 실제 토큰의 소유자이고, spender가 대행업체라고 생각하면 이해하기 쉽다.
(ex : 1000원을 가진 owner의 돈중에서 spender가 쓸 수 있는 돈은 500원이라 했을 때, 이 함수의 반환값은 500원이다.)

**8. approve(address spender, uint256 amount)** : 함수를 사용하는 owner는 spender에게 특정 amount 만큼만 사용할 권한을 부여할 수 있다. (ex : 1000월 가진 owner가 spender에게 500원을 쓸 수 있다고 지정할 때 사용된다. allowance()함수를 호출하기 전에 사용된다.)

**9. transferFrom(adress from, address to, uint256 amount)** : 대행업체가 권한을 얻은 돈(500원)을 제3자에게 보낼 때 쓰는 메서드로 amount 값은 allowance()의 값과 같거나 작아야 한다.

**10. increaseAllowance(address spender, uint256 addedValue)** : 사용할 수 있는 토큰의 양을 더 늘리고 싶을 때 사용하는 메서드이다. (ex : 500원의 권한이 있는 spender에게 300원(addedValue)의 권한을 더 줄 때 사용한다.)

**11. decreaseAllowance(address spender, uint256 subtractedValue)** : 사용할 수 있는 토큰의 양을 줄일 떄 사용하는 메서드이다. (ex : 800원의 권한이 있는 spender에게 200원의 권한을 감소(600원만 권한을 주고싶다)시키고 싶을 때 사용한다. subtractedValue(200원)의 값은 allowance(800원)의 반환값보다 작아야 한다.)

**12. \_transfer(address from, address to, uint256 amount)** : from의 계좌에서 to의 계좌로 amount만큼의 토큰을 전송할 때 쓰는 메서드이다. 해당 컨트랙트 내에서만 쓸 수 있는 **내부함수**로 **외부에서 쓸 때는 위에서 설명했던 trensfer을 이용한다.** transfer 함수에서 \_transfer를 사용하여 실질적으로 전송하는 메서드이다.

**13. \_mint(address account, uint256 amount)** : account의 계좌로 지정된 수량만큼의 토큰을 발행해서 추가하는 **내부함수**이다. 이 메서드를 사용하면 총 발행량 자체가 증가하고 생성된 amount를 account에 전송해준다.

**14. \_burn(address account, uint256 amount)** : account 에서 지정된 수량의 토큰을 소각하는 **내부함수**이다. 해당 account에서 amount만큼을 차감되고, 총 공급량이 감소한다. 너무 많은 수량의 토큰이 발행되면 가치가 떨어지기 때문에 소각하여 토큰의 가치를 올릴 수 있다.

**15. \_approve(address owner, address spender, uint256 amount)** : owner가 spender에게 토큰을 사용할 수 있는 권한을 주기 위한 메서드이며, **내부함수**이다. 위에서 사용한 approve의 내부에서 사용되며, 외부에서 approve함수를 이용하면 실제로 \_approve의 함수가 동작을 하여 처리하는 것이다.

**16. \_spendAllowance(address owner, address spender, uint256 amount)** : transferFrom 함수가 실행될 때 실행되는 **내부함수**로 허용량을 소비하는 함수이다.
(ex : 500원을 사용할 수 있는 권한이 있을 때, 200원을 transferFrom으로 전송을 하고 나면 다음에 가지고 있는 spender가 소비할 수 있는 권한이 있는 amount는 300원이다.) 이 함수는 직접 전송을 하는 것이 아닌 권한이 있는 토큰의 양을 관리하는 함수이다.

**17. \_beforeTokenTransfer(address from, address to, uint256 amount)**: 토큰 전송 전에 실행되는 함수이다. 필요할 경우 재정의하여 추가 로직을 실행할 수 있다. 기본상태는 로직이 없는 상태이다.

**18. \_afterTokenTransfer(address from, address to, uint256 amount)**: 토큰 전송 후에 실행되는 함수이다. 필요할 경우 재정의하여 추가 로직을 실행할 수 있다. 기본상태는 로직이 없는 상태이다.

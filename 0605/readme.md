# Transaction

이더리움 네트워크에서 스마트 컨트랙트와 관련된 트랜잭션인지 확인할 수 있는 방법은 data 속성의 여부로 판단할 수 있다.

```js
const tx = {
    to: "",
    from: "",
    value: "",
    data: "",
    // 추가적인 데이터
}
```

위와 같이 트랜잭션 내에 data 속성이 있으면 스마트 컨트랙트 코드가 포함 되었고 없으면 EOA간의 거래를 의미한다.

# struct

solidity 문법에서의 struct 키워드는 1가지 타입으로 2가지이상의 타입을 지정하고 싶을 때 사용한다. 일종의 인터페이스 같은 느낌으로 객체로 표현한다.

```sol
    struct tokenData {
        uint256 Rank;
        uint256 Type;
    }

    mapping (uint => tokenData) public tokenDatas;
```

이 형태는 아래와 같이 표현할 수 있다.

```json
{
    "1": {
        "Rank": 1,
        "Type": 2
    }
}
```

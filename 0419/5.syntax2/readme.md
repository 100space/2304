<!-- 5. syntax2 -->

# Typescript 문법

-   변수
-   기본 타입
-   배열
-   인터페이스
-   클래스 ( 접근 제한자 )
-   함수
-   제네릭

# 변수

JS와 다르게 변수 옆에 변수에 들어올 데이터 타입에 대해서 명시를 해주는 것이 기본 문법이다.
작성 형태는 변수 옆에 콜론(:)을 작성하고 데이터 타입을 작성한다.

```js
// JS 변수 선언
let num = 10
const string = "hello JS"

// TS 변수 선언
let num2: number = 10
let string2: string = "hello TS"
```

타입스크립트가 타입 추론을 할 수 있기 때문에 기본적인 데이터 타입을 안적어도 에러를 발생하지 않는다.
하지만 명시했을 때 좋은 점은 변수의 데이터타입에 따른 메서드 같은 에디터에서 제공하는 것을 명확하게 볼 수 있기 때문에 좋다.

원래 타입을 지정한다는 것은 다른 언어에서는 크기까지 지정하는 것이 기본이지만 TS에서는 value의 타입만 바라본다.

# TypeScript에서의 타입(Type)

TypeScript는 이름에서 알 수 있듯 타입을 지정하여서 작성하기 때문에, type에 대해서 잘 알아야 한다.

## Number type

```ts
const num: number = 10
const float: number = 3.14
const nan: number = NaN
const infinity: number = Infinity
```

number 타입은 정수, 소수, NaN, Infinity를 포함한다.

## String type

```ts
const str: string = "Hello"
const str: string = "한글"
```

string 타입은 글자, 문자열을 같은 텍스트 값을 말한다.

## Boolean type

```ts
const boll: boolean = true
```

boolean type은 true/false를 나타낸다. 둘 중 하나의 값을 가질 수 있다.

## Null, Undefined type

```ts
let nullValue: null = null
let undefinedValue: undefined = undefined
```

값이 없음, 알 수 없음을 뜻하는 null과, undefined도 데이터 타입으로 사용할 수 있다.

## Void type - function

```ts
// 화살표 함수
{
    const print = ():void => {
        console.log("hello")
    }
}
// 함수 선언식
{
    const print():void{
        console.log("hello")
    }
}
```

함수에서 return 값이 없는 경우는 데이터 타입을 void로 지정할 수 있다.
화살표 함수와 함수 선언식에서의 데이터 타입을 적는 위치가 헷갈릴 수 있으니 기억하자.
return 값이 없이 함수를 만들고, 데이터 타입을 지정하지 않으면 기본적으로 void가 지정되어 있다.

### 함수에 데이터 타입 지정하기

```ts
// return 값이 없는 함수
const print = (str: string): void => {
    console.log(str)
}
print("hello")

// return 값이 있는 함수
const sum = (a: number, b: number): number => a + b
const result = sum(1, 2)

// sum("a", "b") // Error 발생
```

리턴 값에 따라서 데이터타입을 지정하고, 함수의 매개변수에도 데이터 타입을 지정해야 한다.
리턴 값의 데이터 타입이 지정되었기 때문에 result의 데이터 타입을 추론할 수 있다.

## never type

오류를 발생시키거나 무한 루프에 들어갈 때와 같이 값이 절대 반환되지 않을 때 지정하는 타입이다.

```ts
// never 예시
const throwErr = (): never => {
    throw new Error("에러 발생")
}
```

위와 같이 에러의 경우 never로 타입을 지정할 수 있다.

### void 와 never의 차이점

둘다 함수에서 반환 값이 없을 때 사용하는 데이터 타입이지만 void는 정상적으로 함수가 마무리되서 나오는 undefined에 대한 리턴 값이고, never은 error같이 정상적으로 마무리 되지않거나 무한루프의 데이터 타입으로 사용할 수 있다.
즉, void는 값이 없음, never은 반환되지 않음을 뜻한다.

## unknown type, any type

```ts
const a: any = 10
const b: unknown = 10
```

unknown과 any 타입은 모든 타입을 할당할 수 있다는 공통점이 있다.
하지만 큰 차이점은 unknown의 경우 타입의 안전성이 보장되지만 any의 경우 타입의 안전성이 떨어지기 때문에 잘못된 타입의 값을 사용하여 발생하는 오류를 잡아낼 수 없다.

그래서 any의 경우에는 데이터 타입에 대한 자동완성을 할 수 없지만, unknown의 경우에는 추론하여 사용할 수 있게 된다.

unknown 타입을 이용하여, getValue의 매개변수로 어떤 데이터 타입이든 string으로 반환하는 함수를 작성할 수도 있다.

```ts
const getValue = (value: unknown): string => {
    if (typeof value === "string") return value
    return ""
}
const fn = getValue(1)
```

## object type

참조 타입은 object, array, function에 데이터 타입으로 사용할 수 있다.

```ts
const obj: object = {}
const arr: object = []
const func: object = () => {}
```

참조 타입에 대하여 데이터 타입을 object로 적을 수 있고, 이렇게 작성한다고 했을 때도, 오류를 발생하지 않는다. 하지만 object에 대한 특정 정보를 유추할 수 없기 때문에 유지관리 및 에디터의 자동 완성 기능이 동작하지 않을 수 있기 때문에 object를 데이터 타입으로 작성하는 것은 좋지 않다.

### Object의 데이터 타입

Object의 데이터 타입을 지정하는 방법들 중 하나는 각각의 프로퍼티에 대해서 구체적으로 데이터 타입을 지정하는 방법이다.

```ts
const product: object = {
    name: "맥북",
    price: 1000,
}

// console.log(product.name) ... Error 발생
```

```ts
const product: { name: string; price: number } = {
    name: "맥북",
    price: 1000,
}
```

### Array의 데이터 타입

Array는 배열 안에 있는 요소에 따라 크게 4가지로 데이터 타입을 지정할 수 있다.

```ts
// 1. 배열 안에 숫자 : [1,2,3]
const numArr: number[] = [1, 2, 3]

// 2. 배열 안에 문자 : [1,2,3]
const strArr: string[] = ["1", "2", "3"]

// 3. 배열 안에 객체 : [1,2,3]
let objArray: { name: string; age: number }[] = [
    { name: "A", age: 25 },
    { name: "B", age: 30 },
    { name: "C", age: 35 },
]

// 4. 배열 안에 숫자,문자 : [1,2,3]
const tuple: [string, number] = ["hello", 123]
```

3번의 배열안에 객체 같은 경우는 예시처럼 쓰는 경우도 있지만, interface를 이용해서 아래와 같이 작성할 수 있다.

```ts
interface Person {
    name: string
    age: number
}

let objArray: Person[] = [
    { name: "A", age: 25 },
    { name: "B", age: 30 },
    { name: "C", age: 35 },
]
```

4번의 배열 안에 여러타입이 있는 경우는 duple 타입으로 작성할 수 있다. Duple type은 JS에서는 제공하지 않는 데이터 타입이지만 TS에서는 사용이 가능하다.
배열의 요소의 갯수와, 순서가 고정되어 있다는 특징을 가지고 있다.

.
.
.

# Interface

코드를 구현하기 위해서 필요한 것은 아니지만 객체의 모양이나 구조를 정의하는 방법
내 오타 같은 실수를 막을 수 있고, 다른 사람이 코드를 봤을 때 직관적으로 보고, 재사용할 수 있도록 도와준다.

동작을 하는 코드가 아니고 구현을 위한 코드가 아니기 때문에 추상적이라고 말할 수 있다.
그래서 JS로 변환하는 과정에서 'Interface'는 변환되지 않는다.

## 인터페이스 속성

필수속성, 선택적 속성, 읽기 전용 속성을 정의할 수 있다.

### 예시 코드

```ts
interface IBoard {
    id: number
    title: string
    content: string
    date: number
    hit: number
    like?: number
    readonly writer: string
}
const board: IBoard = {
    id: 0,
    title: "",
    content: "",
    writer: "",
    date: 0,
    hit: 0,
}
```

### 필수 속성

기본적으로 interface에 지정하는 속성이다.

위의 예시에서 id, title, content, date, hit가 필수 속성이다.

만약 객체를 생성할 때, 필수 속성으로 지정되어 있는 요소를 누락하게 되면 오류가 발생한다.

### 선택적 속성

인터페이스는 만들지만 있을수도 있고, 없을 수도 있는 프로퍼티에 대해서 '?' (물음표기호)를 이용하여 작성하면 누락된 속성에 대한 에러가 발생하지 않는다.

### 읽기 전용 속성

읽기만 가능하고 수정할 수 없는 인터페이스의 속성을 정의할 때 사용한다.
읽기 전용 속성을 가진 인터페이스를 구현하는 객체에서는 해당 속성을 가진 값을 다시 설정할 수 없다.

이 속성을 이용하면 중요한 데이터의 수정을 방지할 수 있다.

# 사진5 , 6,7

## 클래스로 데이터 타입 지정하기

인터페이스가 데이터 유형으로 사용될 수 있는 것처럼 TypeScript에서 클래스를 데이터 유형으로 사용할 수 있다.

```ts
class Product {
    name: string
    price: number
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}

const product3: Product = new Product("mac", 8000)
```

class와 interface는 런타임에서 실행되는 코드인지 아닌지에 따라서 분류할 수 있다.
class는 JS파일로 변환이 되어 실행이 되지만 interface는 그렇지 않다.

class와 interface 둘 다 타입을 지정하는 부분에 있어서는 비슷하지만 interface가 더 추상적인 개념을 가지고 있다.

그리고 interface 개체를 이용한 클래스를 만들기 위해서 implements를 이용하여 확장시킬 수 있다.

```ts
interface IProduct {
    name: string
    price: number
}
class Product implements IProduct {
    name: string
    price: number

    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}
```

# OOP (객체지향 프로그래밍)

유저 정보에 대한 인터페이스를 이용하여 객체지향적 프로그래밍을 할 때,
크게 2가지의 방법을 이용할 수 있다.

```ts
interface UserInfo {
    username: string
    userid: string
}
```

기본적으로 UserInfo에 대한 interface를 지정한다.

## 1. 인터페이스를 이용하는 방법

```ts
interface IUser {
    addUser(username:string, userid:string) : USerInfo{
        return {username, userid}
    }
}
```

## 2. 추상 클래스를 이용하는 방법

```ts
abstract class Person {
    abstract addUser(username: string, userid: string): UserInfo
}

class User extends Person {
    addUser(username: string, userid: string): UserInfo {
        throw { username, userid }
    }
}
```

좋은 클래스를 만들려면 추상적으로 기능만 구현해 놓은 클래스를 만들어야 한다.

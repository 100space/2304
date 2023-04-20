# Function

함수에 대한 데이터 타입을 지정한다면, 함수의 리턴값 뿐 아니라, 매개변수에도 데이터 타입이 지정되어 있어야 한다.

```ts
// 함수 선언식
function add(x: number, y: number): number {
    return x + y
}
//함수 표현식
const ad2 = function (x: number, y: number): number {
    return x + y
}
//화살표 함수
const add3 = (x: number, y: number): number => x + y
```

## 선택적 속성

한가지 매개변수에 대해서 매개변수가 있을 수 있고, 없을 수도 있는 상황이 있다. 이 때 매개변수를 |(or연산자)를 통해서 2가지 타입을 지정해줄 수 있다.

hello 함수를 호출 할 때, 매개변수가 있거나, 없을 수 있는 함수를 만든다면, 매개변수의 타입을 잘 지정해야 한다.

```ts
{
    //방법 1
    //매개변수를 name: string = '' 이렇게 적어도 된다.
    const hello = (name: string | null = null): void => {
        if (name) {
            console.log(name.length)
            console.log(`hello ${name}`)
        } else {
            console.log("hello ")
        }
    }
}

{
    //방법 2
    const hello = (name?: string): void => {
        if (name) {
            console.log(name.length)
            console.log(`hello ${name}`)
        } else {
            console.log("hello ")
        }
    }
}

hello()
hello("baekspace")
```

## 함수 오버로딩

```ts
// 123->321 or 'abc'->'cba' 로 만들고 싶다

const reverseVari = (vari: string | number): string | number => {
    if (typeof vari === "string") {
        console.log(vari.split("").reverse().join(""))
        return vari.split("").reverse().join("")
    } else {
        console.log(parseInt(vari.toString().split("").reverse().join("")))
        return parseInt(vari.toString().split("").reverse().join(""))
    }
}
reverseVari("abc")
reverseVari(123)
```

문제점 : 리턴값이 2가지 종류이기 때문에 원하는 대로 데이터 타입을 추론할 수 없다. 그래서 매개변수가 string이면 반환값이 string , number이면 반환값이 number로 정확하게 지정해야 한다.

이 때 해결할 수 있는 방법이 '함수 오버로딩' 이다.

```ts
//함수 선언식을 이용한 함수 오버로딩
function reverseVari(x: number): number
function reverseVari(x: string): string
function reverseVari(x: number | string): number | string {
    const res = x.toString().split("").reverse().join("")
    return typeof x === "number" ? parseInt(res) : res
}

const result = reverseVari("123")

// 화살표 함수을 이용한 함수 오버로딩
type ReverseFunction = {
    (x: number): number
    (x: string): string
}

const reverse = ((x: string | number) => {
    const res = x.toString().split("").reverse().join("")
    return typeof x === "number" ? parseInt(res) : res
}) as ReverseFunction

const result1 = reverse(123) // return 321 (number)
const result2 = reverse("hello")
```

# Generic

확장성이 좋은 코드를 작성하게 된다면 매개변수의 타입에 따라서 반환값의 타입도 똑같이 지정하고 싶은 경우가 있다.

ex)
매개변수 number -> return값 number,
매개변수 string -> return값 string,
매개변수 object -> return값 object,
매개변수 array -> return값 array,

이때 사용할 수 있는 방법이 Generic type이다.

```ts
//기본 문법
const echo = <T>(a: T): T => {
    console.log(a)
    return a
}

echo(1)
echo("a")
echo({ name: "abc" })
echo(["123"])
```

T는 타입만 받을 수 있는 매개변수이다. T로 고정된 것은 아니지만 T로 많이 쓰인다.

## 함수의 제네릭

interface와 제네릭을 같이 쓸 때
함수 실행을 하면서 interface로 지정한 타입을 타입의 매개변수로 같이 전달 할 수 있다.

```ts
interface Props {
    name: string
    id: string
}
const echo = <T>(a: T): T => {
    console.log(a)
    return a
}
const props: Props = {
    name: "baek",
    id: "baekspacee",
}

echo<Props>(props)
```

echo 함수를 호출할 때 "<Props>"에 의해서 타입의 매개변수 T가 Props 인터페이스로 지정되고, 반환 값의 데이터 타입도 Props 인터페이스로 지정되었다.

## 반환값이 배열인 함수의 제네릭

Array의 경우 매개변수의 타입뿐 아니라 매개변수 안에 있는 요소의 타입도 지정해주어야한다.
ex) "string[]" or "number[]"

이 때도 제네릭을 이용하면 쉽게 지정할 수 있다.

```ts
const push = <T>(a: T): T[] => {
    const result = [a]
    console.log(result)
    return result
}
push(1)
push("asdf")
```

## 데이터 타입에 따른 처리방식

TypeScript에서 제네릭을 사용할 때 데이터타입을 잃지 않도록 코드를 구현해야한다.
즉, 함수 내에서 코드를 작성할 때 매개변수의 데이터 타입이 어떤 유형이든 들어올 수 있고, 각 유형에 따라서 다르게 처리해야하는 로직이 있을 수 있다.

```ts
const push = <T>(a: T): T[] => {
    if (typeof a === "string") {
        // string type code..
    } else if (typeof a === "number") {
        // number type code..
    }
    return a
}
push(1)
push("asdf")
```

# 다양한 타입의 객체

```ts
interface A {
    name: string
}
interface B {
    age: number
}
interface C {
    weight: number
}

const a: A = { name: "baekspace" }
const b: B = { age: 30 }
const c: C = { weight: 75 }

const object = <T>(value: T): T => {
    return value
}

console.log(object<A>(a).name)
console.log(object<B>(b).age)
console.log(object<C>(c).weight)
```

object로 타입을 지정하게되면 object안에 배열,객체가 포함된 상위의 개념이기 때문에 데이터 타입을 제대로 추론하지 못하게 된다.하지만 제네릭을 이용해서 매개변수로 데이터타입을 지정하게 된다면 호출했을 때 데이터타입을 추론 할 수 있어서 해당 인터페이스에 정의된 프로퍼티에 접근이 가능하고 그 데이터 타입의 메서드를 사용할 수 있게 된다.

# Function overloading VS Generic

유사점 :

-   서로 다른 데이터 타입을 처리할 수 있는 코드를 작성할 수 있게 한다.
-   입력과 출력에 대한 타입이 지정되므로 타입을 추론할 수 있게 해준다.

차이점 :

-   오버로딩은 이름이 같은 함수의 매개변수의 타입과 반환 값의 데이터 타입을 여러개 지정할 때 사용할 수 있지만 제네릭은 단일 함수,데이터를 다양한 타입의 데이터로 조작할 때 사용할 수 코드를 만들 수 있다.

.
.
.
.
.
.
.

# OOP

blockchain을 타입스크립트 OOP로 작성하기 위해서 배우고 있었다.

OOP를 안쓴다고 못하는건 아니지만
할 줄 알고 코드를 구현할 때 고려한다면 코드가 깔끔해진다.

OOP는 유지보수의 포커스가 맞춰져있다.
개발방법'론'이다. 필수는 아니다.

OOP를 하면서 점점 원칙이 생겼다. 그것이 SOLID

S: SRP : 하나의 클래스 또는 하나의 메서드는 하나의 책임만 가지도록 한다.

O: OCP : 기능이 추가되더라도 기존의 코드를 수정하지 않고 추가해서 사용한다.(같은 클래스 내부에서)

L: LSP: 상속의 개념이 약간 있다.
상위 클래스를 이용하여 하위클래스로 바꿀 수 있다. (18일 7번 -discount 예제)

I: ISP: 기능에 대한 인터페이스를 잘게 쪼개서 사용하자. (너무 쪼개는것도 문제...)

D: DIP: `의존`

# 데이터 은닉화 : private를 이용하여 객체를 생성한 후에 접근이 불가능하게 할 수 있다.

인스턴스를 생성했을 때 접근 할 수 있냐, 없냐에 따라서 private , public 으로 나눈다.

클래스 내부에서는 사용할 수 있다.

매개변수도 provate를 이용해서 작성할 수 있따.

```ts
class Auth {
    private email: string
    private password: string

    constructor(private readonly email: string, password: string) {
        this.email = email
        this.password = password
    }
    public login(): void {}
}

const auth = new Auth("baekspace@a.com", "123123")

console.log(auth.email) //  error TS2341: Property 'email' is private and only accessible within class 'Auth'.
```

보통 ~~ 는 private이고 메서드는 public 이다.

# SRP

단일 책임 원칙
어떤 코드의 기능이 클래스에서 단일 기능을 할 수 있도록 분리해서 작업을 한다.
이렇게 함으로써 유지관리가 용이하고, 오류가 발생했을 때 파악하기 쉬워진다.

인증을 위한 passport 라는 라이브러리는

-   oop 디자인 패턴 중 ->전략 패턴을 이용해서 사용하고 있다!

다중 if 문은 객체로 관리하면 편하다.
성능적으로도 객체가 좋다. 조건이 많을수록 하나씩 걸러야하지만 객체는 해당부분만 실행하면 되기 때문에

```js
const ab = {
    1: "hello1",
    2: "hello2",
}
```

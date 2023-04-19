// ORM model을 이용해서 어떤 식으로 데이터를 담을지 정의를 한 후에 작성을 했었다.

// 동작을 위한 코드는 아니고, 구현하지 않기 때문에 추상적인 내용이다.
// 그래서 JS로 변환할 때 변환되지 않는다.
// interface 는 객체의 구조를 정의하는 `타입`
// interface는 객체가 아니다. {} 는 코드블럭을 나타내는 {} 일 뿐이다.
interface Iproduct {
    name: string
    price: number
}

{
    const product: object = {
        name: "맥북",
        price: 1000,
    }
    // console.log(product.name) // 타입을 object로 지정하는 경우 object가 상위에 있는 개념이기 때문에 하위에 있는 데이터는 나오지 않는다.
}

const product: Iproduct = { name: "맥북", price: 1000 }
const product2: Iproduct = { name: "아수스", price: 700 }

//board

interface IBoard {
    id: number
    title: string
    content: string
    readonly writer: string
    date: number
    hit: number
    like?: number
}
const board: IBoard = {
    id: 0,
    title: "",
    content: "",
    writer: "",
    date: 0,
    hit: 0,
}
console.log(board)

board.id = 10
board.title = "hello"
console.log(board)

//class 에서 사용하기

class Products {
    name: string
    price: number
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}

const product3: Products = new Products("mac", 8000)

//런타임 실행시켰을 때 실행이 되는 코드냐 아니냐로 분류를 하고
// 실행이 된다. Class
// 실행이 안된다. interface 로 구분할 수 있다.
// class와 interface의 역할은 비슷하나 interface가 좀더 추상적인 개념이다.

//추상적으로 만들때, interface를 만들고 class를 만들어야한다.
//Iproduct 구조를 가진 Product2를 만든다면 implements를 이용하여 확장시킨다.
class Product2 implements Iproduct {
    name: string
    price: number
    //생성을 했을 때 나오는 프로퍼티를 지정해준다.
    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }
}

const product4 = new Product2("맥북프로", 1000)
const product5 = new Product2("맥북에어", 800)

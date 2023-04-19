class Productz {
    private name: string
    private price: number

    constructor(name: string, price: number) {
        this.name = name
        this.price = price
    }

    getName(): string {
        return this.name
    }
    getPrice(): number {
        return this.price
    }
}

//할인 기능을 만들기
interface Discount {
    getDisCountPrice(price: number): number
}

//그냥 깎는 클래스
class FlatDiscount implements Discount {
    private amount: number // 깎아줄 금액

    constructor(amount: number) {
        this.amount = amount
    }
    getDisCountPrice(price: number): number {
        return price - this.amount
    }
}

// 퍼센트로 깎는 클래스
class PercentDiscount implements Discount {
    private amount: number

    constructor(amount: number) {
        this.amount = amount
    }
    getDisCountPrice(price: number): number {
        return price * (1 - this.amount / 100)
    }
}

class FlatPercentDiscount implements Discount {
    private flatAmount: number
    private percent: number

    constructor(flatAmount: number, percent: number) {
        this.flatAmount = flatAmount
        this.percent = percent
    }

    getDisCountPrice(price: number): number {
        const flatDisCountAmount = price - this.flatAmount
        return flatDisCountAmount * (1 - this.percent / 100)
    }
}

// 상속을 이용해서 클래스를 만들 수 있는데, 상속을 하지 않은 이유는 확장성이 떨어지기 때문에 의존성 주입을 하였다.
// 그렇기 때문에 상속은 특별한 경우를 제외하고 잘 안쓴다.
class ProductDiscount {
    private product: Productz
    private discount: Discount

    constructor(product: Productz, discount: Discount) {
        this.product = product
        this.discount = discount
    }

    getPrice(): void {
        console.log(this.discount.getDisCountPrice(this.product.getPrice()))
    }
}

const prod = new Productz("맥북", 10000) //{name, price}
const prod2 = new Productz("아수스", 7000)

const prodWithPercentDiscount = new PercentDiscount(10)
const prodWithFlatDiscount = new FlatDiscount(3000)
const prodWithFlatPercentDiscount = new FlatPercentDiscount(3000, 10)

const productWithDiscount = new ProductDiscount(prod, prodWithPercentDiscount) //{name, price, discount}
productWithDiscount.getPrice() // 7000

const product2WithDiscount = new ProductDiscount(prod2, prodWithFlatDiscount)
product2WithDiscount.getPrice()

const product3WithDiscount = new ProductDiscount(prod, prodWithFlatPercentDiscount)
product3WithDiscount.getPrice()

// const product2Discount = new ProductDiscount(prod2, 10)
// productDiscount.getPrice() // 6300

//내용을 추가하면서 추가기능을 넣는 것이 좋다. 확장을 하면서 기존에 기본 틀을 건드리지 말자
//할인을 위해서 할인이 들어가 있는 새로운 클래스를 만들어서 할인에 대한 메서드를 만든다.

// Discount : instanceof 에 대한 내용을 알아보자

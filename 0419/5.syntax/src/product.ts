//단순히 할인된 가격을 구하는 인터페이스
interface Discount {
    getDiscountPrice(price: number): number
}

//가격을 이용한 할인된 가격을 구하는 클래스
class FlatDiscount implements Discount {
    //할인하는 금액
    private amount: number

    constructor(amount: number) {
        this.amount = amount
    }

    //할인된 가격을 구하기
    getDiscountPrice(price: number): number {
        return price - this.amount
    }
}

// 퍼센트를 이용한 할인된 가격을 구하는 클래스
class PercentDiscount implements Discount {
    private amount: number
    constructor(amount: number) {
        this.amount = amount
    }

    //할인된 가격을 구하기
    getDiscountPrice(price: number): number {
        return price * (1 - this.amount / 100)
    }
}

//물건 이름과 값을 구하는 클래스를 만든다.
class Product {
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

//최종 할인된 물건의 가격을 판단하는 클래스
//물건과 할인방식, 할인액(퍼센트)를 전달해주면 된다.
class ProductDiscount {
    private product: Product
    private discount: Discount

    constructor(product: Product, discount: Discount) {
        this.product = product
        this.discount = discount
    }

    getPrice(): void {
        console.log(this.discount.getDiscountPrice(this.product.getPrice()))
    }
}

// 현재 상품 구하기
const item = new Product("macbook", 10000)
const item2 = new Product("iphone", 8000)

// 10퍼센트 할인된 가격을 계산하는 함수
const percentDiscountFn = new PercentDiscount(10)
// 3000원 할인된 가격을 계산하는 함수
const flatDiscountFn = new FlatDiscount(3000)

//macbook 10% 할인된 가격 구하기
const macbookDiscount = new ProductDiscount(item, percentDiscountFn)
macbookDiscount.getPrice() //9000원
// iphone 3000원 할인된 가격  구하기
const iphoneDiscount = new ProductDiscount(item2, flatDiscountFn)
iphoneDiscount.getPrice() //5000원

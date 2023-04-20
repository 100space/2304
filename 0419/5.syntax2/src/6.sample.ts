interface IProduct {
    name: string
    price: number
}

class ProductEx {
    private name: string
    private price: number
    private discountAmount: number

    constructor(name: string, price: number) {
        this.name = name
        this.price = price
        this.discountAmount = 0
    }

    getProduce() {
        return { name: this.name, price: this.getPrice() }
    }
    getName(): string {
        return this.name
    }
    getPrice(): number {
        return this.price - this.discountAmount
    }
    setDisCountAmount(amount: number): void {
        this.discountAmount = amount
    }
}
const productEX = new ProductEx("상품", 1000)
// console.log(productEX.getPrice())

// productEX.setDisCountAmount(200)
// console.log(productEX.getPrice())

// console.log(productEX.getProduce())

// 클래스의 유지보수를 위해서 많이 사용했다.
//  현재 이코드는 절대 유지보수가 좋지 안다.
//  할인도 종류별로 필요하고, 비율별로 필요하고, 1+1도 있어야 하고 전체적인 정보가 없다는것

// 이름을 가져오기
productEX.getName()

// 할인 적용하기 -가격을 직접적으로 할인하기
productEX.setDisCountAmount(300)
console.log(productEX.getPrice())

// 할인 적용하기 - 가격의 퍼센테이지로 할인하기

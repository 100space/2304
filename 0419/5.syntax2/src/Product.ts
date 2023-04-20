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

const item = new Product("macbook", 10000)
const item2 = new Product("iphone", 8000)

// 원시타입
// Number type
{
    const num: number = 10
    const float: number = 3.14
    const nan: number = NaN
    const infinity: number = Infinity
}

//String type
{
    const str: string = "Hello"
}

// Boolean type
{
    const boll: boolean = true
}

// Null, Undefined type
{
    let nullValue: null = null
    let undefinedValue: undefined = undefined
}

// Void type
{
    const print = (): void => {
        console.log("hello")
    }
    function print2(): void {
        console.log("heeeelllo")
    }

    // 매개변수
    const print3 = (str: string): void => {
        console.log(str)
    }
    // print3(3) //매개변수의 데이터 타입이 달라서 오류발생
    // const result = print("3") // void 이기 때문에 변수에 담을 수 없다.
    print3("3")

    const sum = (a: number, b: number): number => a + b

    // sum("a", "b") // 오류 발생
    const result: number = sum(1, 2) // 함수의 리턴값의 데이터 타입이 명시 되었기 때문에 result의 데이터 타입을 추론할 수 있다.
}

{
    //never : return 이 없는것.
    const throwErr = (): never => {
        throw new Error("에러 발생")
    }

    // 예시
    const repository = (): number => {
        throwErr()
        return 10
    }
    const service = (): string => {
        repository()
        return "hello" + num
    }
    const controller = (): void => {
        try {
            const result = service()
        } catch (e) {
            console.log(e)
        }
    }
    controller()
}

// 10시 수업보자!!!!!!!!!!!!!!!

//참조타입
//object
{
    const obj: object = {}
    const arr: object = []
    const func: object = () => {}
}

{
    //any : 어떤 타입이든 할당할 수 있다. 타입 안정성이 보장되지 않는다.
    const a: any = 10
    const b: number = 10
}
{
    //unknown : 어떤 타입이든 할당할 수 있다. 타입 안성성이 보장된다.
    const a: unknown = 10

    //getValue의 값이 어떤 것이 들어오더라도 string으로 반환하기 위해서 아래와 같은 코드로 데이터 타입을 조작할 수 있다.
    const getValue = (value: unknown): string => {
        if (typeof value === "string") return value
        return ""
    }
    const fn = getValue(1)
}

/*
never : 무한 루프를 돌거나 반환할 수 없는 타입을 지정할 때
void : 반환 값이 없는 (undefiend)
undefiend : 값이 할당되지 않은 것
null : 값이 없을 때
unknown : any와 비슷하지만 타입의 안정성이 보장된다. 다른 사람이 만든 외부 라이브러리에 대해서 가~끔 사용하지만 내가 만든 코드에 대해서는 쓸 일이 없다.

 */

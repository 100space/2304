// 1 -> 1
// "adsf" -> "adsf"
// {} -> {}
// [] -> []

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

const push = <T>(a: T): T[] => {
    const result = [a]
    console.log(result)
    return result
}
push(1)
push("asdf")

// 제네릭을 이용해서 앞의 revers문제를 해결할 수 있다.
const reverse = <T>(x: T): T => {
    const params = typeof x === "number" ? x.toString() : x
    const result = typeof params === "string" ? params.split("").reverse().join("") : params
    return result as T
}
console.log(reverse("abc"), reverse(123), reverse({ name: "!23" }))

const reverse2 = <T>(x: T): T => {
    // 3차 : 리팩토링
    if (typeof x === "string" || typeof x === "number") {
        return x.toString().split("").reverse().join("") as T
    }
    if (x instanceof Array) {
        return x.reverse() as T
    }
    if (typeof x === "object" && x !== null) {
        return Object.fromEntries(Object.entries(x).reverse()) as T
    }
    return null as T

    // 2차 :array도 판단해서 reverse
    // if (typeof x === "string") {
    //     result = x.split("").reverse().join("")
    // } else if (typeof x === "number") {
    //     result = parseInt(x.toString().split("").reverse().join(""))
    // }
    // // object가 상위 개념이기 때문에 object를 판단하기 전에 걸러주면 좋다.
    // else if (x instanceof Array) {
    //     result = x.reverse()
    // } else if (typeof x === "object" && x !== null) {
    //     result = Object.fromEntries(Object.entries(x).reverse())
    // }
    // return result as T

    // 1차
    // if (typeof x === "string") {
    //     result = x.split("").reverse().join("")
    // } else if (typeof x === "number") {
    //     result = parseInt(x.toString().split("").reverse().join(""))
    // } else if (typeof x === "object") {
    //     const parmas = x as object
    //     if (parmas instanceof Array) {
    //         result = parmas.reverse()
    //     } else {
    //         result = Object.fromEntries(Object.entries(parmas).reverse())
    //     }
    // }
    // return result as T
}

console.log(reverse2(123), reverse2("asdfb"), reverse2({ asdf: "asdf", aa: "asdf" }), reverse2([1, 2, 3]))

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

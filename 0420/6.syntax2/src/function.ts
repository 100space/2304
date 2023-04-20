{
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
}

const hello = (name: string | null = null): void => {
    if (name) {
        console.log(name.length)
        console.log(`hello ${name}`)
    } else {
        console.log("hello ")
    }
}

hello()
hello("web7722")

// 123->321 or 'abc'->'cba' 로 만들고 싶다

{
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
}
//숫자든 문자든 toString()을 할 경우에는 string이 된다

//문제점 : 리턴값이 2가지 종류이기 때문에 추론할 수 없다.
//그래서 매개변수가 string이면 return도 string , number 면 number로 정확하게 지정되야 한다.
// 이 때 사용하는 방법이 '함수 오버로드' 이다.

function reverseVari(x: number): number
function reverseVari(x: string): string
function reverseVari(x: number | string): number | string {
    const res = x.toString().split("").reverse().join("")
    return typeof x === "number" ? parseInt(res) : res
}

const result = reverseVari("123")

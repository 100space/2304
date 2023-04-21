# 브라우저 환경에서의 TS

기존에 구현했었던 화면을 그려주는 JS파일을 이용하여 TS로 변환하는 과정을 했다.

추상 클래스를 이용하는 방법이였다. 추상 클래스를 만든 후 추상 클래스를 확장시켜 구체화를 하였고,
Component 클래스는 다른 컴포넌트를 만들 때에도 부모 클래스로써 역할을 하기를 원했기 때문에,

추상 클래스를 제네릭 타입으로 지정하여 구체화한 클래스의 데이터 타입에 따라서 화면을 다르게 렌더할 수 있도록 확장성을 키웠다.

```ts
interface IComments {
    user: IUser
    list: IComment[]
}
interface IBoards {
    user: IUser
    list: IBoard[]
}

// 부모 클래스
abstract class Component<T> {
    target: HTMLElement // 앞으로 넣을 Element
    state!: T // 데이터들

    constructor(_target: HTMLElement) {
        this.target = _target
        this.setup()
        this.render()
    }

    abstract setup(): void // 자식클래스에서 구현
    abstract template(): string // 자식클래스에서 구현
    render(): void {
        this.target.innerHTML = this.template()
    }
    setState(newState: T): void {
        if (this.state === newState) return
        this.state = { ...this.state, ...newState }
        this.render()
    }
}

// 자식 클래스 1
class Comments extends Component<IComments> {
    setup() {
        this.state = {
            list:, //[{},{},{}]
            user: //userInfo 객체
        }
    }
    // 구체화를 위한 code..
    template(): string {
        const { list } = this.state

        return `
                    <div id='comment-list'>

                ${list
                    .map((comment: IComment): string => {
                        return `<ul class="comment-row" data-index="${comment.id}">
                                <li class="comment-id">${comment.userid}</li>
                                <li class="comment-content">${comment.content}</li>
                                <li class="comment-date">${comment.register}</li>
                            </ul>`
                    })
                    .join("")}
            </div>
        `
    }
}

//자식 클래스 2
class Board extends Component<IBoards> {
    setup() {
        this.state = {
            list:, //[{},{},{}]
            user: //userInfo 객체
        }
    }
    // 구체화를 위한 code..
    template(): string {
        const { list } = this.state

        return `
            <div id='comment-list'>
                ${list
                    .map((comment: IBoard): string => {
                        return `<ul class="comment-row" data-index="${comment.id}">
                                <li class="comment-id">${comment.userid}</li>
                                <li class="comment-content">${comment.subject.toString()}</li>
                                <li class="comment-date">${comment.register}</li>
                            </ul>`
                    })
                    .join("")}
            </div>
        `
    }
}
```

작성한 코드가 자세히 적은 것은 아니지만 부모 클래스는 추상화 클래스로 구체화를 하는 코드는 자식 클래스에서 발생하며,
2가지의 자식 클래스는 1가지 부모클래스를 확장하여 만든 클래스이고, 자식 클래스의 타입을 이용한 가변적인 화면 렌더를 위해 부모 클래스를 제네릭 타입으로 지정하였고, 이를 통해 확장성을 키웠다.

## Node환경과 브라우저 환경

JS는 런타임이 2가지이다. Node.js에서의 환경과 브라우저에서의 환경 두 가지가 있는데,
브라우저 환경의 TS를 작성하게 된다면, 컴파일할 때, 브라우저 환경에서 파일이 작동할 수 있도록 설정해주는 작업이 필요하다.

지금까지 Node.js환경에서의 코드를 구현했기 때문에 이전글까지 아래와 같은 tsconfig.json 설정을 하였다.

### 1. Node.js 환경을 위한 tsconfig.json

```json
{
    "compilerOptions": {
        "module": "CommonJS",
        "outDir": "./dist",
        "esModuleInterop": true,
        "target": "ES6",
        "strict": true,
        "baseUrl": "./",
        "paths": {}
    },
    "include": ["src/**/*"],
    "exclude": ["**/*.test.ts"]
}
```

하지만 오늘의 작업은 DOM객체를 활용하여 브라우저에서 렌더되기를 원하기 때문에
브라우저 환경에서 작동할 수 있는 JS파일로 컴파일하기 위한 설정이 필요하다.

### 2. 브라우저 환경을 위한 tsconfig.json

```json
{
    "compilerOptions": {
        "module": "ES6",
        "outDir": "./dist",
        "esModuleInterop": true,
        "target": "ES6",
        "strict": true,
        "lib": ["DOM", "es6"],
        "baseUrl": "./",
        "paths": {}
    },
    "include": ["src/**/*"],
    "exclude": ["**/*.test.ts"]
}
```

1번과 2번의 차이점은 module과, lib이다.

추후에 리액트에서 모듈을 가져오기를 할 때 import문을 쓰는 환경을 만들기 위해서 module은 es6로 지정했다.
'lib' 속성을 사용하면 컴파일러가 자동으로 포함시켜야 하는 특정 라이브러리를 지정할 수 있다.

## 오류1

> error TS2345: Argument of type 'Element | null' is not assignable to parameter of type 'HTMLElement'.<br>
> Type 'null' is not assignable to type 'HTMLElement'.<br>

TS파일에서 document.querySelector()을 사용한 부분에 에러가 발생한 것을 확인해보면

> 'Element | null' 형식의 인수는 'HTMLElement' 형식의 매개 변수에 할당될 수 없습니다.<br>
> 'null' 형식은 'HTMLElement' 형식에 할당할 수 없습니다.<br>

라는 것을 확인할 수 있다. querySelector()가 HTMLElement | null 형식을 반환하기 때문인데,
해결하는 방법은 반환 값의 데이터 타입을 HTMLElement 타입으로 강제로 변환시키는 방법이다.

### **document.querySelector(~~) as HTMLElement** 로 작성하여서 해결 할 수 있다.

```ts
const element = document.querySelector("#app") as HTMLElement
const element2 = document.querySelector("#app2") as HTMLElement
const app = new App(element)
const app2 = new App2(element2)
```

## 오류2

> const element = document.querySelector("#app") as HTMLElement<br>
> ReferenceError: document is not defined<br>

사진과 같은 환경으로 작업을 진행을 하고 있었다. Node환경을 볼 일이 있어서 지정해두고, 작업을 진행하고 마지막에

```ts
const element = document.querySelector("#app")
```

이 코드를 작성하고 저장을 하는 순간 오류가 발생했다. Nodemon이라는 것을 생각하면 간단한 문제였는데, (잠깐..아주 잠깐 고민했었다.. 왜 오류가 생겼는지..)
Nodemon은 Node.js환경에서 코드가 변경시에 자동으로 재시작해주는 라이브러리이다.

Node.js 환경이다... 지금 내가 작성한 코드는 브라우저에 보이기 위한 코드였다. Node 환경에 document가 없는게 당연한건데 아주 잠깐 착각을 했다..!

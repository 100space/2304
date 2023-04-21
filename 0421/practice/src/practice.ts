interface IComment {
    id: number
    userid: string
    content: string
    register: string
}
interface IBoard {
    id: number
    userid: string
    subject: number
    register: string
}
interface IUser {
    userid: string
    username: string
}
interface IComments {
    user: IUser
    list: IComment[]
}
interface IBoards {
    user: IUser
    list: IBoard[]
}

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

class App extends Component<IComments> {
    setup() {
        this.state = {
            list: [
                { id: 1, userid: "web7722", content: "hello1", register: "2023-01-09" },
                { id: 2, userid: "web7722", content: "hello2", register: "2023-01-09" },
                { id: 3, userid: "web7722", content: "hello3", register: "2023-01-09" },
            ],
            user: {
                userid: "web7722",
                username: "ingoo",
            },
        }
    }

    template(): string {
        const { list } = this.state

        return `
            <form>input</form>
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
            <button id='btn'>버튼!</button>
        `
    }
}

class App2 extends Component<IBoards> {
    setup() {
        this.state = {
            list: [
                { id: 1, userid: "web7722", subject: 1, register: "2023-01-09" },
                { id: 2, userid: "web7722", subject: 2, register: "2023-01-09" },
                { id: 3, userid: "web7722", subject: 3, register: "2023-01-09" },
            ],
            user: {
                userid: "baekspace",
                username: "ingoo",
            },
        }
    }

    template(): string {
        const { list } = this.state

        return `
            <form>input</form>
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
            <button id='btn'>버튼!</button>
        `
    }
}
const element = document.querySelector("#app") as HTMLElement
const element2 = document.querySelector("#app2") as HTMLElement
const app = new App(element)
const app2 = new App2(element2)

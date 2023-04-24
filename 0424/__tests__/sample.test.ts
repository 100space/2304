//user.controller
describe("user controller 검증", () => {
    console.log("hello")
    it("create()함수 잘 실행되는가?", () => {
        //req.body
        //service 메서드 잘 작동하는지
        //res.send res.json 내가 원한느 객체가 잘 들어가는지?
        //expect, matcher
        expect(1).toEqual(1)
    })
    test("create() 메서드 예외 처리가 잘되는가", () => {
        //req.body 강제로 다른값을 만들어서
        // service 메서드 호출을 강제로 에러 터트림
        // catch 문으로 잘 빠지는
        // next 함수가 잘 작동하는지
        expect(1).toEqual(2)
    })
})

class UserController {
    public num: number = 0
    constructor() {}
    create() {}
}

interface BoardRepository {
    getUserById: () => void
}

interface boardWriteDTO {
    email: string
    subject: string
    content: string
    hashtag: string
    category: string
    images: string
    thumbnail: string
}
class BoardService {
    constructor(private readonly boardRepository: BoardRepository) {}
    public postWrite(data: boardWriteDTO) {}
}
class boardController {
    constructor(private readonly boardService: BoardService) {}
    public write(req, res, next) {
        const data: boardWriteDTO = {
            email: "",
            subject: "",
            content: "",
            hashtag: "",
            category: "",
            images: "",
            thumbnail: "",
        }
        this.boardService.postWrite(data)
    }
}
describe("Test 1", () => {
    let result: { name: string } = { name: "" }
    let user: UserController

    afterAll(() => {})
    afterEach(() => {})
    beforeAll(() => {
        result = { name: "hello world" }
    })
    beforeEach(() => {
        user = new UserController()
    })

    it("Test 1-1", () => {
        user.num = 10
        expect(1).toEqual(user)
    })
    test("Test 1-2", () => {
        const a = 1 + 1
        expect(1).toEqual(user)
    })
})

import { BoardRepository, BoardWriteDTO } from "@board/board.interfaces"
import BoardService from "@board/board.service"

describe("Board.service", () => {
    let boardService: BoardService
    let boardRepository: BoardRepository
    beforeEach(() => {
        // const boardRepository: BoardRepository = {
        //     getUserById: (email: string) => {
        //         return {} as BoardModel
        //     }, // 1. 인자값, 2. 리턴, 3.에러 발생시
        // }
        boardRepository = {
            getUserById: jest.fn().mockResolvedValue("web7722"),
        }
        boardService = new BoardService(boardRepository)
    })
    it("postWrite", async () => {
        const dto: BoardWriteDTO = {
            email: "asd",
            subject: "asd",
            content: "asd",
            hashtag: "asd",
            category: "asd",
            images: "asd",
            thumbnail: "asd",
            tel1: "010",
            tel2: "1234",
            tel3: "5678",
        }
        const { username } = await boardService.postWrite(dto)
        //boardRepository의 내용이 없기 때문에 아무 기능을 하지 못한다.
        //코드는 작동이 되지만, 값이 나올 수 없음.
        // expect("web7722").toBe(username)

        //getUserById가 호출이 되었는지 궁금하다.
        expect(boardRepository.getUserById).toBeCalled()

        // 어떤 인자값을 가지고 호출을 하는지
        expect(boardRepository.getUserById).toBeCalledWith(`${dto.tel1}-${dto.tel2}-${dto.tel3}`)
    })
})

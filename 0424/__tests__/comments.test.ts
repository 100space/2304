import { CommentWriteDTO } from "@comment/comment.interfaces"
import CommentRepository from "@comment/comment.repository"
import CommentService from "@comment/comment.service"
describe("Comment Service", () => {
    let commentService: CommentService
    let commentRepository: CommentRepository
    beforeEach(() => {
        commentRepository = {
            // create: () => {},
            create: jest.fn().mockResolvedValue({ id: 0, write: "백스", commment: "안녕하세요", boardid: 0 }),
        }
        commentService = new CommentService(commentRepository)
    })
    it("commentService 인스턴스 확인하기", () => {
        expect(commentService instanceof CommentService).toBe(true)
    })
    describe("commnet 글쓰기 ", () => {
        it("wirte메서드가 존재하는 지 확인", () => {
            expect(typeof commentService.write).toBe("function")
        })
        it("write 매개변수가 잘 작성되어있는가?", async () => {
            //writer, comment, id
            const data: CommentWriteDTO = {
                writer: "web7722",
                boardid: 0,
                comment: "안녕하세요",
            }
            const result = await commentService.write(data)
            expect(commentRepository.create).toBeCalledWith(data)
            expect(result).toEqual({ id: 0, write: "백스", commment: "안녕하세요", boardid: 0 })
        })
        it("commentService 인스턴스 확인하기 ", () => {
            commentRepository.create = jest.fn().mockRejectedValue(new Error("TEST error 던짐"))
            const data: CommentWriteDTO = {
                writer: "web7722",
                boardid: 0,
                comment: "안녕하세요",
            }
            expect(async () => {
                await commentService.write(data)
            }).toThrowError()
        })
    })
})

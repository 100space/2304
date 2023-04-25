import { CommentModel, CommentWriteDTO } from "./comment.interfaces"
import CommentRepository from "./comment.repository"

class CommentService {
    constructor(private readonly commentRepository: CommentRepository) {}
    async write(data: CommentWriteDTO) {
        //data
        //repository(data)
        //return repository(data)
        //repository가 필요함.
        const result = await this.commentRepository.create(data)
        const response: CommentModel = {
            id: result.id,
            writer: "userrepository에 의햇 바뀐값",
            comment: result.comment,
            boardid: 0,
        }
        // return result
        return {}
    }
}
export default CommentService

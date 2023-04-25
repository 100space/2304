import { CommentModel, CommentWriteDTO } from "./comment.interfaces"

class CommentRepository {
    async create(data: CommentWriteDTO): Promise<CommentModel> {
        return {} as CommentModel
    }
}
export default CommentRepository

import { BoardModel, BoardRepository, BoardWriteDTO } from "./board.interfaces"

class BoardService {
    constructor(private readonly boardRepository: BoardRepository) {}
    public async postWrite(data: BoardWriteDTO): Promise<BoardModel> {
        const { email, tel1, tel2, tel3 } = data //"asd"
        const tel = `${tel1}-${tel2}-${tel3}`
        const { username } = await this.boardRepository.getUserById(tel) //promise 객체로 web7722를 반환한다.
        return { username }
    }
}
export default BoardService

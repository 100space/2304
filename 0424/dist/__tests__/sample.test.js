"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_service_1 = __importDefault(require("@board/board.service"));
describe("Board.service", () => {
    let boardService;
    let boardRepository;
    beforeEach(() => {
        // const boardRepository: BoardRepository = {
        //     getUserById: (email: string) => {
        //         return {} as BoardModel
        //     }, // 1. 인자값, 2. 리턴, 3.에러 발생시
        // }
        boardRepository = {
            getUserById: jest.fn().mockResolvedValue("web7722"),
        };
        boardService = new board_service_1.default(boardRepository);
    });
    it("postWrite", () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = {
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
        };
        const { username } = yield boardService.postWrite(dto);
        //boardRepository의 내용이 없기 때문에 아무 기능을 하지 못한다.
        //코드는 작동이 되지만, 값이 나올 수 없음.
        // expect("web7722").toBe(username)
        //getUserById가 호출이 되었는지 궁금하다.
        expect(boardRepository.getUserById).toBeCalled();
        // 어떤 인자값을 가지고 호출을 하는지
        expect(boardRepository.getUserById).toBeCalledWith(`${dto.tel1}-${dto.tel2}-${dto.tel3}`);
    }));
});

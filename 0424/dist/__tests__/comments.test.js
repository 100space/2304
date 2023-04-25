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
const comment_service_1 = __importDefault(require("@comment/comment.service"));
describe("Comment Service", () => {
    let commentService;
    let commentRepository;
    beforeEach(() => {
        commentRepository = {
            // create: () => {},
            create: jest.fn().mockResolvedValue({ id: 0, write: "백스", commment: "안녕하세요", boardid: 0 }),
        };
        commentService = new comment_service_1.default(commentRepository);
    });
    it("commentService 인스턴스 확인하기", () => {
        expect(commentService instanceof comment_service_1.default).toBe(true);
    });
    describe("commnet 글쓰기 ", () => {
        it("wirte메서드가 존재하는 지 확인", () => {
            expect(typeof commentService.write).toBe("function");
        });
        it("write 매개변수가 잘 작성되어있는가?", () => __awaiter(void 0, void 0, void 0, function* () {
            //writer, comment, id
            const data = {
                writer: "web7722",
                boardid: 0,
                comment: "안녕하세요",
            };
            const result = yield commentService.write(data);
            expect(commentRepository.create).toBeCalledWith(data);
            expect(result).toEqual({ id: 0, write: "백스", commment: "안녕하세요", boardid: 0 });
        }));
        it("commentService 인스턴스 확인하기 ", () => {
            commentRepository.create = jest.fn().mockRejectedValue(new Error("TEST error 던짐"));
            const data = {
                writer: "web7722",
                boardid: 0,
                comment: "안녕하세요",
            };
            expect(() => __awaiter(void 0, void 0, void 0, function* () {
                yield commentService.write(data);
            })).toThrowError();
        });
    });
});

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
Object.defineProperty(exports, "__esModule", { value: true });
class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //data
            //repository(data)
            //return repository(data)
            //repository가 필요함.
            const result = yield this.commentRepository.create(data);
            const response = {
                id: result.id,
                writer: "userrepository에 의햇 바뀐값",
                comment: result.comment,
                boardid: 0,
            };
            // return result
            return {};
        });
    }
}
exports.default = CommentService;

"use strict"
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, "__esModule", { value: true })
const user_service_1 = __importDefault(require("./user/service/user.service"))
const message = "hello ts 3 dir"
console.log(message)
console.log(user_service_1.default)

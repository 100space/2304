// class EmailSender {
//     constructor() {}
//     public sendEmail(email: string): void {
//         //노드메일러를 이용한 메일 전송
//         console.log(email)
//     }
// }

import { EmailAuthenticator, KakaoAuthenticator, Login, LoginService } from "./Authentication"

interface IEmailSender {
    sendEmail(email: string): void
}
class EmailSender implements IEmailSender {
    sendEmail(email: string): void {}
}

// 데이터 은닉화 : private를 이용하여 객체를 생성한 후에 접근이 불가능하게 할 수 있다.
class Auth {
    constructor(
        private readonly authProps: AuthProps,
        private readonly emailSender: EmailSender,
        private readonly loginService: LoginService
    ) {
        // this.authProps = authProps // TS에서 readonly를 붙인 매개변수는 생성자 함수에서 할당을 생략할 수 있다.
    }
    public async login(): Promise<void> {
        // this.loginService.login
        // console.log(this.authProps)
        await this.loginService.login("kakao", authProps)
    }
    public register(): void {
        this.emailSender.sendEmail(this.authProps.email)
    }
}

interface AuthProps {
    email: string
    password: string
}

const authProps: AuthProps = { email: "baekspace@a.com", password: "123123" }
const emailSender = new EmailSender()

const local = new EmailAuthenticator()
const kakao = new KakaoAuthenticator()

export interface Strategy {
    local: EmailAuthenticator
    kakao: KakaoAuthenticator
}

const strategy: Strategy = {
    local,
    kakao,
}

const loginService = new Login(strategy)
const auth = new Auth(authProps, emailSender, loginService)
auth.login()

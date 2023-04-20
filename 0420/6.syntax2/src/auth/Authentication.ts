// 카카오, 이메일, 네이버, 구글 로그인을 위한 코드를 작성한다.
// interface

import { Strategy } from "./auth"

interface AuthProps {
    email: string
    password: string
}
interface AuthenticationResponse {
    success: boolean
    message?: string
}

interface Authenticater {
    authenticate(credential: AuthProps): Promise<AuthenticationResponse>
}

export class EmailAuthenticator implements Authenticater {
    async authenticate(credentials: AuthProps): Promise<AuthenticationResponse> {
        //요청, DB조회
        //id, pw 기반으로 요청을하고 결과를 받았을 때
        //로직부분
        console.log("local 로그인?")
        return { success: true }
    }
}

export class KakaoAuthenticator implements Authenticater {
    async authenticate(credential: AuthProps): Promise<AuthenticationResponse> {
        //Kakao 로그인을 위한 로직
        console.log("kakao 로그인?")
        return { success: true }
    }
}

//여러가지 로그인 방식을 묶어서 하나로 보내줄 수 있는 클래스를 만든다.
//원래는 interface를 위로 올리는 것이 좋다.
export interface LoginService {
    login(type: string, credentials: AuthProps): Promise<AuthenticationResponse>
}

export class Login implements LoginService {
    constructor(private readonly strategy: Strategy) {}
    async login(type: "local" | "kakao", credentials: AuthProps): Promise<AuthenticationResponse> {
        // this.strategy[type].authenticate(credentials)
        // const result = await aucthenticater.authenticate(credentials)
        return this.strategy[type].authenticate(credentials)
    }
}

// const loginservice = new Login()

// const userInfo: AuthProps = {
//     email: "baekspace@a.com",
//     password: "1234",
// }

// loginservice.login(kakao, userInfo)

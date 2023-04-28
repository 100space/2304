import { SignatureInput } from "elliptic"

export class Sender {
    publicKey?: string
    //공개키를 가지고 만든 계좌번호의 개념
    account!: string
}

export class Receipt {
    sender!: Sender
    received!: string
    amount!: string
    //서명도 여러가지 데이터 타입이 있지만 elliptic에서 제공하는 타입을 이용한다.
    signature?: SignatureInput
}
export class TransactionRow {
    hash?: string
}
export type TransactionData = string | TransactionRow[]

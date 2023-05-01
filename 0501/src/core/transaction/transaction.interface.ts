import { SignatureInput } from "elliptic"

export class Sender {
    publicKey?: string
    account!: string
}

/*
    sender : 백
    received : baekspace
    amount : 20
    signature : 0x....
*/

export class Receipt {
    sender!: Sender
    received!: string
    amount!: number
    signature?: SignatureInput
}
export class TxIn {
    txOutId?: string
    txOutIndex!: number
    signature?: SignatureInput
}

export class TxOut {
    account!: string
    amount!: number
}

export class TransactionRow {
    txIns!: TxIn[]
    txOuts!: TxOut[]
    hash?: string
}

export type TransactionData = string | TransactionRow[]

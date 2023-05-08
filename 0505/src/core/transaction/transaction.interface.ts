import { SignatureInput } from "elliptic"

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

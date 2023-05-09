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

export class UnspentTxOut {
    txOutId!: string
    txOutIndex!: number
    account!: string
    amount!: number
}

export type TransactionData = string | TransactionRow[]

export type UnspentTxOutPool = UnspentTxOut[]
export type TransactionPool = TransactionRow[]

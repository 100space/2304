import { IBlock } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"
import { SignatureInput } from "elliptic"
import { TransactionRow, TxIn, TxOut } from "./transaction.interface"

class Transaction {
    getUnspentTxPool(): any {
        throw new Error("Method not implemented.")
    }
    //마이닝을 하면 보상하는 (코인베이스)코드를 작성해야함
    private readonly REWARD = 50
    constructor(private readonly crypto: CryptoModule) {}
    createTxOut(account: string, amount: number) {
        if (account.length !== 40) throw new Error("Account 형식이 올바르지 않다.")
        const txout = new TxOut()
        txout.account = account
        txout.amount = amount
        return txout
    }

    serializeTxOut(txOut: TxOut): string {
        const { account, amount } = txOut
        const text = [account, amount].join("")
        return this.crypto.SHA256(text) // hash화
    }

    //코인베이스에서는 txOutIndex만 받지만
    //코인베이스가 아닐 때는 txOutIndex, txOutId, signature 세개가 들어와야한다.
    createTxIn(txOutIndex: number, txOutId?: string, signature?: SignatureInput) {
        const txIn = new TxIn()
        txIn.txOutIndex = txOutIndex
        txIn.txOutId = txOutId
        txIn.signature = signature
        return txIn
    }

    serializeTxIn(txIn: TxIn) {
        const { txOutIndex } = txIn
        const text = [txOutIndex].join("")
        console.log(text, 11111)
        return this.crypto.SHA256(text)
    }

    // TX객체를 만들기 위해서 사용
    createRow(txins: TxIn[], txOuts: TxOut[]) {
        const transactionRow = new TransactionRow()
        transactionRow.txIns = txins
        transactionRow.txOuts = txOuts
        transactionRow.hash = this.serializeRow(transactionRow)
        return transactionRow
    }

    serializeTx<T>(data: T[], callback: (item: T) => string) {
        return data.reduce((acc: string, item: T) => {
            return acc + callback(item)
        }, "")
    }
    //예외처리 및 테스트코드 연습해보기
    serializeRow(row: TransactionRow) {
        const { txIns, txOuts } = row

        //함수 자체를 전달하는 과정에서 serializeTxOut()의 this가 undefined가 되기 때문에 클로저를 사용한다.
        const text1 = this.serializeTx<TxOut>(txOuts, (item) => this.serializeTxOut(item))
        const text2 = this.serializeTx<TxIn>(txIns, (item) => this.serializeTxIn(item))

        const txoutText = txOuts.reduce((acc: string, v: TxOut) => {
            return acc + this.serializeTxOut(v)
        }, "")
        console.log(txoutText) // hash + hash

        const txinText = txIns?.reduce((acc: string, v: TxIn) => {
            return acc + this.serializeTxIn(v)
        }, "")

        console.log(txoutText, text1) // 같다.
        console.log(txinText, text2) // 같다.

        return this.crypto.SHA256(text1 + text2)
    }

    // 앞으로 생성되는 블록 전에 실행될 메서드이다.
    createCoinbase(account: string, lastestBlockHeight: number) {
        const txin = this.createTxIn(lastestBlockHeight + 1)
        const txout = this.createTxOut(account, this.REWARD)
        return this.createRow([txin], [txout])
        //
    }
}

export default Transaction

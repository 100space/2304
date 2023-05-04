import { IBlock } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"
import { Receipt } from "@core/wallet/wallet.interface"
import { SignatureInput } from "elliptic"
import { TransactionPool, TransactionRow, TxIn, TxOut, UnspentTxOut } from "./transaction.interface"

class Transaction {
    //마이닝을 하면 보상하는 (코인베이스)코드를 작성해야함
    private readonly REWARD = 50
    private readonly transactionPool: TransactionPool = []
    constructor(private readonly crypto: CryptoModule) {}

    create(receipt: Receipt, myUnspentTxOuts: UnspentTxOut[]) {
        // 1. txins : 사용할 UTXO
        if (!receipt.signature) throw new Error("서명이 존재하지 않습니다.")
        const [txIns, balance] = this.createInput(myUnspentTxOuts, receipt.amount, receipt.signature)
        // 2. txouts
        const txOuts = this.createOutput(receipt.received, receipt.amount, receipt.sender.account, balance)
        // 3. transaction 객체 생성
        const transaction: TransactionRow = {
            txIns,
            txOuts,
        }
        transaction.hash = this.serializeRow(transaction)

        // 4.트랜잭션 풀에 담기
        this.transactionPool.push(transaction)
        return transaction
    }

    createTxOut(account: string, amount: number) {
        if (account.length !== 40) throw new Error("Account 형식이 올바르지 않다.")
        const txout = new TxOut()
        txout.account = account
        txout.amount = amount
        return txout
    }

    createInput(myUnspentTxOuts: UnspentTxOut[], receiptAmount: number, signature: SignatureInput): [TxIn[], number] {
        let targetAmount = 0 // 총 사용금액

        const txins = myUnspentTxOuts.reduce((acc: TxIn[], unspentTxOut: UnspentTxOut) => {
            const { amount, txOutId, txOutIndex } = unspentTxOut
            if (targetAmount >= receiptAmount) return acc
            targetAmount += amount
            acc.push({ txOutIndex, txOutId, signature })
            return acc
        }, [] as TxIn[])

        return [txins, targetAmount]
    }
    createOutput(received: string, amount: number, sender: string, balance: number) {
        const txouts: TxOut[] = []
        txouts.push({ account: received, amount })
        if (balance - amount > 0) {
            txouts.push({ account: sender, amount: balance - amount })
        }
        const outAmount = txouts.reduce((acc, txout: TxOut) => acc + txout.amount, 0)
        if (balance !== outAmount) throw new Error("금액오류")

        return txouts
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
        // console.log(txoutText) // hash + hash

        const txinText = txIns?.reduce((acc: string, v: TxIn) => {
            return acc + this.serializeTxIn(v)
        }, "")

        // console.log(txoutText, text1) // 같다.
        // console.log(txinText, text2) // 같다.

        return this.crypto.SHA256(text1 + text2)
    }

    // 앞으로 생성되는 블록 전에 실행될 메서드이다.
    createCoinbase(account: string, lastestBlockHeight: number): TransactionRow {
        const txin = this.createTxIn(lastestBlockHeight + 1)
        const txout = this.createTxOut(account, this.REWARD)
        return this.createRow([txin], [txout])
        //
    }
}

export default Transaction

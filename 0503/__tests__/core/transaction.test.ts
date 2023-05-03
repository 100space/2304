import CryptoModule from "@core/crypto/crypto.module"
import Transaction from "@core/transaction/transaction"

describe("Transaction", () => {
    let transaction: Transaction
    let crypto: CryptoModule

    beforeEach(() => {
        crypto = new CryptoModule()
        transaction = new Transaction(crypto)
    })

    describe("createTxOut", () => {
        const account = "0".repeat(40)
        it("TxOut 생성하기", () => {
            const amount = 50
            const txout = transaction.createTxOut(account, 50)
            expect(txout.account).toBe(account)
            expect(txout.amount).toBe(amount)
        })
        it("TxOut account 값이 이상할 경우", () => {
            const account = "0".repeat(39)
            const amount = 50
            expect(() => {
                transaction.createTxOut(account, amount)
            }).toThrowError()
        })
    })
    describe("createTxIn", () => {
        const txOutIndex = 2
        it("txIn 생성하기", () => {
            const txin = transaction.createTxIn(txOutIndex)
            console.log(txin)
            expect(txin.txOutIndex).toBe(txOutIndex)
        })
    })
    describe("createRow", () => {
        it("transactionRow 만들기", () => {
            //txIn만들기
            const txOutIndex = 2
            const txin = transaction.createTxIn(txOutIndex)
            const account = "0".repeat(40)
            const amount = 50
            const txout = transaction.createTxOut(account, amount)
            const row = transaction.createRow([txin, txin, txin], [txout])
            console.log(row)

            expect(row.txIns).toStrictEqual([txin, txin, txin]) // tostring으로 변환후 검사한다.
            expect(row.txOuts).toStrictEqual([txout])
        })
        it("매개변수 내용이 올바르지 않을 때 ", () => {
            const row = transaction.createRow([], [])
        })
    })
})

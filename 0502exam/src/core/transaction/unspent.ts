import Transaction from "./transaction"
import { TransactionRow, TxOut, UnspentTxOut, UnspentTxOutPool } from "./transaction.interface"

class Unspent {
    //UTXO를 모아두는 배열
    private readonly utxoArr: UnspentTxOutPool = []
    constructor(private readonly transaction: Transaction) {}

    // UTXO Pool 가져오기
    getUnspentTxPool() {
        return this.utxoArr
    }
    //UTXO 생성을 위한 메서드
    createUTXO(transaction: TransactionRow): void {
        const { txOuts, hash } = transaction
        if (!hash) throw new Error("hash값이 없습니다.")

        //트랜잭션의 output을 이용해서 미사용객체를 만든다.
        //txouts의 갯수는 가변적이다.
        const newUtxo = txOuts.map((txout: TxOut, index: number) => {
            const utxo = new UnspentTxOut()
            utxo.txOutId = hash //고유값
            utxo.txOutIndex = index
            utxo.account = txout.account
            utxo.amount = txout.amount
            return utxo
        })
        this.utxoArr.push(...newUtxo)
    }

    //UTXO 배열중에 내 UTXO가져오기
    myUtxo(account: string): UnspentTxOut[] {
        const myUtxo = this.utxoArr.filter((v) => v.account === account)
        return myUtxo
    }
}
export default Unspent

import { TransactionData } from "core/transaction/transaction.interface"
import { Difficulty, Hash, Height, Timestamp } from "types/block"

export class BlockInfo {
    public version!: string
    public height!: Height
    public timestamp!: Timestamp
    public previousHash!: Hash
    public merkleRoot!: Hash
    public nonce!: number
    public difficulty!: Difficulty
}

export class BlockData extends BlockInfo {
    public data!: TransactionData // 스트링 또는 배열안 객체의 형태를 가질 수 있다.
}

export class IBlock extends BlockData {
    public hash!: Hash
}

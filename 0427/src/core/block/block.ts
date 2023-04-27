import { VERSION } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import { BlockData, BlockInfo, IBlock } from "./block.interface"

class Block {
    constructor(private readonly crypto: CryptoModule) {}

    createBlock(previousBlock: IBlock, data: TransactionData) {}

    isVaildBlock(block: IBlock): void {
        this.crypto.isValidHash(block.hash)
        const validHash = this.crypto.createBlockHash(block)
        if (validHash !== block.hash)
            throw new Error(`블록 해시값이 올바르지 않습니다. hash : ${validHash},${block.hash}`)
    }

    createBlockData(previousBlock: IBlock, data: TransactionData): BlockData {
        const blockInfo = this.createBlockInfo(previousBlock)

        return {
            ...blockInfo,
            merkleRoot: this.crypto.merkleRoot(data),
            data,
        } as BlockData
    }

    createBlockInfo(previousBlock: IBlock): BlockInfo {
        this.isVaildBlock(previousBlock) // 이전 블록의 정보가 정확한지 확인한 후에 다음 로직 진행한다.
        const blockInfo = new BlockInfo()
        blockInfo.version = VERSION
        blockInfo.height = previousBlock.height + 1
        blockInfo.timestamp = new Date().getTime()
        blockInfo.previousHash = previousBlock.hash
        return blockInfo
    }
}
export default Block

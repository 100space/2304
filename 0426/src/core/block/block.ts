import { VERSION } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import { BlockData, BlockInfo, IBlock } from "./block.interface"

class Block {
    constructor(private readonly crypto: CryptoModule) {}

    isVaildBlock(block: IBlock): void {
        this.crypto.isValidHash(block.hash)
        const validHash = this.crypto.createBlockHash(block)
        if (validHash !== block.hash)
            throw new Error(`블록 해시값이 올바르지 않습니다. hash : ${validHash},${block.hash}`)
    }

    // createBlockData(blockInfo: BlockInfo, data: TransactionData): BlockData {
    //     //blockInfo 값을 받아야 한다.

    //     return {
    //         ...blockInfo,
    //         merkleRoot: this.crypto.merkleRoot(data),
    //         data,
    //     } as BlockData
    // }

    //blockData 리팩토링
    // 1. createBlockInfo <- 이전블록
    // 2. createBlockData(createBlockInfo(), transactionp[])

    createBlockData(previousBlock: IBlock, data: TransactionData): BlockData {
        const blockInfo = this.createBlockInfo(previousBlock)

        return {
            ...blockInfo,
            merkleRoot: this.crypto.merkleRoot(data),
            data,
        } as BlockData
    }

    createBlockInfo(previousBlock: IBlock): BlockInfo {
        // const blockInfo: BlockInfo = {
        //     version: VERSION, // 보통 환경설정으로 정해두고 가져다 쓰기 때문에 상수로 만든 값을 가져오는 코드로 작성했다.
        //     height: previousBlock.height + 1,
        //     timestamp: new Date().getTime(),
        //     previousHash: previousBlock.hash, // 이전블럭의 해시값 = 생성할 블럭의 previousHash
        //     nonce: 0,
        //     difficulty: 0,
        // }

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

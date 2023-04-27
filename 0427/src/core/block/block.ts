import { VERSION } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import { BlockData, BlockInfo, IBlock } from "./block.interface"
import WorkProof from "./workproof/workproof"

class Block {
    constructor(private readonly crypto: CryptoModule, private readonly workProof: WorkProof) {}

    createBlock(previousBlock: IBlock, data: TransactionData, adjustmentBlock: IBlock) {
        const blockData = this.createBlockData(previousBlock, data) // block의 데이터 값 구하기
        // 작업증명을 위한 로직
        // POW를 알아볼 예정이다.
        // blockhash 를 만들때 조건이 POW의 조건이다.
        // hex->binary 변환했을 때 앞에 0이 몇개 붙었는지?
        // 기준은 블록생성시간 기준으로 빨리만들어졌으면 난이도를 올리고 늦게 만들어졌으면 난이도를 낮춰서 빠르게 생성되게 해야 한다.
        // 블록 생성 기준은 10분 ( 비트코인이 10분)
        // 몇 번째 블럭이랑 비교할 것인가?
        // 10번 째 블록을 기준으로 잡는다.
        // 1~10번째 블록은 난이도를 동일하게 하면서 11 번째 블록이랑 1번째 블록을 비교해서 난이도를 설정한다.
        //adjustmentBlock은 10번째 전 블록으로 난이도를 결정하기 위해서 비교군으로 넣어준다ㅏ.
        const newBlock = this.workProof.run(blockData, adjustmentBlock)
        return newBlock
    }

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

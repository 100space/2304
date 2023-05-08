import { BLOCK_GENERATION_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"
import { BlockInfo, IBlock } from "../block.interface"
import { DifficultyProps, Proof, ProofOfWorkProps } from "./workproof.interface"

class ProofOfWork implements Proof {
    constructor(private readonly crypto: CryptoModule) {}
    execute(props: ProofOfWorkProps): IBlock {
        const { blockData, adjustmentBlock } = props
        let block: IBlock = { ...blockData, hash: "" }

        do {
            block.nonce += 1
            block.timestamp = new Date().getTime()
            block.difficulty = this.getDifficulty(this.getDifficultyProps(block, adjustmentBlock))
            console.log(block)
            block.hash = this.crypto.createBlockHash(block)
        } while (!this.crypto.hashToBinary(block.hash).startsWith("0".repeat(block.difficulty)))
        return block
    }
    getDifficultyProps(block: IBlock, adjustmentBlock: IBlock): DifficultyProps {
        const { height, timestamp: currentTime } = block
        const { difficulty, timestamp: adjTime } = adjustmentBlock

        return {
            height,
            currentTime,
            difficulty,
            adjTime,
        }
    }
    getDifficulty(props: DifficultyProps): number {
        const { height, currentTime, adjTime, difficulty } = props
        const time = currentTime - adjTime
        const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL

        if (height < 0) throw new Error("높이가 0 미만입니다.")
        if (height < 10) return 0
        if (height < 21) return 1
        if (height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return difficulty
        if (time < timeExpected / 2) difficulty + 1
        if (time > timeExpected * 2) difficulty - 1
        if (difficulty < 0) return 0
        return difficulty
    }
}

export default ProofOfWork

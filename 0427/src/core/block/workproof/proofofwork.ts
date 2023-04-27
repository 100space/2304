import { BLOCK_GENERATION_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL } from "@constasnts/block.constants"
import CryptoModule from "@core/crypto/crypto.module"
import { IBlock } from "../block.interface"
import { DifficultyProps, Proof, ProofOfWorkProps } from "./workproof.interface"

class ProofOfWork implements Proof {
    constructor(private readonly crypto: CryptoModule) {}
    execute(props: ProofOfWorkProps): IBlock {
        //{blockData, adjustmentBlock} // 해시 유무의 차이이다.
        //POW 로직구현
        const { blockData, adjustmentBlock } = props

        // 연산
        // 1. blockData의 nonce를 +1한다. // blockData.nonce = blockData.nonce +1
        // 2. 블록의 생성이 끝난시점에 timestamp로 지정해야한다. //blockData.timestamp =  new Data().getTime()
        // 3. blockData.difficulty //
        // 4. blockData.hash = SHA256 <- 크립토를 의존주입을 받아야 한다.
        // hex -> binany 변환해서 difficulty 값이랑 비교한다.
        // binany의 0의 개수가 몇개인지, difficulty랑 비교한다.
        // return blockData + hash as IBlock

        // 난이도 만들기

        let block: IBlock = { ...blockData, hash: "" }

        do {
            block.nonce += 1
            block.timestamp = new Date().getTime()
            block.difficulty = this.getDifficulty(this.getDifficultyProps(block, adjustmentBlock))
            block.hash = this.crypto.createBlockHash(block)
            console.log(block.difficulty)
        } while (!this.crypto.hashToBinary(block.hash).startsWith("0".repeat(block.difficulty)))
        return block as IBlock
    }
    getDifficultyProps(block: IBlock, adjustmentBlock: IBlock): DifficultyProps {
        const { height, timestamp: currentTime } = block
        const { difficulty, timestamp: adjTime } = adjustmentBlock
        return {
            height,
            currentTime,
            adjTime,
            difficulty,
        }
    }

    //매개변수로 블럭높이, 이전블럭의 난이도, 현재 블록 타임스탬프, 10번째 전 블록 타임스탬프
    getDifficulty(props: DifficultyProps): number {
        const { height, currentTime, adjTime, difficulty } = props
        //난이도를 만들기 위한 로직
        // 1. block 높이가 20이하일 경우에는 체크 X
        // 2. block 높이가 10의 배수가 아닐 겨우 10번째 전 블럭 난이도로 설정한다.
        // 3. 모든 조건이 통과 되었을 때, 현재 블록생성시간-10번째 전 블록의 생성시간 = 총걸린시간
        // ex ) 1블럭당 10분 10블럭이면 100분 = 목표시간
        // 생성시간이 빨랐다: 총걸린시간 < 목표시간/2 = 이전블록의 난이도 +1
        // 생성시간이 느렸다: 총걸린시간 > 목표시간*2 = 이전블록의 난이도 -1
        // 비슷하다면 이전블록의 난이도

        // 10의 배수를 가변적으로 하기 위해서 따로 상수로 뽑아서 사용하고 싶다.
        // 10분이라는 조건도 상수로 뽑고 싶다.

        const timeTaken = currentTime - adjTime //총 걸린시간(timestamp) : 현재시간 - 10번째 전 블록생성시간
        const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL

        //1번
        if (height < 0) throw new Error("높이가 0미만입니다.")
        if (height < 10) return 0
        if (height < 21) return 1
        //2번
        if (height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return difficulty
        //3번
        if (timeTaken < timeExpected / 2) return difficulty + 1
        if (timeTaken > timeExpected * 2) return difficulty - 1
        if (difficulty < 0) return 0
        return difficulty
    }
}

export default ProofOfWork

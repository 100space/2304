import { Difficulty, Height, Timestamp } from "types/block"
import { BlockData, IBlock } from "../block.interface"

//POW를 만들고 싶으면 인자값으로
export interface ProofOfWorkProps {
    blockData: BlockData
    adjustmentBlock: IBlock
}
export interface ProofOfStakeProps {
    blockData: BlockData
    adjustmentBlock: IBlock
}
export interface DifficultyProps {
    height: Height
    currentTime: Timestamp
    adjTime: Timestamp
    difficulty: Difficulty // 10번째 전 블록의 난이도
}
export type ProofProps = ProofOfWorkProps | ProofOfStakeProps

export interface Proof {
    execute(props: ProofProps): IBlock
}

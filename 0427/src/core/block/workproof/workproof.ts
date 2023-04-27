import { BlockData, IBlock } from "../block.interface"
import { Proof, ProofProps } from "./workproof.interface"

class WorkProof {
    constructor(private readonly proof: Proof) {}
    //BlockData는 해시가 없는 블록의 속성들을 가진 데이터타입이고, IBlock은 해시를 가진 블럭이다
    run(blockData: BlockData, adjustmentBlock: IBlock): IBlock {
        const props: ProofProps = {
            blockData,
            adjustmentBlock,
        } as ProofProps
        return this.proof.execute(props)
    }
}

export default WorkProof

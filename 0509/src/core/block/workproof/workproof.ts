import { BlockData, IBlock } from "../block.interface"
import { Proof, ProofProps } from "./workproof.interface"

class WorkProof {
    constructor(private readonly proof: Proof) {}
    run(blockData: BlockData, adjustmentBlock: IBlock): IBlock {
        const props: ProofProps = {
            blockData,
            adjustmentBlock,
        } as ProofProps
        return this.proof.execute(props)
    }
}

export default WorkProof

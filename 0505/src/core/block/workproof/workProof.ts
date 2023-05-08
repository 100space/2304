import { BlockData, IBlock } from "../block.interface"
import { Proof, ProofParams } from "./workproof.interface"

class WorkProof {
    constructor(private readonly proof: Proof) {}
    run(blockData: BlockData, adjustmentBlock: IBlock): IBlock {
        const props = {
            blockData,
            adjustmentBlock,
        } as ProofParams
        return this.proof.execute(props)
    }
}

export default WorkProof

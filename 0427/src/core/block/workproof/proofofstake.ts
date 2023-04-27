import { IBlock } from "../block.interface"
import { Proof } from "./workproof.interface"

class ProofOfStake implements Proof {
    execute(): IBlock {
        //POS 로직구현
        return {} as IBlock
    }
}

export default ProofOfStake

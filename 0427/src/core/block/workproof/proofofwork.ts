import { IBlock } from "../block.interface"
import { Proof } from "./workproof.interface"

class ProofOfWork implements Proof {
    execute(): IBlock {
        //POW 로직구현
        return {} as IBlock
    }
}

export default ProofOfWork

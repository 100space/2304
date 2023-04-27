import { IBlock } from "../block.interface"
import { Proof, ProofOfStakeProps } from "./workproof.interface"

class ProofOfStake implements Proof {
    execute(props: ProofOfStakeProps): IBlock {
        //POS 로직구현
        console.log("POS 실행")
        return {} as IBlock
    }
}

export default ProofOfStake

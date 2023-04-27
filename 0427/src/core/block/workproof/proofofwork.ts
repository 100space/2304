import { IBlock } from "../block.interface"
import { Proof } from "./workproof.interface"

class ProofOfWork implements Proof {
    execute(): IBlock {
        //POW 로직구현
        console.log("POW 실행")

        return {} as IBlock
    }
}

export default ProofOfWork

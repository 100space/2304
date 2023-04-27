import ProofOfWork from "./proofofwork"
import { Proof } from "./workproof.interface"

class WorkProof {
    constructor(private readonly work: Proof) {}
    run() {
        this.work.execute()
    }
}

export default WorkProof

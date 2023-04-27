import ProofOfWork from "./proofofwork"
import { Proof } from "./workproof.interface"

class WorkProof {
    constructor(private readonly work: Proof) {}
    run(type: string) {
        this.work.execute()
        console.log("blsock hello")
    }
}

const work = new ProofOfWork()
new WorkProof(work)

export default WorkProof

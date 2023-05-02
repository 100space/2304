import ProofOfStake from "@core/block/workproof/proofofstake"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import { Proof } from "@core/block/workproof/workproof.interface"

describe("workProof", () => {
    let workProof: WorkProof
    let proof: Proof

    describe("ProofOfWork", () => {
        beforeEach(() => {
            // Proof 타입을 주입해준다.
            proof = new ProofOfWork()
            workProof = new WorkProof(proof)
        })
        it("console 찍히나?", () => {
            workProof.run()
        })
    })
    describe("ProofOfStake", () => {
        beforeEach(() => {
            // Proof 타입을 주입해준다.
            proof = new ProofOfStake()
            workProof = new WorkProof(proof)
        })
        it("console 찍히나?", () => {
            workProof.run()
        })
    })
})

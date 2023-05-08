import { BlockData, IBlock } from "@core/block/block.interface"
import ProofOfStake from "@core/block/workproof/proofofstake"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import { Proof } from "@core/block/workproof/workproof.interface"
import CryptoModule from "@core/crypto/crypto.module"

describe("workProof", () => {
    let workProof: WorkProof
    let proof: Proof
    let crypto: CryptoModule
    let blockData: BlockData
    let adjustmentBlock: IBlock

    describe("ProofOfWork", () => {
        beforeEach(() => {
            // Proof 타입을 주입해준다.
            proof = new ProofOfWork(crypto)
            workProof = new WorkProof(proof)
            blockData = {
                nonce: 0,
                difficulty: 0,
                version: "1.0.0",
                height: 4,
                timestamp: 1683281328445,
                previousHash: "0e80e24bcfdeb2cd742938ae55cf3cae44704eec9e5b81ff0303a537875516fe",
                merkleRoot: "C68C8325047B2CF42F96FEF31803535CB4E6690A627A1CA087A721F7066F4DEE",
                data: [],
            }
            adjustmentBlock = {
                version: "1.0.0",
                height: 1,
                timestamp: 1231006506,
                nonce: 0,
                difficulty: 0,
                merkleRoot: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8",
                previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
                hash: "84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370",
                data: "2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관",
            }
        })
        it("console 찍히나?", () => {
            workProof.run(blockData, adjustmentBlock)
        })
    })
    describe("ProofOfStake", () => {
        beforeEach(() => {
            // Proof 타입을 주입해준다.
            proof = new ProofOfStake()
            workProof = new WorkProof(proof)
        })
        it("console 찍히나?", () => {
            workProof.run(blockData, adjustmentBlock)
        })
    })
})

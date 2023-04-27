import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

console.log("hello bitcoin")

//블럭을 100~1000개 만들기

const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const workProof = new WorkProof(proofofwork)
const block = new Block(crypto, workProof)

const block1 = block.createBlock(GENESIS, "123123", GENESIS)
console.log(block1, 123123)

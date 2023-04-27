import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

console.log("hello bitcoin")

//블럭을 100~1000개 만들기

const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const workProof = new WorkProof(proofofwork)
const block = new Block(crypto, workProof)

// const block1 = block.createBlock(GENESIS, "123123", GENESIS)
// const block2 = block.createBlock(block1, "123123", GENESIS)
// const block3 = block.createBlock(block2, "123123", GENESIS)

// console.log(block1, 1)
// console.log(block2, 2)
// console.log(block3, 3)

let blockArr = [GENESIS]
let Nblock: IBlock
let previousBlock = GENESIS
let adjustmentBlock = GENESIS
for (let i = 1; i < 100; i++) {
    previousBlock = blockArr[i - 1]
    if (i > 19) adjustmentBlock = blockArr[Math.floor(i / 10 - 1) * 10]
    Nblock = block.createBlock(previousBlock, "123123", adjustmentBlock)
    blockArr.push(Nblock)
}
console.log(blockArr[0])

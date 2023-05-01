import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

import DigitalSignature from "@core/transaction/digitalSignature"
import Transaction from "@core/transaction/transaction"

console.log("hello bitcoin")

//블럭을 100~1000개 만들기

const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const digitalSignature = new DigitalSignature(crypto)
const transaction = new Transaction(crypto)
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
    Nblock = block.createBlock(previousBlock, "123123124124", adjustmentBlock)
    blockArr.push(Nblock)
}
// console.log(blockArr)

//코인베이스
const privateKey = "7252c2df08138d6baa44532ecccef306595c4e0fce99d37fd7a2f4df2cfe048b"
const publicKey = digitalSignature.createPublicKey(privateKey)
const account = digitalSignature.createAccount(publicKey)

// console.log(account)

// TX
const tx = transaction.createCoinbase(account, GENESIS.height)
console.log(tx)
const block2 = block.createBlock(GENESIS, [tx], GENESIS)
console.log(block2)

//////////////////////////////////////////////////////////////////
// // 영수증 -> transaction -> 블록생성

// //GENESIS
// //block2 : coinbase
// //block3 : coinbase, transaction 1건에 대한 블록

// //영수증
// const receipt = {
//     sender: {
//         account,
//         publicKey,
//     },
//     received: "0".repeat(40), // 원래는 누군가의 account이지만 임의의 값으로 코드가 돌아갈 수 있게만 만듬
//     amount: 30,
// }

// // TX
// //txOutId : hash 값이라고 생각하면 된다.
// const txin = transaction.createTxIn()
// const txout = transaction.createTxOut()
// transaction.createRow(txin, txout)

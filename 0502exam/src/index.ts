import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

import DigitalSignature from "@core/transaction/digitalSignature"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"

console.log("hello bitcoin")

//블럭을 100~1000개 만들기

const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const digitalSignature = new DigitalSignature(crypto)
const transaction = new Transaction(crypto)
const workProof = new WorkProof(proofofwork)
const block = new Block(crypto, workProof)
const unspent = new Unspent(transaction)

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

//코인베이스
const privateKey = "7252c2df08138d6baa44532ecccef306595c4e0fce99d37fd7a2f4df2cfe048b"
const publicKey = digitalSignature.createPublicKey(privateKey)
const account = digitalSignature.createAccount(publicKey)

// TX
const coinbase_block2 = transaction.createCoinbase(account, GENESIS.height)
unspent.createUTXO(coinbase_block2)
// console.log(unspent.getUnspentTxPool(), 111) // coinbase를 이용한 utxo 생성됨
const block2 = block.createBlock(GENESIS, [coinbase_block2], GENESIS)

//트랜잭션 만들기
//input
//output

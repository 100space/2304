import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

import DigitalSignature from "@core/transaction/digitalSignature"
import Transaction from "@core/transaction/transaction"
import { Receipt } from "@core/transaction/transaction.interface"
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

//코인베이스
// const privateKey = digitalSignature.createPrivateKey()
const privateKey = "7252c2df08138d6baa44532ecccef306595c4e0fce99d37fd7a2f4df2cfe048b"
const publicKey = digitalSignature.createPublicKey(privateKey)
const account = digitalSignature.createAccount(publicKey)

// TX
const coinbase2 = transaction.createCoinbase(account, GENESIS.height)
unspent.createUTXO(coinbase2)
const block2 = block.createBlock(GENESIS, [coinbase2], GENESIS)

//영수증
const receipt: Receipt = {
    sender: {
        account,
        publicKey,
    },
    received: "0".repeat(40), // 원래는 누군가의 account이지만 임의의 값으로 코드가 돌아갈 수 있게만 만듬
    amount: 30,
    signature: "0000",
}

// TX 만들기
//보내는 사람의 잔고
//////방법 1
const myutxo = unspent.me(account)
const totalAmount = unspent.getAmount(myutxo)
if (unspent.isAmount(totalAmount, receipt.amount)) new Error("잔액부족") //잔고가 영수증의 내용보다 크니(보낼양 보다 많이 가지고있니?)
////// 방법 2
const flag = unspent.isAmount2(account, receipt.amount)
if (flag) console.log("잔액부족")

// TxIn
//미사용 객체에서부터 만들어진 것 -> unspent
// unspent.getUnspentTxPool()에서 sender입장에서 보낼 미사용 객체를 뽑아야한다.
// 보낼사람의 미사용객체 뽑기
// 내가 보낼 amount값이랑 얼추 비슷한 금액을 만들어야한다.
//getInput()

//사용할 미사용객체
const txin1 = unspent.getInput(receipt)
// const txin1 = transaction.createTxIn(1, "", receipt.signature) // 미완성이기 때문에 리팩토링 //필요가 없어짐

// TxOut
// 총수량 - amount
const txout1 = unspent.getOutput(receipt)
// const txout_sender = transaction.createTxOut(receipt.sender.account, 50 - receipt.amount)
// const txout_received = transaction.createTxOut(receipt.received, receipt.amount)

const tx1 = transaction.createRow(txin1, txout1)
console.log(tx1, 1111111111)
unspent.createUTXO(tx1)
// console.log(unspent.getUnspentTxPool(), 11111111)

//함수로 잘 만들어서 receipt를 받은 내용을 처리할 수있는 함수를 만든다.
const tx2 = transaction.create(receipt)
console.log(tx2, 222222)
unspent.createUTXO(tx2)
// console.log(unspent.getUnspentTxPool(), 2222222)
const coinbase3 = transaction.createCoinbase(account, block2.height)
const block3 = block.createBlock(block2, [coinbase3, tx1, tx2], GENESIS)

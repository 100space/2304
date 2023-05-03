import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

import DigitalSignature from "@core/wallet/digitalSignature"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"
import { Receipt } from "@core/wallet/wallet.interface"
import wallet from "@core/wallet/wallet"

console.log("hello bitcoin")

//블럭을 100~1000개 만들기

const crypto = new CryptoModule()
const proofofwork = new ProofOfWork(crypto)
const digitalSignature = new DigitalSignature(crypto)
const transaction = new Transaction(crypto)
const workProof = new WorkProof(proofofwork)
const block = new Block(crypto, workProof)
const unspent = new Unspent()
const accounts = new wallet(digitalSignature)

const sender = accounts.create()

//받는사람은 40글자의 account이기 때문에 예외처리가 필요하다.
const receipt = accounts.receipt("0".repeat(40), 30) // 받는 사람과 받는 양을 입력해주면 영수증이 나온다.

import Block from "@core/block/block"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import Chain from "@core/chain/chain"
import CryptoModule from "@core/crypto/crypto.module"
import Ingchain from "@core/ingchain"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"
import DigitalSignature from "@core/wallet/digitalSignature"
import Wallet from "@core/wallet/wallet"

const chain = new Chain()

const crypto = new CryptoModule()
const proof = new ProofOfWork(crypto)

const workProof = new WorkProof(proof)
const block = new Block(crypto, workProof)

const transaction = new Transaction(crypto)
const unspent = new Unspent()

const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)

const baekspace = new Ingchain(chain, block, transaction, unspent, accounts)

const sender = accounts.create()
const received = accounts.create()

const receipt = baekspace.accounts.receipt(received.account, 30)
console.log(receipt)

baekspace.mineBlock(sender.account)
baekspace.mineBlock(received.account)

baekspace.sendTransaction(receipt)
baekspace.mineBlock(sender.account)

//Transaction 을 만든 다음에 pool에 저장한다.
//baekspace.sendTransaction()로 트랜잭션을 보내면 트랜잭션 풀에 내용이 담기게 하는 것이 목표

const balance = baekspace.getBalance(sender.account) // 50 -> 20
const balance2 = baekspace.getBalance(received.account) //50 -> 80
console.log(balance, balance2)

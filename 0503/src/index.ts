import Block from "@core/block/block"
import ProofOfWork from "@core/block/workproof/proofofwork"
import WorkProof from "@core/block/workproof/workproof"
import Chain from "@core/chain/chain"
import CryptoModule from "@core/crypto/crypto.module"
import Ingchain from "@core/ingchain"
import Transaction from "@core/transaction/transaction"
import Unspent from "@core/transaction/unspent"
import DigitalSignature from "@core/wallet/digitalSignature"
import wallet from "@core/wallet/wallet"

const chain = new Chain()

const crypto = new CryptoModule()
const proof = new ProofOfWork(crypto)

const workProof = new WorkProof(proof)
const block = new Block(crypto, workProof)

const transaction = new Transaction(crypto)
const unspent = new Unspent()
const baekspace = new Ingchain(chain, block, transaction, unspent)

const digitalSignature = new DigitalSignature(crypto)
const accounts = new wallet(digitalSignature)

const sender = accounts.create()

const block01 = baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
baekspace.mineBlock(sender.account)
console.log(block)

const balance = baekspace.getBalance(sender.account)
console.log(balance)

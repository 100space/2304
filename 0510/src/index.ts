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
import App from "@server/app"
import Message from "@server/message"
import P2PNetwork from "@server/p2p"

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

const app = App(baekspace)

// app.listen(8545, () => {
//     console.log(`server start`)
// })
const { account } = accounts.create()
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)
baekspace.mineBlock(account)

const message = new Message(baekspace)
const p2p = new P2PNetwork(message)
p2p.listen(8555)

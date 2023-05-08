import CryptoModule from "@core/crypto/crypto.module"
import { randomBytes } from "crypto"
import elliptic from "elliptic"
import { Receipt } from "./wallet.interface"

class DigitalSignature {
    private readonly ec = new elliptic.ec("secp256k1")
    constructor(private readonly crypto: CryptoModule) {}

    createPrivateKey() {
        return randomBytes(32).toString("hex")
    }

    createPublicKey(privateKey: string) {
        const keyPair = this.ec.keyFromPrivate(privateKey)
        const publicKey = keyPair.getPublic().encode("hex", true)
        return publicKey
    }

    createAccount(publicKey: string) {
        const buffer = Buffer.from(publicKey)
        const account = buffer.slice(26).toString()
        return account
    }

    sign(receipt: Receipt, privateKey: string) {
        const keyPair = this.ec.keyFromPrivate(privateKey)
        const receiptHash = this.crypto.createReceiptHash(receipt)
        const signature = keyPair.sign(receiptHash, "hex").toDER("hex")
        receipt.signature = signature
        return receipt
    }
    verify(receipt: Receipt): boolean {
        const {
            sender: { publicKey },
            signature,
        } = receipt
        if (!publicKey || !signature) throw new Error("Receipt 내용이 올바르지 않다.")
        const receiptHash = this.crypto.createReceiptHash(receipt)
        return this.ec.verify(receiptHash, signature, this.ec.keyFromPublic(publicKey, "hex"))
    }
}

export default DigitalSignature

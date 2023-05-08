import { Hash } from "types/block"
import cryptojs from "crypto-js"
import { BlockData, IBlock } from "@core/block/block.interface"
import merkle from "merkle"
import { TransactionData } from "@core/transaction/transaction.interface"
import { Receipt } from "@core/wallet/wallet.interface"

class CryptoModule {
    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }
    merkleRoot(data: TransactionData): Hash {
        if (typeof data === "string") {
            return merkle("sha256").sync([data]).root()
        } else {
            return merkle("sha256").sync(data).root()
        }
    }
    createBlockHash(data: BlockData | IBlock): Hash {
        const { version, height, timestamp, nonce, difficulty, previousHash, merkleRoot } = data
        const value = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`
        return this.SHA256(value)
    }
    isValidHash(hash: Hash) {
        const hexRegExp = /^[0-9a-fA-F]{64}$/
        if (!hexRegExp.test(hash)) {
            throw new Error(`Hash 값이 올바르지 않습니다. Hash:${hash}`)
        }
    }
    hashToBinary(hash: Hash) {
        let binary = ""
        for (let i = 0; i < hash.length; i += 2) {
            const hexByte = hash.substr(i, 2)
            const decimal = parseInt(hexByte, 16)
            const binaryByte = decimal.toString(2).padStart(8, "0")
            binary += binaryByte
        }
        return binary
    }
    createReceiptHash(receipt: Receipt) {
        const {
            sender: { publicKey },
            received,
            amount,
        } = receipt
        const msg = [publicKey, received, amount].join("")
        return this.SHA256(msg)
    }
}
export default CryptoModule

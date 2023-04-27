import { Hash } from "types/block"
import cryptojs from "crypto-js"
import merkle from "merkle"
import { TransactionData, TransactionRow } from "@core/transaction/transaction.interface"
import { BlockData, BlockInfo, IBlock } from "@core/block/block.interface"

class CryptoModule {
    createBlockHash(data: BlockData | IBlock): Hash {
        //data ->object ->sort->string->SHA256
        //정렬하는 방법 : keys를 이용해서
        // const value = Object.values(data).sort().join("")
        const { version, height, timestamp, merkleRoot, previousHash, difficulty, nonce } = data
        const value = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`
        return this.SHA256(value)
    }

    SHA256(data: string): Hash {
        const hash = cryptojs.SHA256(data).toString()
        return hash
    }

    //16진수를 쓰는것은 hash밖에 없다.
    hashToBinary(hash: Hash): string {
        let binary = ""
        for (let i = 0; i < hash.length; i += 2) {
            const hexByte = hash.substr(i, 2) // aa
            const decimal = parseInt(hexByte, 16) //170
            const binaryByte = decimal.toString(2).padStart(8, "0")
            binary += binaryByte
        }
        return binary
    }
    merkleRoot(data: TransactionData) {
        if (typeof data === "string") {
            return merkle("sha256").sync([data]).root()
        } else if (Array.isArray(data)) {
            //data = [{hash:'0x123'},{hash:'saas'}]
            //data = [{hash:'0x123'}] ,,,,filter
            //data = ['0x123'] ,,,,map
            const sync = data
                .filter((v: TransactionRow) => {
                    if (!v.hash) return false
                    else this.isValidHash(v.hash)
                    return true
                })
                .map((v) => v.hash) as string[]
            return merkle("sha256").sync(sync).root()
        }
        // if (data instanceof TransactionRow) {
        //     // data : transactionRow
        // } else {
        //     //data:string
        //     return merkle("sha256").sync([data]).root()
        // }
    }

    isValidHash(hash: Hash): void {
        // 0~9, a~f, A~F
        // 64글자
        // 정규식으로 패턴을 검사한다.
        const hexRegExp = /^[0-9a-fA-F]{64}$/
        if (!hexRegExp.test(hash)) {
            throw new Error(`Hash 값이 올바르지 않습니다. hash: ${hash}`)
        }
    }
}
export default CryptoModule

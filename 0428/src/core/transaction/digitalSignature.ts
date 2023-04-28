import CryptoModule from "@core/crypto/crypto.module"
import { randomBytes } from "crypto"
import elliptic, { SignatureInput } from "elliptic"
import { Receipt } from "./transaction.interface"

class DigitalSignature {
    private readonly ec = new elliptic.ec("secp256k1")
    constructor(private readonly crypto: CryptoModule) {}
    // 개인키 만들기
    createPrivateKey() {
        return randomBytes(32).toString("hex")
    }

    // 공개키 만들기
    createPublicKey(privateKey: string) {
        //퍼블릭키를 만들기 위해서 프라이빗키를 받고 이를 이용해서 알고리즘이 있는 라이브러리를 사용하면 공개키를 만들 수 있다.
        const keyPair = this.ec.keyFromPrivate(privateKey)
        const publicKey = keyPair.getPublic().encode("hex", true) //32byte + 1byte

        return publicKey // 32byte
    }

    createAccount(publicKey: string) {
        //public은 32byte인데 알고리즘을 이용해서 작업하면 1byte가 추가 된다. 그래서 account 를 만들때 13byte를 잘라야한다.
        const buffer = Buffer.from(publicKey) // 앞을 자르기 위해서 버퍼를 사용하는 것이 좋다.
        const account = buffer.slice(24).toString()
        return account
    }

    //서명을 하기 위해서는 개인키와 데이터(평문)이 있어야한다.
    sign(privateKey: string, receipt: Receipt) {
        //서명이라는 것을 하려면 개인키와, 평문을 가지고 암호화를한다.
        const keyPair = this.ec.keyFromPrivate(privateKey)
        //receipt 평문 제작해야함.// 객체 모양 순서가 다를 때..
        const receiptHash = this.crypto.createReceiptHash(receipt)
        const signature = keyPair.sign(receiptHash, "hex").toDER("hex") // hex값으로 나온다(string)
        receipt.signature = signature
        return receipt
    }
    verify(receipt: Receipt): boolean {
        //receipt 객체 안에 있는 sender, recived, amount 를 합치면 string이 나오는데 이를 hash화해서 평문으로 사용하고 싶다.
        const {
            sender: { publicKey },
            signature,
        } = receipt

        if (!publicKey || !signature) throw new Error("receipt 내용이 올바르지 않습니다.")
        const receiptHash = this.crypto.createReceiptHash(receipt)

        return this.ec.verify(receiptHash, signature, this.ec.keyFromPublic(publicKey, "hex"))
    }
}

export default DigitalSignature

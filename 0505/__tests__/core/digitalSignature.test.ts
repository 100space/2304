import CryptoModule from "@core/crypto/crypto.module"
import DigitalSignature from "@core/wallet/digitalSignature"
import { Receipt } from "@core/wallet/wallet.interface"

describe("digitalSignature", () => {
    let digitalSignature: DigitalSignature
    let crypto: CryptoModule
    beforeEach(() => {
        crypto = new CryptoModule()
        digitalSignature = new DigitalSignature(crypto)
    })
    describe("createPrivateKey", () => {
        it("privateKey 만들기", () => {
            const privateKey = digitalSignature.createPrivateKey()
            expect(privateKey).toHaveLength(64)
        })
    })
    describe("createPublicKey", () => {
        it("publicKey 만들기", () => {
            const privateKey = digitalSignature.createPrivateKey()
            const publicKey = digitalSignature.createPublicKey(privateKey)
            expect(publicKey).toHaveLength(66)
        })
    })

    describe("createAccount", () => {
        it("Account 만들기", () => {
            const privateKey = digitalSignature.createPrivateKey()
            const publicKey = digitalSignature.createPublicKey(privateKey)
            const account = digitalSignature.createAccount(publicKey)
            expect(account).toHaveLength(40)
        })
    })
    describe("sign", () => {
        let sender_privateKey: string
        let sender_publicKey: string
        let sender_account: string
        let received_privateKey: string
        let received_publicKey: string
        let received_account: string

        let receipt: Receipt

        beforeEach(() => {
            sender_privateKey = digitalSignature.createPrivateKey()
            sender_publicKey = digitalSignature.createPublicKey(sender_privateKey)
            sender_account = digitalSignature.createAccount(sender_publicKey)

            received_privateKey = digitalSignature.createPrivateKey()
            received_publicKey = digitalSignature.createPublicKey(received_privateKey)
            received_account = digitalSignature.createAccount(received_publicKey)

            receipt = {
                sender: {
                    publicKey: sender_publicKey,
                    account: sender_account,
                },
                received: received_account,
                amount: 30,
            }
        })
        it("signature를 포함한 Receipt 만들기", () => {
            const signReceipt = digitalSignature.sign(receipt, sender_account)
            expect(typeof signReceipt).toBe("object")
        })
        it("signature 만들기", () => {
            const signature = digitalSignature.sign(receipt, sender_privateKey).signature
            expect(typeof signature).toBe("string")
        })
        it("verify", () => {
            const receipts = digitalSignature.sign(receipt, sender_privateKey)
            receipts.amount = 50
            const result = digitalSignature.verify(receipts)
            console.log(receipts)
        })
    })
})

import CryptoModule from "@core/crypto/crypto.module"
import DigitalSignature from "@core/wallet/digitalSignature"
import { Receipt } from "@core/transaction/transaction.interface"

describe("디지털 서명 이해하기", () => {
    // 개인키 설정
    let digitalSignature: DigitalSignature

    beforeEach(() => {
        const crypto = new CryptoModule()
        digitalSignature = new DigitalSignature(crypto)
    })

    describe("createPrivateKey", () => {
        it("개인키 생성하기", () => {
            const privateKey = digitalSignature.createPrivateKey()
            console.log(privateKey)
            expect(privateKey).toHaveLength(64)
        })
    })
    describe("createPublicKey", () => {
        it("공개키 생성하기", () => {
            const privateKey = digitalSignature.createPrivateKey()
            const publicKey = digitalSignature.createPublicKey(privateKey)

            // 개인키를 이용한 공개키는 늘 같다 (키페어 개념)
            console.log(publicKey) //1번째
            console.log(digitalSignature.createPublicKey(privateKey)) //2번째

            // expect(publicKey).toHaveLength(64) // fail : 앞에 1byte를 붙여서 66글자가 된다. 02or 03
            expect(publicKey).toHaveLength(66)
        })
    })

    describe("createAccount", () => {
        it("계정생성", () => {
            const privateKey = digitalSignature.createPrivateKey()
            const publicKey = digitalSignature.createPublicKey(privateKey)
            const account = digitalSignature.createAccount(publicKey)

            console.log(account, publicKey)

            expect(account).toHaveLength(40)
        })
    })

    describe("서명", () => {
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
                    account: sender_account,
                    publicKey: sender_publicKey,
                },
                received: received_account,
                amount: 30,
            }
        })
        it("sign만들기", () => {
            const signature = digitalSignature.sign(sender_privateKey, receipt)
            console.log(signature)
            // 3044022016b6e4549154df92c763c6b6f07b6789492d07a23404ae4e1c07f382128b2dd402200782f4051fc11a8883a5c3fd1e4cf9387a778587a902a961a2d59e046132f08d

            // 30440220 / DER
            // 0x30 / DER 형
            // 0x44 / 전체 바이트크기
            // 0x02 / R값을 시작하는 바인트
            // 0x20 / R값의 길이를 나타내는 바이트

            expect(typeof signature).toBe("object")
            expect(typeof signature.signature).not.toBe(undefined)
        })
        it("검증", () => {
            const receipt2 = digitalSignature.sign(sender_privateKey, receipt)
            receipt2.amount = 50
            const bool = digitalSignature.verify(receipt2)
            console.log(bool)
        })
    })
})

import CryptoModule from "@core/crypto/crypto.module"
import DigitalSignature from "@core/transaction/digitalSignature"

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
})

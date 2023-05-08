import { GENESIS } from "@constasnts/block.constants"
import { BlockData } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"

describe("cryptoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })
    describe("SHA256", () => {
        it("SHA256 함수를 이용해서 평문을 암호화 할 수 있는가?", () => {
            const data = "123123"
            const result = cryptoModule.SHA256(data)
            expect(result).toHaveLength(64)
        })
    })
    describe("createBlockHash", () => {
        it("block의 정보를 이용해서 해시화 할 수 있는가 ?", () => {
            const block: BlockData = {
                merkleRoot: GENESIS.merkleRoot,
                data: GENESIS.data,
                version: GENESIS.version,
                height: GENESIS.height,
                timestamp: GENESIS.timestamp,
                previousHash: GENESIS.previousHash,
                nonce: GENESIS.nonce,
                difficulty: GENESIS.difficulty,
            }
            const hash = cryptoModule.createBlockHash(block)
            console.log(hash)
            expect(hash).toHaveLength(64)
        })
    })
    describe("merkleRoot", () => {
        it("merkleRoot", () => {
            const data = GENESIS.data
            const merkleRoot = cryptoModule.merkleRoot(data)
            expect(merkleRoot).toHaveLength(64)
        })
    })
    describe("hashToBinary", () => {
        it("hash를 Binary로 변환", () => {
            const data = "112312"
            const hash = cryptoModule.SHA256(data)
            const binary = cryptoModule.hashToBinary(hash)
            expect(binary).toHaveLength(256)
        })
    })
})

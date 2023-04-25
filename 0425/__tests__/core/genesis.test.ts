import { GENESIS } from "@constasnts/block.constants"

describe("제네시스 블럭", () => {
    it("제네시스 블럭 형태가 올바른가?", () => {
        expect(GENESIS.version).toBe("1.0.0")
        expect(GENESIS.height).toBe(1)
        expect(GENESIS.timestamp).toBe(1231006506)
        expect(GENESIS.nonce).toBe(0)
        expect(GENESIS.difficulty).toBe(0)
        expect(GENESIS.hash).toBe("63f276c89f94976122ea51f5826d8d45e336e332bd5259f6deedbc2c01be62a8")
        expect(GENESIS.merkleRoot).toBe("DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8")
        expect(GENESIS.previousHash).toBe("0".repeat(64))
        expect(GENESIS.data).toBe("2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관")
    })
})

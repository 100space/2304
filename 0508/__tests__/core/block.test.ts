import { GENESIS } from "@constasnts/block.constants"
import Block from "@core/block/block"
import { IBlock } from "@core/block/block.interface"
import WorkProof from "@core/block/workproof/workproof"
import CryptoModule from "@core/crypto/crypto.module"

describe("Block", () => {
    let block: Block
    let crypto: CryptoModule
    let workproof: WorkProof
    beforeEach(() => {
        crypto = new CryptoModule()
        block = new Block(crypto, workproof)
    })
    describe("createBlockInfo", () => {
        const previousBlock = GENESIS
        it("createBlockHash 메서드가 존재하는가", () => {
            expect(typeof block.createBlockInfo).toBe("function")
        })
        it("createBlock BlockInfo가 잘 만들어지는가?", () => {
            const newBlock = block.createBlockInfo(previousBlock)
            expect(typeof newBlock).toBe("object")
        })
        it("createBlock에서 BlockInfo 내용이 올바른가?", () => {
            const newBlock = block.createBlockInfo(previousBlock)

            expect(newBlock.previousHash).toBe(previousBlock.hash)
            expect(newBlock.height).toBe(previousBlock.height + 1)
        })
    })
    describe("isValidBlock", () => {
        let previousBlock: IBlock

        beforeEach(() => {
            previousBlock = { ...GENESIS }
        })
        it("매개변수에 넘겨받은 블록해시값이 올바른가?", () => {
            expect(() => {
                block.isVaildBlock(previousBlock)
            }).not.toThrowError()
        })
        it("매개변수에 넘겨받은 블록해시값이 올바르지 않으면 에러를 발생하는가?", () => {
            previousBlock.hash = "00000"
            expect(() => {
                block.isVaildBlock(previousBlock)
            }).toThrowError() // 올바르게 들어가면 에러가 터지지 않아서 test 결과는 fail이 반환된다.
        })
        it("블록해시값이 올바르지 않다면 에러는 발생하는가?", () => {
            //마지막 숫자 0 지움
            previousBlock.hash = "84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df837"
            expect(() => {
                block.isVaildBlock(previousBlock)
            }).toThrowError() // 변경된적이 없어서 같은 값이면 에러발생
        })
    })
})

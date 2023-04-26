import { GENESIS } from "@constasnts/block.constants"
import { BlockData, BlockInfo } from "@core/block/block.interface"
import CryptoModule from "@core/crypto/crypto.module"

describe("CryptoModule", () => {
    let cryptoModule: CryptoModule
    beforeEach(() => {
        cryptoModule = new CryptoModule()
    })
    describe("SHA256", () => {
        it("SHA256에 인자 내용을 평문으로해서 암호화가 되는가?", () => {
            const data = "123"
            const result = cryptoModule.SHA256(data)
            expect(result.length).toBe(64)
        })
    })
    describe("createBlockHash", () => {
        it("SHA256에서 blockinfo 데이터로 암호화가 진행되는가?", () => {
            //blockinfo 넣기전에 data 속성을 빼기
            const blockinfo: BlockData = {
                version: GENESIS.version,
                height: GENESIS.height,
                timestamp: GENESIS.timestamp,
                previousHash: GENESIS.previousHash,
                merkleRoot: GENESIS.merkleRoot,
                nonce: GENESIS.nonce,
                difficulty: GENESIS.difficulty,
                data: "",
            }
            //객체 -> blockInfo(data 제외)
            const hash = cryptoModule.createBlockHash(blockinfo)
            console.log(hash)
            expect(hash).toHaveLength(64)
        })
    })
    describe("HashtoBinary", () => {
        it("이진데이터로 잘 변환되는가?", () => {
            const data = "hash"
            const hash = cryptoModule.SHA256(data)
            const binary = cryptoModule.hashToBinary(hash)
            expect(binary.length).toBe(256)
        })
    })
    describe("merkleroot", () => {
        it("genesis 블럭에 있는 data값에서 merkleroot 구하기", () => {
            const merkleroot = cryptoModule.merkleRoot(GENESIS.data)
            expect(merkleroot).toHaveLength(64)
        })
        it("data값이 TransactionRow[] 일 경우 merkleroot가 잘 생성되는가?", () => {
            const data = [
                { hash: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D1" },
                { hash: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D123314" },
            ]
            const merkleroot = cryptoModule.merkleRoot(data)
            expect(merkleroot).toHaveLength(64)
        })
        it("data값이 올바르지 않은 경우 에러가 발생하는가?", () => {
            const data = [
                { hash: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3DG" },
                { hash: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D12331G" },
            ]
            expect(() => {
                cryptoModule.merkleRoot(data)
            }).toThrowError()
        })
    })
    describe("isValidHash", () => {
        it("hash length가 64 미만인 경우", () => {
            const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D" // hash값이 틀려야 통과를 함.
            expect(() => {
                cryptoModule.isValidHash(hash)
            }).toThrowError()
        })
        it("hash 값이 64글자이지만 올바르지 않은 형식일경우 (마지막에 G 넣음)", () => {
            const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3DG" // hash값이 틀려야 통과를 함.
            expect(() => {
                cryptoModule.isValidHash(hash)
            }).toThrowError()
        })
    })
})

// import { GENESIS } from "@constasnts/block.constants"
// import { BlockInfo } from "@core/block/block.interface"
// import CryptoModule from "@core/crypto/crypto.module"

// describe("CrytoModule", () => {
//     let cryptoModule: CryptoModule
//     beforeEach(() => {
//         cryptoModule = new CryptoModule()
//     })
//     describe("SHA256", () => {
//         it("SHA256함수를 이용해서 평문을 해시화 하기", () => {
//             const data = "123123"
//             const result = cryptoModule.SHA256(data)
//             expect(result).toHaveLength(64)
//         })
//     })
//     describe("merkleRoot", () => {
//         it("Genesis block의 data를 이용하여 merkleRoot 값 구하기", () => {
//             const merkleroot = cryptoModule.merkleRoot(GENESIS.data)
//             expect(merkleroot).toHaveLength(64)
//         })
//     })
//     describe("createBlockHash", () => {
//         it("BlockInfo를 이용한 blockHash 값 구하기", () => {
//             const blockInfo: BlockInfo = {
//                 version: GENESIS.version,
//                 height: GENESIS.height,
//                 timestamp: GENESIS.timestamp,
//                 previousHash: GENESIS.previousHash,
//                 merkleRoot: GENESIS.merkleRoot,
//                 nonce: GENESIS.nonce,
//                 difficulty: GENESIS.difficulty,
//             }
//             const hash = cryptoModule.createBlockHash(blockInfo)
//             expect(hash).toHaveLength(64)
//         })
//     })
//     describe("isValidHash", () => {
//         it("hash length가 64 미만인 경우", () => {
//             const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D" // hash값이 틀려야 통과를 함.
//             expect(() => {
//                 cryptoModule.isValidHash(hash)
//             }).toThrowError()
//         })
//         it("hash 값이 64글자이지만 올바르지 않은 형식일경우 (마지막에 G 넣음)", () => {
//             const hash = "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3DG" // hash값이 틀려야 통과를 함.
//             expect(() => {
//                 cryptoModule.isValidHash(hash)
//             }).toThrowError()
//         })
//     })
// })

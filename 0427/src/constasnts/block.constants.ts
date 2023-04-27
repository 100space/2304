import { IBlock } from "core/block/block.interface"
export const VERSION = "1.0.0"
export const GENESIS: IBlock = {
    version: "1.0.0",
    height: 1,
    timestamp: 1231006506,
    nonce: 0, // POW (작업증명)을 할 때 필요한 값이다.
    difficulty: 0, // POW (작업증명)을 할 때 필요한 값이다.
    merkleRoot: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8", //transaction이 모인 해시값
    previousHash: "0".repeat(64),
    hash: "84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370", //여러 속성을 가지고 만든 블럭의 해시값이다.
    data: "2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관", //나중에 배열형태의 트랜잭션 데이터가 들어가는 곳이다.
}

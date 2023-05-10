import { DIFFICULTY_ADJUSTMENT_INTERVAL, GENESIS } from "@constasnts/block.constants"
import { IBlock } from "@core/block/block.interface"

class Chain {
    private readonly INTERVAL: number = DIFFICULTY_ADJUSTMENT_INTERVAL
    private readonly chain: IBlock[] = [GENESIS]
    constructor() {}

    // chain에 직접적으로 접근이 못하기 때문에 getter의 기능을 이용해서 가져온다.
    public get() {
        return this.chain
    }

    // 체인의 총 길이를 구하기위해
    public length() {
        return this.chain.length
    }

    //가장 최근에 만들어진 블록을 가져오기
    public latestBlock() {
        return this.chain[this.length() - 1]
    }

    //블록을 추가하기위해서
    public addToChain(receivedBlock: IBlock) {
        this.chain.push(receivedBlock)
        return this.latestBlock() // push 했으면 최신 블록이 받은 블록이기 때문에 확인을 할 수 있게 해준다.
    }

    // 조건에 해당하는 블록을 구할 때 중복된 블록을 찾는 로직을 따로 빼서 관리하기 위한 메서드
    //getBlockbyHash, getBlockbyHeight
    public getBlock(callbackFn: (block: IBlock) => boolean) {
        const findBlock = this.chain.find(callbackFn)
        if (!findBlock) throw new Error("블록이 없음")
        return findBlock
    }

    //블록해시에 해당하는 블록
    public getBlockbyHash(hash: string): IBlock {
        // find() 배열안에 요소만 바로 보여준다.
        return this.getBlock((block: IBlock) => block.hash === hash)
    }
    //블록높이에 해당하는 블록
    public getBlockbyHeight(height: number): IBlock {
        // find() 배열안에 요소만 바로 보여준다.
        return this.getBlock((block: IBlock) => block.height === height)
    }

    //10번째 블록에 대한 정보를 얻기위한 메서드
    // 10이하일 때, genesis블록
    public getAdjustmentBlock() {
        //최신 블록의 높이를 알아야한다.
        const { height } = this.latestBlock()
        const findHeight = height < this.INTERVAL ? 1 : Math.floor(height / this.INTERVAL) * this.INTERVAL
        return this.getBlockbyHeight(findHeight)
    }

    //네트워크 구현을 위해서 네트워크에 객체형태로 직접 보낼 수 없기 때문에
    //메서드를 이용해서 chain을 string으로, string으로 얻은 체인의 내용을 다시 객체화 할 때 사용하는 메서드이다.
    public serialize() {
        return JSON.stringify(this.chain)
    }
    public deserialize(chunk: string) {
        return JSON.parse(chunk)
    }
    //블록의 검증을 위한... 블록의 높이가 안맞는다면 배열에 추가할 수 없도록 검증하는 과정이 있어야한다.
    public isValidChain(newBlock: IBlock, previousBlock: IBlock): boolean {
        if (previousBlock.height + 1 !== newBlock.height) return false
        if (previousBlock.hash !== newBlock.previousHash) return false
        return true
    }
    public isValidAllChain(chain: IBlock[]) {
        // 제네시스 블록은 검증안해도 된다.
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i]
            const previousBlock = chain[i - 1]
            const isVaildBlock = this.isValidChain(currentBlock, previousBlock)
            if (!isVaildBlock) return false
        }
        return true
    }

    public clearChain() {
        this.chain.splice(1)
    }
}

export default Chain

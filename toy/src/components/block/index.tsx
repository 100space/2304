import { AccountText } from "@components/account"
import { KTime } from "hook/Fn"
import { BlockInfo, BlockNum, Container } from "./styled"
export interface IBlockChain {
    version?: string
    height?: number
    timestamp: number
    previousHash?: string
    nonce?: number
    difficulty?: number
    merkleRoot?: string
    data?: any[]
    hash: string
}
export const Block = (block: IBlockChain[]) => {
    const chain = block.reverse().map((v) => {
        return (
            <Container key={v.height}>
                <BlockNum>{v.height}</BlockNum>
                <BlockInfo>
                    <div>HASH </div>
                    {AccountText(v.hash)}
                    <div>생성시간 </div>
                    <div>{KTime(v.timestamp)}</div>
                </BlockInfo>
            </Container>
        )
    })

    return <>{chain}</>
}

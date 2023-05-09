import { IBlock } from "@core/block/block.interface"

export type MessageType = "latestBlock" | "allBlock" | "receivedChain" | "receivedTransaction"
export type Payload = IBlock | IBlock[]

export interface MessageData {
    type: MessageType
    payload: Payload
}

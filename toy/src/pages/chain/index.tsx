import { Block } from "@components/block"
import { Chain } from "@components/block/styled"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "store"
import requestNode from "utils/requestNode"

export const MainChain = () => {
    const { data: mode } = useSelector((state: RootState) => state.menuState)
    const [blockChain, setBlockChain] = useState([])
    const fullChain = async () => {
        const { data } = await requestNode.get("/view")
        setBlockChain(data)
    }

    useEffect(() => {
        fullChain()
    }, [mode])

    const block = Block(blockChain)

    return <Chain>{block}</Chain>
}

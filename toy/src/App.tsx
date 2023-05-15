import { Footer, Head, Body } from "@common/index"
import { PopUpWrap } from "@components/popup"
import { useEffect } from "react"
import requestServer from "utils/requestServer"

const App = () => {
    const getMyAccount = async () => {
        const { data } = await requestServer.get("/wallet")
        console.log(data)
    }
    useEffect(() => {
        getMyAccount()
    }, [])
    return (
        <PopUpWrap>
            <Head />
            <Body />
            <Footer />
        </PopUpWrap>
    )
}

export default App

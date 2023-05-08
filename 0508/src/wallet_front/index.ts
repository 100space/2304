import WalletClient from "@wallet_front/app"
const app = WalletClient()

app.listen(3000, () => {
    console.log(`wallet Start`)
})

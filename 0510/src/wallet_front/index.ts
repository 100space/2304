import CryptoModule from "@core/crypto/crypto.module"
import DigitalSignature from "@core/wallet/digitalSignature"
import Wallet from "@core/wallet/wallet"
import WalletClient from "@wallet_front/app"
const crypto = new CryptoModule()
const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const app = WalletClient(accounts)

app.listen(3000, () => {
    console.log(`wallet Start`)
})

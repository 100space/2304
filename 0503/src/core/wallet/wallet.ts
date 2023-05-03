import DigitalSignature from "./digitalSignature"
import { Accounts, Receipt } from "./wallet.interface"

class wallet {
    //한명의 사용자가 여러개의 계정을 가질 수 있기 때문에 배열로 관리한다.
    private readonly accounts: Accounts[] = []
    constructor(private readonly digitalSignature: DigitalSignature) {}

    // 사용자에 대한 정보로 계쩡을 만들고 쉽게 관리하기 위해서 만드는 메서드이다.
    public create(): Accounts {
        const privateKey = this.digitalSignature.createPrivateKey()
        const publicKey = this.digitalSignature.createPublicKey(privateKey)
        const account = this.digitalSignature.createAccount(publicKey)
        const accounts: Accounts = {
            account,
            publicKey,
            privateKey,
        }
        this.accounts.push(accounts)

        return accounts
    }

    //wallet을 사용할 때, puplicKey와, account를 가져오고 싶을 때 사용한다.
    // create와 비슷한 코드
    public set(privateKey: string) {
        const publicKey = this.digitalSignature.createPublicKey(privateKey)
        const account = this.digitalSignature.createAccount(publicKey)

        const accounts: Accounts = {
            account,
            publicKey,
            privateKey,
        }
        this.accounts.push(accounts)
        return accounts
    }

    // privateKey는 민감한 정보이니 account 만 보이게 해준다.
    public getAccounts() {
        const accounts = this.accounts.map((v) => v.account)
        return accounts
    }

    //account 내용을 가지고 개인키 구하기
    private getPrivate(account: string): string {
        return this.accounts.filter((v) => v.account === account)[0].account
    }

    //receipt함수를 호출하는 상황에서는 이미 accounts에 정보가 있을 확률이 높다.
    public receipt(received: string, amount: number) {
        const { account, publicKey, privateKey } = this.accounts[0]
        const sender = {
            account,
            publicKey,
        }

        const receipt = this.digitalSignature.sign(privateKey, {
            sender,
            received,
            amount,
        })

        return receipt
    }

    public sign() {}
    public verify() {}
}

export default wallet

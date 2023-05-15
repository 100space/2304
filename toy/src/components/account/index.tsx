import { AccountST } from "./styled"

export const AccountText = (account: string, handleCopy?: (e: React.MouseEvent<HTMLDivElement>) => void) => {
    return handleCopy ? (
        <AccountST title={account} onClick={(e) => handleCopy(e)}>
            {account.length > 20
                ? `${account.slice(0, 10).toUpperCase()}...${account.slice(-10).toUpperCase()}`
                : account}
        </AccountST>
    ) : (
        <AccountST title={account}>
            {account.length > 20
                ? `${account.slice(0, 10).toUpperCase()}...${account.slice(-10).toUpperCase()}`
                : account}
        </AccountST>
    )
}

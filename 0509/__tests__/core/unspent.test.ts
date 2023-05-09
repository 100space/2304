import Unspent from "@core/transaction/unspent"

describe("unspent TEST", () => {
    describe("UTXO Pool", () => {
        let unspent: Unspent
        beforeEach(() => {
            unspent = new Unspent()
        })

        it("UTXO Pool 가져오기", () => {
            const UnspentTxOutPool = unspent.getUnspentTxPool()
            console.log(UnspentTxOutPool)
            expect(typeof UnspentTxOutPool).toBe("object")
        })
    })
})

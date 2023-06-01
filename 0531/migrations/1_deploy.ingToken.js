const IngToken = artifacts.require("ingToken")
const EthSwap = artifacts.require("EthSwap")

module.exports = async (deployer) => {
    await deployer.deploy(IngToken)
    await deployer.deploy(EthSwap, IngToken.address)
}

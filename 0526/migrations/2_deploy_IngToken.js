const IngToken = artifacts.require("IngToken")

module.exports = (deployer) => {
    deployer.deploy(IngToken)
}

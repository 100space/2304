const SimpleStore = artifacts.require("SimpleStore")

module.exports = (deployer) => {
    deployer.deploy(SimpleStore, 15)
}

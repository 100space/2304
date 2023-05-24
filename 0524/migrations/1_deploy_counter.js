//Counter.json 안에 있는 bytecode
const Counter = artifacts.require("Counter")

module.exports = (deployer) => {
    console.log(deployer)
    deployer.deploy(Counter)
}

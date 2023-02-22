const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await network.config.chainId

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected, deploying mocks...")
    }
}

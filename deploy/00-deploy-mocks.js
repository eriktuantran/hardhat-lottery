const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // Premium 0.25 LINK https://docs.chain.link/vrf/v2/subscription/supported-networks
const GAS_PRICE_LINK = 1e9 // LINK per gas unit

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected, deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        })
        log("VRFCoordinatorV2Mock deployed")
        log("-----------------------------")
    }
}

module.exports.tags = ["all", "mock"]

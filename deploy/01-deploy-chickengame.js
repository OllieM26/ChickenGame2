const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer, vault } = await getNamedAccounts()
    const chainId = network.config.chainId

    const betSize = networkConfig[chainId]["betSize"]
    //const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    const edge = 500 // 5%
    const args = [betSize, interval, edge, vault]
    const chickenGame = await deploy("ChickenGame", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        log(chickenGame.address)
        await verify(chickenGame.address, args)
    }

    log("-----------------------------------------")
}

module.exports.tags = ["all", "chickenGame"]
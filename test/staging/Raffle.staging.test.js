const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle staging test", async function () {
          let raffle, raffleEntranceFee, deployer
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              console.log("deployer", deployer)
              raffle = await ethers.getContract("Raffle", deployer)
              console.log("raffle", raffle.address)
              raffleEntranceFee = await raffle.getEntranceFee()
              console.log("raffleEntranceFee", raffleEntranceFee.toString())
          })
          describe("fullfillRandomness", async function () {
              it("works with live chainlink keeper and chailink VRF", async function () {
                  // enter the raffle
                  const startingTimestamp = await raffle.getLatestTimeStamp()
                  console.log("startingTimestamp", startingTimestamp.toString())
                  const accounts = await ethers.getSigners()
                  console.log("getSigners", accounts)
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked EVENT!!!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimestamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer()).to.be.reverted
                              assert.equal(recentWinner, accounts[0].address)
                              assert.equal(raffleState, 0)
                              console.log(
                                  `Winner ending balance  : ${winnerEndingBalance.toString()}`
                              )
                              console.log(
                                  `Winner starting balance: ${winnerStartingBalance
                                      .add(raffleEntranceFee)
                                      .toString()}`
                              )
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimestamp > startingTimestamp)
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      console.log("BEGIN () called")
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      console.log("enter() called")
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log("winnerStartingBalance", winnerStartingBalance.toString())
                  })
              })
          })
      })

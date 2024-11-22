const { ethers, run } = require('hardhat')
async function main() {
  const simpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
  console.log("Deploying the contract...")
  const simpleStorage = await simpleStorageFactory.deploy()

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    
    await simpleStorage.deploymentTransaction().wait(6)
    await verify(simpleStorage.target, [])
  }

  let currentValue = await simpleStorage.retrieve()
  console.log(`Current value is ${currentValue.toString()}`)

  const transactionResponse = await simpleStorage.store("7")
  await transactionResponse.wait(1)

  currentValue = await simpleStorage.retrieve()
  console.log(`Current value is ${currentValue.toString()}`)
}

const verify = async function(contractAddress, args) {
  console.log( `Verifying contract - ${contractAddress}` )
  try{
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch(e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }

}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
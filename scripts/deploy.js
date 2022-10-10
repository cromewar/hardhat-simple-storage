// imports
const { ethers, run, network } = require("hardhat")
// async main
async function main() {
	const SimpleStorageFactory = await ethers.getContractFactory(
		"SimpleStorage"
	)
	// Deploy the contract
	// Hardhat has it's own local network with accounts so neither the RPC provider and the account are needed
	console.log("deploying contract...")
	const simpleStorage = await SimpleStorageFactory.deploy()
	await simpleStorage.deployed()
	console.log(`Deployed contract to ${simpleStorage.address}`)
	// Verify the contract
	// if network is localhost, we don't need to verify
	if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
		// Is preferable to wait some blocks before verifying the contract
		await simpleStorage.deployTransaction.wait(5)
		await verify(simpleStorage.address, [])
	}

	// Interact with the contract
	const currentValue = await simpleStorage.retrieve()
	console.log(`Current Value: ${currentValue}`)

	// update the current value
	const transactionResponse = await simpleStorage.store(7)
	await transactionResponse.wait(1)
	const updatedValue = await simpleStorage.retrieve()
	console.log(`Updated Value: ${updatedValue}`)
}

async function verify(contractAddress, args) {
	console.log("Verifying contract...")
	// we can run any hardhat packages with run
	// sometimes the contract ABI is the exact same as another already verified contract
	// so we use a try catch to ignore the error
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		})
	} catch (e) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("Contract already verified")
		} else {
			console.log(e)
		}
	}
}

// main
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", () => {
	let simpleStorageFactory, simpleStorage
	beforeEach(async () => {
		simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
		simpleStorage = await simpleStorageFactory.deploy()
	})
	it("Should Start with a favorite number of 0", async () => {
		const currentValue = await simpleStorage.retrieve()
		const expectedValue = 0
		// assert or expect
		assert.equal(currentValue, expectedValue)
	})
	it("Should update the favorite number", async () => {
		const expectedValue = 42
		await simpleStorage.store(expectedValue)
		const currentValue = await simpleStorage.retrieve()
		// assert or expect
		assert.equal(currentValue, expectedValue)
	})
})

// test/customNFT.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CustomNFT", function () {
  let CustomNFT;
  let customNFT;
  let owner;
  let treasuryWallet;
  let liquidityWallet;

  beforeEach(async function () {
    let accounts = await ethers.getSigners();
    owner = accounts[0]
    treasuryWallet = accounts[6]
    liquidityWallet = accounts[7]

    CustomNFT = await ethers.getContractFactory("NFT");
    customNFT = await CustomNFT.deploy(treasuryWallet.address, liquidityWallet.address);
    (await customNFT).waitForDeployment;
    ;
  });

  it("Should mint a new NFT and transfer ownership", async function () {
    const tokenURI = "https://example.com/metadata/1";
    await expect(customNFT.mint(tokenURI, { value: ethers.parseEther("1") }))
      .to.emit(customNFT, "Transfer");

    expect(await customNFT.tokenOwners(1)).to.equal(owner.address);
    expect(await customNFT.tokenURIs(1)).to.equal(tokenURI);

    // Transfer the NFT to another address
    await customNFT.connect(owner).transfer(treasuryWallet.address, 1);
    expect(await customNFT.tokenOwners(1)).to.equal(treasuryWallet.address);
  });

  it("Should not allow minting without sending Ether", async function () {
    await expect(customNFT.mint("https://example.com/metadata/1")).to.be.revertedWith("Ether value sent should be greater than 0");
  });

  it("Should not allow transferring a token from an address that does not own it", async function () {
    const tokenURI = "https://example.com/metadata/1";
    await customNFT.mint(tokenURI, { value: ethers.parseEther("1") });
    await expect(customNFT.connect(treasuryWallet).transfer(owner.address, 1)).to.be.revertedWith("You do not own this token");
  });
});

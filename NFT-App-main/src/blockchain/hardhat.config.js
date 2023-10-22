require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require('hardhat-deploy')

module.exports = {
  defaultNetwork: "hardhat",

  networks: {
    localhost: {
      live: false,
      tags: ["local"],
      hardfork: "istanbul",
      blockGasLimit: 67000000,
    },
    hardhat: {
    },
    goerli: {
      accounts: [process.env.PKEY],
      url: process.env.ETH_NODE_URI_GOERLI,
      chainId: 5,
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
    },
    sepolia: {
      accounts: [process.env.PKEY],
      url: process.env.ETH_NODE_URI_SEPOLIA,
      chainId: 11155111,
      saveDeployments: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};
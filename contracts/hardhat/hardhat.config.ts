import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    blockdag_testnet: {
      url: process.env.BLOCKDAG_TESTNET_RPC_URL || "https://testnet-rpc.blockdag.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1234, // Replace with actual BlockDAG testnet chain ID
      gas: 8000000,
      gasPrice: 20000000000, // 20 gwei
    },
    blockdag_mainnet: {
      url: process.env.BLOCKDAG_MAINNET_RPC_URL || "https://rpc.blockdag.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5678, // Replace with actual BlockDAG mainnet chain ID
      gas: 8000000,
      gasPrice: 20000000000, // 20 gwei
    },
    // Additional networks for testing
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      // Add BlockDAG explorer API key when available
      blockdag_testnet: process.env.BLOCKDAG_EXPLORER_API_KEY || "",
      blockdag_mainnet: process.env.BLOCKDAG_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "blockdag_testnet",
        chainId: 1234,
        urls: {
          apiURL: "https://testnet-explorer.blockdag.network/api",
          browserURL: "https://testnet-explorer.blockdag.network"
        }
      },
      {
        network: "blockdag_mainnet",
        chainId: 5678,
        urls: {
          apiURL: "https://explorer.blockdag.network/api",
          browserURL: "https://explorer.blockdag.network"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    excludeContracts: ["contracts/mocks/", "contracts/test/"],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  mocha: {
    timeout: 40000,
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;

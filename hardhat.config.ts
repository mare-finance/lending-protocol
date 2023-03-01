import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
import "@openzeppelin/hardhat-upgrades";
import "solidity-coverage";

import "./tasks";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.10",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        hardhat: {
            chainId: 2222,
            forking: {
                url: "https://evm.kava.io",
                blockNumber: 3799680,
            },
        },
        kava: {
            chainId: 2222,
            url: "https://evm.kava.io",
            accounts: [process.env.DEPLOYER_KAVA!],
            verify: {
                etherscan: {
                    apiUrl: "https://explorer.kava.io",
                    apiKey: "abc",
                },
            },
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};

export default config;

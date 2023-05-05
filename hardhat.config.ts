import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
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
            companionNetworks: {
                mainnet: process.env.FORKING_NETWORK?.toLowerCase()!,
            },
            forking: {
                enabled: true,
                url: process.env[
                    `${process.env.FORKING_NETWORK?.toUpperCase()}_RPC_URL`
                ]!,
            },
            autoImpersonate: true,
            gasPrice: 1000000000,
        },
        kava: {
            chainId: 2222,
            url: process.env.KAVA_RPC_URL,
            accounts: [process.env.KAVA_DEPLOYER!],
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

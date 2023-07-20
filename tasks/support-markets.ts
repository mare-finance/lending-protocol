import { task } from "hardhat/config";

import priceFeedConfig from "../config/price-feeds";
import { filterCTokenDeployments } from "./_utils";

// npx hardhat support-markets --network kava

task(
    "support-markets",
    "Supports missing markets to the comptroller"
).setAction(async (args, hre, runSuper) => {
    const {
        ethers,
        getNamedAccounts,
        deployments: { deploy, getOrNull, all },
    } = hre;

    const { deployer } = await getNamedAccounts();

    const allDeployments = await all();
    const cTokenDeployments = filterCTokenDeployments(allDeployments);

    const ComptrollerProxy = await ethers.getContract("Unitroller");
    const Comptroller = await ethers.getContractAt(
        "Comptroller",
        ComptrollerProxy.address
    );

    const existingCTokens = await Comptroller.getAllMarkets();
    const missingCTokens = cTokenDeployments
        .filter(
            cTokenDeployment =>
                !existingCTokens.includes(cTokenDeployment.address)
        )
        .map(cTokenDeployment => cTokenDeployment.address);

    const txPromises: any[] = [];

    for (const cToken of missingCTokens) {
        const cTokenContract = await ethers.getContractAt(
            "CErc20Immutable",
            cToken
        );
        const symbol = await cTokenContract.symbol();
        const config = priceFeedConfig[symbol];

        console.log("adding market", symbol);

        // support market
        const tx = await Comptroller._supportMarket(cToken);
        txPromises.push(tx.wait());
    }

    await Promise.all(txPromises);
});

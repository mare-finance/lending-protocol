import { task } from "hardhat/config";

import { BigNumber } from "ethers";
import priceFeedConfig from "../config/price-feeds";
import { filterCTokenDeployments } from "./_utils";

// npx hardhat sync-collateral-factors --network kava

task(
    "sync-collateral-factors",
    "Sync collateral factors with config"
).setAction(async (args, hre, runSuper) => {
    const {
        ethers,
        getNamedAccounts,
        deployments: { deploy, getOrNull, all },
    } = hre;

    const { deployer } = await getNamedAccounts();

    const ComptrollerProxy = await ethers.getContract("Unitroller");
    const Comptroller = await ethers.getContractAt(
        "Comptroller",
        ComptrollerProxy.address
    );

    const existingCTokens = await Comptroller.getAllMarkets();

    const txPromises: any[] = [];

    for (const cToken of existingCTokens) {
        const cTokenContract = await ethers.getContractAt("CToken", cToken);
        const symbol = await cTokenContract.symbol();
        const config = priceFeedConfig[symbol];

        /*  DO NOT SET COLLATERAL FACTOR BEFORE MINTING SOME */
        const totalSupply = await cTokenContract.totalSupply();
        console.log(symbol, totalSupply, config);
        if (totalSupply.lte(BigNumber.from(1000))) continue;

        continue;

        // set collateral factor
        const collateralFactor = (await Comptroller.markets(cToken))
            .collateralFactorMantissa;
        const newCollateralFactor = ethers.utils.parseEther(
            config.collateralFactor
        );
        if (!collateralFactor.eq(newCollateralFactor)) {
            const tx3 = await Comptroller._setCollateralFactor(
                cToken,
                newCollateralFactor
            );
            txPromises.push(tx3.wait());

            console.log(
                "set collateral factor",
                symbol,
                newCollateralFactor.toString()
            );
        }
    }

    await Promise.all(txPromises);
});

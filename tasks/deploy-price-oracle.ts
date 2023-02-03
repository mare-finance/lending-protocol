import { task } from "hardhat/config";

// npx hardhat deploy-price-oracle --network localhost

const priceFeedMapping: { [key: string]: string } = {
    soUSDC: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    soUSDT: "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46",
};
const baseUnitMapping: { [key: string]: string } = {
    soUSDC: "1000000",
    soUSDT: "1000000",
};

task(
    "deploy-price-oracle",
    "Deploys a price oracle from all tokens in deployments"
).setAction(async (args, hre, runSuper) => {
    const {
        ethers,
        getNamedAccounts,
        deployments: { deploy, get, all },
    } = hre;

    const deployment = await get("ChainlinkPriceOracle");

    const { deployer } = await getNamedAccounts();

    const allDeployments = await all();
    const cTokenDeployments = Object.entries(allDeployments)
        .filter(([key, value]) => key.startsWith("CErc20Immutable_"))
        .map(([key, value]) => value);

    const cTickers = cTokenDeployments.map(
        cTokenDeployment => cTokenDeployment.args?.[5]
    );
    const priceFeeds = cTickers.map(cTicker => priceFeedMapping[cTicker]);
    const baseUnits = cTickers.map(cTicker => baseUnitMapping[cTicker]);

    const oracle = await deploy("ChainlinkPriceOracle", {
        from: deployer,
        log: true,
        contract:
            "contracts/PriceOracle/ChainlinkPriceOracle.sol:ChainlinkPriceOracle",
        args: [cTickers, priceFeeds, baseUnits],
    });
});

const cTokenConfigs = require("../config/token-config.json");

module.exports = async({ getNamedAccounts, deployments, ethers, network }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const oracle = await deploy("ChainlinkPriceOracle", {
        from: deployer,
        log: true,
        contract: "contracts/PriceOracle/ChainlinkPriceOracle.sol:ChainlinkPriceOracle",
        args: [
            cTokenConfigs.map(x => `so${x.symbol}`),
            cTokenConfigs.map(x => x.priceFeed),
            cTokenConfigs.map(x => x.baseUnit),
        ],
    });
};

module.exports.tags = ["price-oracle"];
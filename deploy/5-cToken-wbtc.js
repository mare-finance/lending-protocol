const tokenConfigs = require('../config/token-config.json');

const token = 'WBTC';
const admin = '0x37fF10390F22fABDc2137E428A6E6965960D60b6';

module.exports = async({ getNamedAccounts, deployments, ethers, network }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const tokenConfig = tokenConfigs.find(x => x.symbol == token);

    const contractKey = `CErc20Immutable_${tokenConfig.symbol}`;
    const soName = `Sonne ${tokenConfig.name}`;
    const soSymbol = `so${tokenConfig.symbol}`;

    let cToken;

    const comptroller = await get(tokenConfig.comptroller);
    const interestRateModel = await get(tokenConfig.interestRateModel);

    try {
        cToken = await get(contractKey);
    } catch {
        cToken = await deploy(contractKey, {
            from: deployer,
            log: true,
            contract: 'contracts/CErc20Immutable.sol:CErc20Immutable',
            args: [
                tokenConfig.underlying,
                comptroller.address,
                interestRateModel.address,
                tokenConfig.initialExchangeRateMantissa,
                soName,
                soSymbol,
                tokenConfig.decimals,
                admin,
            ],
        });
    }
};

module.exports.tags = ['cToken-wbtc'];
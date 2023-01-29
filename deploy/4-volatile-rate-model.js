const { getCTokenConfig } = require("../config/config.js");

module.exports = async({ getNamedAccounts, deployments, ethers, network }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const stableRateModel = await deploy("StableRateModel", {
        from: deployer,
        log: true,
        contract: "contracts/JumpRateModelV4.sol:JumpRateModelV4",
        args: [
            365 * 24 * 60 * 60, // seconds per year
            ethers.utils.parseEther("0"), // base rate per year
            ethers.utils.parseEther("0.05"), // multiplier per year
            ethers.utils.parseEther("1.365"), // jump multiplier per year
            ethers.utils.parseEther("0.8"), // kink
            deployer,
            "JumpRateModelV4",
        ],
    });

    const mediumRateModel = await deploy("MediumRateModel", {
        from: deployer,
        log: true,
        contract: "contracts/JumpRateModelV4.sol:JumpRateModelV4",
        args: [
            365 * 24 * 60 * 60, // seconds per year
            ethers.utils.parseEther("0.02"), // base rate per year
            ethers.utils.parseEther("0.225"), // multiplier per year
            ethers.utils.parseEther("1.25"), // jump multiplier per year
            ethers.utils.parseEther("0.8"), // kink
            deployer,
            "JumpRateModelV4",
        ],
    });

    const volatileRateModel = await deploy("VolatileRateModel", {
        from: deployer,
        log: true,
        contract: "contracts/JumpRateModelV4.sol:JumpRateModelV4",
        args: [
            365 * 24 * 60 * 60, // seconds per year
            ethers.utils.parseEther("0.025"), // base rate per year
            ethers.utils.parseEther("0.225"), // multiplier per year
            ethers.utils.parseEther("5"), // jump multiplier per year
            ethers.utils.parseEther("0.8"), // kink
            deployer,
            "JumpRateModelV4",
        ],
    });
};

module.exports.tags = ["rate-models"];
module.exports = async({ getNamedAccounts, deployments, ethers, network }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('BasicLens', {
        from: deployer,
        args: [],
        log: true,
    });
};

module.exports.tags = ['comp-lens'];
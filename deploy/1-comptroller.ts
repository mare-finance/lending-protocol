import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
    getNamedAccounts,
    deployments: { deploy },
    ethers,
    network,
}: HardhatRuntimeEnvironment) => {
    const { deployer } = await getNamedAccounts();

    const comptrollerImplDeploy = await deploy("ComptrollerImpl", {
        from: deployer,
        log: true,
        contract: "contracts/Comptroller.sol:Comptroller",
        args: [],
    });
    const comptrollerImpl = await ethers.getContractAt(
        "Comptroller",
        comptrollerImplDeploy.address
    );

    const unitrollerDeploy = await deploy("ComptrollerV1", {
        from: deployer,
        log: true,
        contract: "contracts/Unitroller.sol:Unitroller",
        args: [],
    });
    const unitroller = await ethers.getContractAt(
        "Unitroller",
        unitrollerDeploy.address
    );

    if (
        (await unitroller.comptrollerImplementation()) !=
        comptrollerImpl.address
    ) {
        if (
            (await unitroller.pendingComptrollerImplementation()) !=
            comptrollerImpl.address
        ) {
            await (
                await unitroller._setPendingImplementation(
                    comptrollerImpl.address
                )
            ).wait(1);
        }
        await (await comptrollerImpl._become(unitroller.address)).wait(1);
    }
};

const tags = ["comptroller"];
export { tags };

export default func;

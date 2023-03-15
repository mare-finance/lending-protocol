import { task, types } from "hardhat/config";

/**
 * npx hardhat deploy-ctoken \
 * --network hardhat \
 * --underlying-address 0xfA9343C3897324496A05fC75abeD6bAC29f8A40f \
 * --underlying-decimals 6 \
 * --underlying-name "USD Coin" \
 * --underlying-symbol "USDC" \
 * --decimals 8 \
 * --comptroller-key "ComptrollerV1" \
 * --interest-rate-model-key "StableRateModel" \
 * --owner 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
 */

task("deploy-ctoken", "Deploys a new ctoken")
    .addParam("underlyingAddress", "Underlying asset's address")
    .addParam(
        "underlyingDecimals",
        "Underlying asset's decimals",
        18,
        types.int
    )
    .addParam("underlyingName", "Underlying asset's name")
    .addParam("underlyingSymbol", "Underlying asset's symbol")
    .addParam("decimals", "Decimals of the cToken", 8, types.int)
    .addParam("comptrollerKey", "Key of the comptroller")
    .addParam("interestRateModelKey", "Key of the interest rate model")
    .addParam("owner", "Owner of the cToken")
    .setAction(async (args, hre, runSuper) => {
        const {
            underlyingAddress,
            underlyingDecimals,
            underlyingName,
            underlyingSymbol,
            decimals,
            comptrollerKey,
            interestRateModelKey,
            owner,
        } = args;
        const {
            ethers,
            getNamedAccounts,
            deployments: { deploy, get },
        } = hre;

        const { deployer } = await getNamedAccounts();

        const contractKey = `CErc20Immutable_${underlyingSymbol}`;
        const soName = `Mare ${underlyingName}`;
        const soSymbol = `ma${underlyingSymbol}`;

        let cToken;

        const comptrollerDeploy = await get(comptrollerKey);
        const interestRateModelDeploy = await get(interestRateModelKey);
        // exchange rate should be 2 for mare
        const initialExchangeRateMantissa = ethers.utils.parseUnits(
            "2",
            underlyingDecimals + 18 - decimals
        );
        console.log(initialExchangeRateMantissa.toString());

        try {
            cToken = await get(contractKey);
        } catch {
            cToken = await deploy(contractKey, {
                from: deployer,
                log: true,
                contract: "contracts/CErc20Immutable.sol:CErc20Immutable",
                args: [
                    underlyingAddress,
                    comptrollerDeploy.address,
                    interestRateModelDeploy.address,
                    initialExchangeRateMantissa,
                    soName,
                    soSymbol,
                    decimals,
                    owner,
                ],
            });
        }
    });

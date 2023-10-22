/**
 * This script deploys the BrightID Sponsor contract
 * 
 */
// npx hardhat deploy --tags Sponsor --network goerli
const func = async function (hre) {
    const { deployments, getNamedAccounts } = hre;

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    console.log('Deploying NFT Contract..')
    console.log('Deployer Address: ', deployer)

    await deploy("NFT", {
        from: deployer, log: true, skipIfAlreadyDeployed: true,
        args: ["0xA16067525cBdb9a233fFA953887cc7c769f878C7", "0x6e5F841dA2727536BdD8118FeAb6334da5C1C4c9"],
    });
};
module.exports = func;
func.tags = ["NFT"];
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Leo Finance contracts...");

  // Deploy LeoCore
  const LeoCore = await ethers.getContractFactory("LeoCore");
  const leoCore = await LeoCore.deploy();
  await leoCore.waitForDeployment();
  const leoCoreAddress = await leoCore.getAddress();

  console.log(`LeoCore deployed to: ${leoCoreAddress}`);

  // Get deployment info
  const [deployer] = await ethers.getSigners();
  console.log(`Deployed by: ${deployer.address}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);

  // Verify initial state
  const totalCircles = await leoCore.getTotalCircles();
  const protocolFee = await leoCore.protocolFeeBps();
  const minContribution = await leoCore.minContribution();

  console.log("\nInitial State:");
  console.log(`Total Circles: ${totalCircles}`);
  console.log(`Protocol Fee: ${protocolFee} bps (${Number(protocolFee) / 100}%)`);
  console.log(`Min Contribution: ${ethers.formatEther(minContribution)} ETH`);

  return {
    leoCore: leoCoreAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

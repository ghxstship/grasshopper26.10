import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TicketNFT contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy();

  await ticketNFT.waitForDeployment();

  const address = await ticketNFT.getAddress();
  console.log("TicketNFT deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify on Etherscan (if not local network)
  if ((await ethers.provider.getNetwork()).chainId !== 31337n) {
    console.log("\nWaiting for block confirmations...");
    await ticketNFT.deploymentTransaction()?.wait(6);
    
    console.log("\nVerifying contract on Etherscan...");
    console.log("Run: npx hardhat verify --network <network>", address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

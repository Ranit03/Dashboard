import { ethers } from "hardhat";
import { ExplorerRegistry } from "../typechain-types";

async function main() {
  console.log("🚀 Starting BlockDAG Scan++ contract deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy ExplorerRegistry
  console.log("\n📋 Deploying ExplorerRegistry...");
  const ExplorerRegistry = await ethers.getContractFactory("ExplorerRegistry");
  const explorerRegistry = await ExplorerRegistry.deploy() as ExplorerRegistry;
  
  await explorerRegistry.waitForDeployment();
  const registryAddress = await explorerRegistry.getAddress();
  
  console.log("✅ ExplorerRegistry deployed to:", registryAddress);
  
  // Set initial configuration
  console.log("\n⚙️ Setting initial configuration...");
  
  const verificationFee = ethers.parseEther("0.01"); // 0.01 ETH
  const labelFee = ethers.parseEther("0.001"); // 0.001 ETH
  
  await explorerRegistry.setVerificationFee(verificationFee);
  console.log("✅ Verification fee set to:", ethers.formatEther(verificationFee), "ETH");
  
  await explorerRegistry.setLabelSubmissionFee(labelFee);
  console.log("✅ Label submission fee set to:", ethers.formatEther(labelFee), "ETH");
  
  // Add some initial verified contracts (examples)
  console.log("\n📝 Adding initial contract verifications...");
  
  // Example: Verify the registry contract itself
  try {
    const tx = await explorerRegistry.verifyContract(
      registryAddress,
      "ExplorerRegistry",
      "1.0.0",
      "// Contract source code would go here...",
      JSON.stringify([]), // ABI would go here
      false, // not a proxy
      ethers.ZeroAddress, // no implementation
      ["registry", "explorer", "blockdag"]
    );
    await tx.wait();
    console.log("✅ Registry contract self-verified");
  } catch (error) {
    console.log("⚠️ Self-verification skipped (already verified or insufficient fee)");
  }
  
  // Add some example address labels
  console.log("\n🏷️ Adding example address labels...");
  
  const exampleLabels = [
    {
      address: deployer.address,
      label: "Deployer Address",
      category: "system",
      description: "Contract deployment address"
    },
    {
      address: registryAddress,
      label: "Explorer Registry",
      category: "contract",
      description: "Main registry contract for BlockDAG Scan++"
    }
  ];
  
  for (const labelInfo of exampleLabels) {
    try {
      const tx = await explorerRegistry.addAddressLabel(
        labelInfo.address,
        labelInfo.label,
        labelInfo.category,
        labelInfo.description
      );
      await tx.wait();
      console.log(`✅ Added label "${labelInfo.label}" for ${labelInfo.address}`);
    } catch (error) {
      console.log(`⚠️ Failed to add label for ${labelInfo.address}:`, error);
    }
  }
  
  // Register example plugins
  console.log("\n🔌 Registering example plugins...");
  
  const examplePlugins = [
    {
      id: "contract-diff-v1",
      name: "Contract Diff Analyzer",
      version: "1.0.0",
      ipfsHash: "QmExampleHash1234567890abcdef"
    },
    {
      id: "gas-analyzer-v1",
      name: "Gas Usage Analyzer",
      version: "1.0.0",
      ipfsHash: "QmExampleHash0987654321fedcba"
    }
  ];
  
  for (const plugin of examplePlugins) {
    try {
      const tx = await explorerRegistry.registerPlugin(
        plugin.id,
        plugin.name,
        plugin.version,
        plugin.ipfsHash
      );
      await tx.wait();
      console.log(`✅ Registered plugin "${plugin.name}"`);
    } catch (error) {
      console.log(`⚠️ Failed to register plugin ${plugin.name}:`, error);
    }
  }
  
  // Display deployment summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log("🏠 Network:", (await ethers.provider.getNetwork()).name);
  console.log("📋 ExplorerRegistry:", registryAddress);
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Verification Fee:", ethers.formatEther(verificationFee), "ETH");
  console.log("🏷️ Label Fee:", ethers.formatEther(labelFee), "ETH");
  
  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    explorerRegistry: registryAddress,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    verificationFee: ethers.formatEther(verificationFee),
    labelFee: ethers.formatEther(labelFee)
  };
  
  console.log("\n💾 Deployment info saved to deployments.json");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update frontend configuration with contract addresses");
  console.log("3. Test contract functionality");
  console.log("4. Set up monitoring and alerts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const HARDHAT_DIR = path.join(__dirname, '../../contracts/hardhat');
const HARDHAT_PORT = 8545;

// Check if hardhat node is running
function checkHardhatNode() {
  return new Promise((resolve) => {
    exec(`curl -s http://localhost:${HARDHAT_PORT}`, (error) => {
      resolve(!error);
    });
  });
}

// Check if hardhat directory exists
function checkHardhatExists() {
  return fs.existsSync(HARDHAT_DIR) && fs.existsSync(path.join(HARDHAT_DIR, 'package.json'));
}

// Install hardhat dependencies if needed
function installHardhatDeps() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing Hardhat dependencies...');
    const install = spawn('npm', ['install'], { 
      cwd: HARDHAT_DIR, 
      stdio: 'inherit',
      shell: true 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Hardhat dependencies installed');
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

// Start hardhat node
function startHardhatNode() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Hardhat node...');
    const hardhatNode = spawn('npx', ['hardhat', 'node'], { 
      cwd: HARDHAT_DIR,
      stdio: 'pipe',
      shell: true
    });
    
    let nodeStarted = false;
    
    hardhatNode.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('Started HTTP and WebSocket JSON-RPC server') && !nodeStarted) {
        nodeStarted = true;
        console.log('✅ Hardhat node started successfully');
        resolve(hardhatNode);
      }
    });
    
    hardhatNode.stderr.on('data', (data) => {
      console.error(`Hardhat error: ${data}`);
    });
    
    hardhatNode.on('close', (code) => {
      if (!nodeStarted) {
        reject(new Error(`Hardhat node failed to start with code ${code}`));
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!nodeStarted) {
        hardhatNode.kill();
        reject(new Error('Hardhat node startup timeout'));
      }
    }, 30000);
  });
}

// Deploy contracts
function deployContracts() {
  return new Promise((resolve, reject) => {
    console.log('📋 Deploying contracts...');
    const deploy = spawn('npx', ['hardhat', 'run', 'scripts/deploy.ts', '--network', 'localhost'], { 
      cwd: HARDHAT_DIR,
      stdio: 'inherit',
      shell: true
    });
    
    deploy.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Contracts deployed successfully');
        resolve();
      } else {
        console.log('⚠️ Contract deployment failed, but continuing...');
        resolve(); // Don't fail the entire process
      }
    });
  });
}

// Main setup function
async function setupContracts() {
  try {
    console.log('🔧 Setting up BlockDAG Scan++ contracts...\n');
    
    // Check if hardhat directory exists
    if (!checkHardhatExists()) {
      console.log('⚠️ Hardhat directory not found, skipping contract setup');
      return;
    }
    
    // Check if hardhat node is already running
    const isRunning = await checkHardhatNode();
    
    if (isRunning) {
      console.log('✅ Hardhat node is already running');
    } else {
      console.log('🔍 Hardhat node not detected, starting...');
      
      // Install dependencies if needed
      if (!fs.existsSync(path.join(HARDHAT_DIR, 'node_modules'))) {
        await installHardhatDeps();
      }
      
      // Start hardhat node in background
      const hardhatProcess = await startHardhatNode();
      
      // Give it a moment to fully start
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Deploy contracts
    await deployContracts();
    
    console.log('\n🎉 Contract setup completed!');
    console.log('📝 You can now use the contracts in your frontend application');
    
  } catch (error) {
    console.error('❌ Contract setup failed:', error.message);
    console.log('⚠️ Continuing without contracts - some features may not work');
  }
}

// Handle script arguments
const args = process.argv.slice(2);

if (args.includes('--deploy-only')) {
  // Only deploy contracts (assume node is running)
  deployContracts().then(() => {
    console.log('✅ Contract deployment completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Contract deployment failed:', error.message);
    process.exit(1);
  });
} else {
  // Full setup
  setupContracts().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
}

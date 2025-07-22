#!/bin/bash

# BlockDAG Scan++ Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up BlockDAG Scan++ Development Environment"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    print_status "Node.js $(node --version) is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_status "npm $(npm --version) is installed"
    
    # Check if Foundry is installed (optional)
    if command -v forge &> /dev/null; then
        print_status "Foundry is installed"
    else
        print_warning "Foundry is not installed. Install from https://getfoundry.sh/ for Foundry development"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_status "Git is installed"
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_info "Installing frontend dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
        print_status "Created .env.local from example"
        print_warning "Please update .env.local with your configuration"
    else
        print_info ".env.local already exists"
    fi
    
    cd ..
    print_status "Frontend setup completed"
}

# Setup Hardhat contracts
setup_hardhat() {
    print_info "Setting up Hardhat contracts..."
    
    cd contracts/hardhat
    
    # Install dependencies
    print_info "Installing Hardhat dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created .env from example"
        print_warning "Please update contracts/hardhat/.env with your configuration"
    else
        print_info ".env already exists"
    fi
    
    # Compile contracts
    print_info "Compiling contracts..."
    npx hardhat compile
    
    cd ../..
    print_status "Hardhat setup completed"
}

# Setup Foundry contracts
setup_foundry() {
    if command -v forge &> /dev/null; then
        print_info "Setting up Foundry contracts..."
        
        cd contracts/foundry
        
        # Copy environment file
        if [ ! -f .env ]; then
            cp .env.example .env
            print_status "Created .env from example"
            print_warning "Please update contracts/foundry/.env with your configuration"
        else
            print_info ".env already exists"
        fi
        
        # Install dependencies
        print_info "Installing Foundry dependencies..."
        forge install OpenZeppelin/openzeppelin-contracts --no-commit
        forge install foundry-rs/forge-std --no-commit
        
        # Build contracts
        print_info "Building contracts..."
        forge build
        
        cd ../..
        print_status "Foundry setup completed"
    else
        print_warning "Skipping Foundry setup (not installed)"
    fi
}

# Initialize Git repository
setup_git() {
    if [ ! -d .git ]; then
        print_info "Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: BlockDAG Scan++ project setup"
        print_status "Git repository initialized"
    else
        print_info "Git repository already exists"
    fi
}

# Create additional directories
create_directories() {
    print_info "Creating additional directories..."
    
    mkdir -p docs
    mkdir -p scripts
    mkdir -p tests
    mkdir -p deployments
    
    print_status "Additional directories created"
}

# Generate documentation
generate_docs() {
    print_info "Generating documentation..."
    
    cat > docs/DEVELOPMENT.md << 'EOF'
# Development Guide

## Getting Started

1. **Install Dependencies**
   ```bash
   ./setup.sh
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start Local Blockchain (Hardhat)**
   ```bash
   cd contracts/hardhat
   npx hardhat node
   ```

4. **Deploy Contracts Locally**
   ```bash
   cd contracts/hardhat
   npx hardhat run scripts/deploy.ts --network localhost
   ```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Hardhat
- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run contract tests
- `npx hardhat node` - Start local blockchain
- `npx hardhat run scripts/deploy.ts` - Deploy contracts

### Foundry
- `forge build` - Build contracts
- `forge test` - Run tests
- `forge script` - Run deployment scripts

## Environment Variables

Make sure to configure your environment variables in:
- `frontend/.env.local`
- `contracts/hardhat/.env`
- `contracts/foundry/.env`

## Testing

Run all tests:
```bash
# Frontend tests
cd frontend && npm test

# Hardhat tests
cd contracts/hardhat && npx hardhat test

# Foundry tests
cd contracts/foundry && forge test
```
EOF

    print_status "Documentation generated"
}

# Main setup function
main() {
    echo
    print_info "Starting BlockDAG Scan++ setup..."
    echo
    
    check_requirements
    echo
    
    create_directories
    echo
    
    setup_frontend
    echo
    
    setup_hardhat
    echo
    
    setup_foundry
    echo
    
    setup_git
    echo
    
    generate_docs
    echo
    
    print_status "🎉 Setup completed successfully!"
    echo
    print_info "Next steps:"
    echo "1. Update environment variables in .env files"
    echo "2. Start the development server: cd frontend && npm run dev"
    echo "3. Deploy contracts: cd contracts/hardhat && npx hardhat run scripts/deploy.ts --network localhost"
    echo "4. Visit http://localhost:3000 to see your application"
    echo
    print_info "For more information, see docs/DEVELOPMENT.md"
}

# Run main function
main "$@"

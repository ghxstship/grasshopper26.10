#!/bin/bash

# Deploy smart contracts to Sepolia testnet
# Usage: ./scripts/deploy-testnet.sh

set -e

echo "🚀 Deploying TicketNFT to Sepolia testnet..."

# Check environment variables
if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ Error: PRIVATE_KEY not set"
  exit 1
fi

if [ -z "$SEPOLIA_RPC_URL" ]; then
  echo "❌ Error: SEPOLIA_RPC_URL not set"
  exit 1
fi

# Compile contracts
echo "📦 Compiling contracts..."
npx hardhat compile

# Run tests
echo "🧪 Running contract tests..."
npx hardhat test

# Deploy to Sepolia
echo "🌐 Deploying to Sepolia testnet..."
npx hardhat run scripts/deploy-nft.ts --network sepolia

# Save deployment info
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "💾 Saving deployment info to deployments/sepolia_${TIMESTAMP}.json"

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Verify contract on Etherscan"
echo "2. Update NFT_CONTRACT_ADDRESS in .env"
echo "3. Test minting on testnet"

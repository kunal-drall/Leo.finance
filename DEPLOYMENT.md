# Phase 3: Integration & Deployment

## Contract Deployment Instructions

### Prerequisites

1. **Get Sepolia ETH:**
   - Visit Sepolia Faucet: https://sepoliafaucet.com/
   - Or use Alchemy Faucet: https://sepoliafaucet.com/
   - You'll need ~0.1 ETH for deployment

2. **Get RPC URL:**
   - Sign up at Alchemy: https://www.alchemy.com/
   - Create a new app on Sepolia network
   - Copy the HTTPS URL

3. **Get Etherscan API Key:**
   - Visit: https://etherscan.io/myapikey
   - Create a free account
   - Generate an API key for contract verification

### Environment Setup

Create `contracts/.env` file:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ NEVER commit your private key!**

### Deployment Steps

```bash
cd contracts

# Install dependencies (if not already done)
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan (after deployment)
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Expected Output

```
Deploying Leo Finance contracts...
LeoCore deployed to: 0x1234...5678
Deployed by: 0xabcd...ef01
Network: sepolia

Initial State:
Total Circles: 0
Protocol Fee: 100 bps (1%)
Min Contribution: 0.01 ETH
```

### Post-Deployment

1. **Update Frontend:**
   - Copy deployed LeoCore address
   - Update `frontend/lib/contracts/leoCore.ts`
   - Replace the address in `LEO_CORE_ADDRESS.sepolia`

2. **Verify Contract:**
   - Run verification command
   - Contract will be visible on Sepolia Etherscan
   - Users can view source code and interact

3. **Test Contract:**
   - Try calling read functions
   - Test circle creation
   - Verify events are emitted

## Manual Deployment (Alternative)

If you don't have testnet ETH or want to test locally first:

### Deploy to Local Hardhat Network

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost
```

This gives you:
- 20 test accounts with 10000 ETH each
- Local blockchain for testing
- Fast transactions (instant)
- No need for faucets or API keys

### Using Deployed Address

Once deployed (locally or on Sepolia), update:

**Frontend: `frontend/lib/contracts/leoCore.ts`**
```typescript
export const LEO_CORE_ADDRESS = {
  sepolia: "0xYourDeployedAddress",
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
} as const;
```

## Next Steps After Deployment

1. ✅ Deploy LeoCore
2. ⬜ Update frontend with address
3. ⬜ Test contract read functions
4. ⬜ Implement contract write functions
5. ⬜ Add transaction notifications
6. ⬜ Deploy test circles
7. ⬜ Test end-to-end flows

## Troubleshooting

### "Insufficient funds"
- Get more Sepolia ETH from faucet
- Or use localhost network for testing

### "Invalid API Key"
- Check your RPC URL is correct
- Verify Alchemy project is on Sepolia network

### "Contract verification failed"
- Make sure constructor arguments match deployment
- Check compiler version matches (0.8.24)
- Verify Etherscan API key is valid

## Resources

- Sepolia Faucet: https://sepoliafaucet.com/
- Alchemy Dashboard: https://dashboard.alchemy.com/
- Etherscan Sepolia: https://sepolia.etherscan.io/
- Hardhat Docs: https://hardhat.org/docs

# Manual Deployment Guide

## 🚀 Deploy Contracts to Base Sepolia

Your deployment environment is **already configured**! The credentials are stored in `contracts/.env`.

### Quick Start (5 minutes)

```bash
# Navigate to contracts directory
cd contracts

# Compile contracts (if not already compiled)
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# The output will show:
# Deploying Leo Finance contracts...
# LeoCore deployed to: 0x... <-- COPY THIS ADDRESS
```

### What Happens During Deployment

1. **LeoCore Contract** deploys to Base Sepolia
2. Initial settings are configured:
   - Protocol Fee: 1% (100 basis points)
   - Min Contribution: 0.01 ETH
   - Max Members Per Circle: 50
3. You'll see the deployed contract address
4. Transaction will be confirmed on Base Sepolia

### After Deployment

**1. Copy the Contract Address**
```
LeoCore deployed to: 0xABCDEF1234567890... <-- Copy this
```

**2. Update Frontend**

Edit `frontend/lib/contracts/leoCore.ts`:
```typescript
export const LEO_CORE_ADDRESS = {
  baseSepolia: "0xYOUR_DEPLOYED_ADDRESS_HERE", // Paste here
  // ... other networks
} as const;
```

**3. Verify on BaseScan (Optional but Recommended)**

```bash
# Verify contract on BaseScan
npx hardhat verify --network baseSepolia YOUR_DEPLOYED_ADDRESS

# This makes your contract visible on:
# https://sepolia.basescan.org/address/YOUR_ADDRESS
```

**4. Test the Deployment**

```bash
# Start frontend
cd frontend
npm run dev

# Visit http://localhost:3000
# Connect wallet to Base Sepolia
# Try creating a circle
```

---

## 📋 Deployment Checklist

- [x] Deployment credentials configured (`contracts/.env`)
- [x] Private key funded with Base Sepolia ETH
- [x] Contracts compiled
- [ ] **Deploy to Base Sepolia** ← YOU ARE HERE
- [ ] Copy deployed address
- [ ] Update `frontend/lib/contracts/leoCore.ts`
- [ ] Verify on BaseScan
- [ ] Test contract interactions
- [ ] Create test circles
- [ ] Share with users!

---

## 🔧 Deployment Configuration

Your `contracts/.env` file contains:

```env
PRIVATE_KEY=960ef6cc251ddc32f935076f3fc53be19a2f43de91680c0662fb135d484f5676
BASESCAN_API_KEY=4WGMG8IPNJ9162GEZ48GDFN9P18E9TT9GC
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

**Network Details:**
- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org/
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

---

## 📊 Expected Gas Costs

**LeoCore Deployment:**
- Gas Used: ~1,500,000 gas
- Gas Price: ~0.01 gwei (Base Sepolia)
- **Total Cost**: ~0.015 ETH (very cheap on Base!)

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- **Solution**: Get more Base Sepolia ETH from faucet
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### "Network request failed"
- **Solution**: Check internet connection
- **Alternative**: Use Alchemy RPC instead of public endpoint

### "Contract deployment failed"
- **Check**: Is your private key correct?
- **Check**: Do you have enough Base Sepolia ETH?
- **Check**: Is the network RPC URL working?

### "Verification failed"
- **Wait**: Sometimes takes a few minutes
- **Check**: Is BaseScan API key correct?
- **Retry**: Run verification command again

---

## 🎯 Post-Deployment Testing

### Test 1: Create a Circle (Backend)

```bash
# In Hardhat console
npx hardhat console --network baseSepolia

# Then run:
const LeoCore = await ethers.getContractFactory("LeoCore");
const leoCore = LeoCore.attach("YOUR_DEPLOYED_ADDRESS");
await leoCore.getTotalCircles(); // Should return 0
```

### Test 2: Frontend Integration

1. Update contract address in frontend
2. Start development server
3. Connect wallet (Base Sepolia)
4. Create a test circle
5. Check transaction on BaseScan

### Test 3: Contract Verification

Visit BaseScan:
```
https://sepolia.basescan.org/address/YOUR_ADDRESS#code
```

You should see:
- ✅ Contract verified
- ✅ Read Contract tab
- ✅ Write Contract tab
- ✅ Source code visible

---

## 📱 Share with Users

Once deployed, users can:

1. **Add Base Sepolia to MetaMask**
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency: ETH
   - Block Explorer: https://sepolia.basescan.org

2. **Get Test ETH**
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

3. **Access Leo Finance**
   - URL: http://localhost:3000 (or your deployed URL)
   - Connect wallet
   - Start creating circles!

---

## 🚀 Next Steps After Deployment

1. **Create Test Circles**
   - Create 2-3 test circles
   - Invite friends to join
   - Test contributions

2. **Monitor Activity**
   - Watch transactions on BaseScan
   - Check event logs
   - Monitor gas usage

3. **Deploy Frontend**
   - Deploy to Vercel/Netlify
   - Configure environment variables
   - Share public URL

4. **Community Testing**
   - Invite beta testers
   - Collect feedback
   - Fix bugs
   - Iterate!

---

## 📞 Need Help?

If deployment fails or you encounter issues:

1. Check the error message carefully
2. Review troubleshooting section above
3. Check Hardhat documentation: https://hardhat.org
4. Check Base documentation: https://docs.base.org

---

## ✅ Deployment Command (Copy & Paste)

```bash
cd /home/user/Leo.finance/contracts && npx hardhat run scripts/deploy.ts --network baseSepolia
```

**That's it!** After running this command:
1. Copy the deployed address
2. Update `frontend/lib/contracts/leoCore.ts`
3. Restart frontend dev server
4. Start creating circles! 🎉

---

**Good luck with your deployment!** 🚀

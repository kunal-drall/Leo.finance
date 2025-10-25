# Pyth Oracle & Yellow Network Integration Guide

## Overview

Leo Finance integrates two cutting-edge protocols to enhance user experience:

1. **Pyth Network** - Real-time price feeds using Pull Oracle model
2. **Yellow Network (Nitrolite)** - Session-based gasless transactions

## Pyth Network Integration (Pull Oracle)

### What is Pyth?

Pyth provides real-time, decentralized price feeds for crypto assets. Unlike traditional "push" oracles that continuously update prices on-chain, Pyth uses a **"pull" model** where YOU fetch price updates when needed and submit them on-chain.

### Why Pull Oracle?

- ⚡ **Lower costs**: Only update prices when your app needs them
- 🎯 **Precise timing**: Get prices exactly when you need them
- 🔒 **Cryptographically verified**: Each update includes proofs
- ⏱️ **Ultra-low latency**: Sub-second price updates

### Architecture

```
User Transaction
       ↓
1. Fetch price from Hermes API
       ↓
2. Submit price + proof to Pyth contract
       ↓
3. Pyth contract verifies & stores price
       ↓
4. Your contract reads the price
       ↓
5. Transaction executes with fresh price!
```

### How It Works

#### Step 1: Fetch Price Updates from Hermes

```typescript
import { fetchPriceUpdates, PRICE_FEED_IDS } from "@/lib/pyth";

// Fetch latest price update with cryptographic proof
const priceUpdateData = await fetchPriceUpdates([
  PRICE_FEED_IDS.ETH_USD,
]);

// Result: Array of hex-encoded price update data
// ["0x504e4155..."] <- This includes the price + proof
```

#### Step 2: Submit to On-Chain Pyth Contract

```solidity
// In your smart contract
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract MyContract {
    IPyth pyth;

    function executeWithPrice(
        bytes[] calldata priceUpdateData
    ) public payable {
        // Update the price on-chain
        uint fee = pyth.getUpdateFee(priceUpdateData);
        pyth.updatePriceFeeds{value: fee}(priceUpdateData);

        // Now read the fresh price
        PythStructs.Price memory price = pyth.getPrice(priceId);

        // Use the price in your logic
        require(price.price > threshold, "Price too low");
        // ... rest of your logic
    }
}
```

#### Step 3: Read the Price

```typescript
// Frontend: Display current price
const { price, conf, publishTime } = await getETHPrice();
console.log(`ETH: $${price} ±$${conf}`);
```

### Real-Time Price Streaming

For displaying live prices in your UI:

```typescript
import { subscribeToPriceUpdates, PRICE_FEED_IDS } from "@/lib/pyth";

// Subscribe to real-time updates via Server-Sent Events (SSE)
const unsubscribe = subscribeToPriceUpdates(
  [PRICE_FEED_IDS.ETH_USD],
  (update) => {
    console.log("New ETH price:", update.price);
    // Update your UI
  }
);

// Later: unsubscribe()
```

### Price Feeds Available

| Asset | Price Feed ID |
|-------|---------------|
| BTC/USD | `0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43` |
| ETH/USD | `0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace` |
| PYUSD/USD | Awaiting official feed ID |

Full list: https://pyth.network/developers/price-feed-ids

### Hermes API Endpoints

- **Latest prices**: `GET https://hermes.pyth.network/v2/updates/price/latest`
- **Streaming**: `GET https://hermes.pyth.network/v2/updates/price/stream` (SSE)
- **Docs**: https://docs.pyth.network/price-feeds

### Example: Using Pyth in Leo Finance

```typescript
// When creating a circle with USD-denominated contributions
async function createCircle(contributionUSD: number) {
  // 1. Fetch ETH/USD price update
  const priceUpdate = await fetchPriceUpdates([PRICE_FEED_IDS.ETH_USD]);

  // 2. Submit to contract along with circle creation
  await leoCoreContract.createCircle(
    contributionAmount,
    frequency,
    maxMembers,
    priceUpdate // <- Price update data
  );

  // Contract will:
  // - Update Pyth price on-chain
  // - Convert USD to ETH using fresh price
  // - Create circle with correct ETH amount
}
```

### Costs

- **Hermes API**: Free to fetch price updates
- **On-chain update**: ~$0.01-0.05 per price update (gas cost)
- **Read price**: Free (just a contract call)

### Best Practices

1. ✅ **Batch updates**: Update multiple prices in one transaction
2. ✅ **Check staleness**: Use `getPriceNoOlderThan(60)` for max 60s age
3. ✅ **Handle errors**: Always have fallback for failed price fetches
4. ✅ **Cache when possible**: Display cached prices, update periodically
5. ⚠️ **Don't spam**: Rate limit your Hermes API calls

---

## Yellow Network Integration (Nitrolite Protocol)

### What is Yellow Network?

Yellow Network enables **instant, gas-free transactions** through off-chain state channels that settle on-chain. Think "Web2 speed, Web3 security."

### Why Yellow Network?

- ⚡ **Instant**: Transactions confirm in milliseconds
- 💰 **Gas-free**: No gas fees for off-chain transactions
- 🔒 **Secure**: Final settlement on-chain
- 📊 **Scalable**: Handle thousands of transactions per second

### Architecture: Session-Based Transactions

```
Session Start
     ↓
User deposits funds
     ↓
Set spending allowance (e.g., $1000)
     ↓
[OFF-CHAIN STATE CHANNEL]
  - Transaction 1: Instant! ⚡
  - Transaction 2: Instant! ⚡
  - Transaction 3: Instant! ⚡
  - ... (no gas fees!)
     ↓
Session End
     ↓
ONE on-chain settlement transaction
     ↓
All balances finalized!
```

### How It Works

#### Step 1: Create Session

```typescript
import { createYellowSession } from "@/lib/yellow";

const session = createYellowSession({
  chainId: 84532, // Base Sepolia
  userAddress: userWallet,
  contractAddress: circleAddress,
  allowance: parseUnits("1000", 6), // 1000 PYUSD limit
  duration: 3600, // 1 hour session
});

await session.initialize();
// User signs message to authorize session
// Funds are locked in state channel
```

#### Step 2: Execute Instant Off-Chain Transactions

```typescript
// Contribute to circle - INSTANT & FREE!
await session.executeGasless({
  to: circleAddress,
  data: encodeFunctionData({
    abi: circleABI,
    functionName: "contribute",
  }),
  value: parseUnits("100", 6), // 100 PYUSD
});

// Another contribution - INSTANT & FREE!
await session.executeGasless({
  to: circleAddress,
  data: encodeFunctionData({
    abi: circleABI,
    functionName: "contribute",
  }),
  value: parseUnits("100", 6),
});

// 10 more contributions... all instant and gas-free! ⚡
```

#### Step 3: Settle On-Chain

```typescript
// When session ends, settle all transactions on-chain
const settlementTx = await session.close();

// ONE on-chain transaction settles ALL off-chain transactions!
// If you did 50 transactions, you save 49x gas fees!
```

### Gas Savings Example

**Scenario**: 10 contributions to a savings circle

| Method | Gas Fees | Time |
|--------|----------|------|
| **Traditional** | 10 txs × $5 = **$50** | 10-20 minutes |
| **Yellow Network** | 1 tx × $5 = **$5** | Instant |
| **Savings** | **$45 (90%)** | **10x faster** |

### Session Management

```typescript
// Check session status
const status = await session.getSessionStatus();
console.log({
  spent: status.spent,
  allowance: status.allowance,
  remaining: status.allowance - status.spent,
  txCount: status.transactionCount,
  expiresAt: new Date(status.expiresAt),
});

// Check if session is still active
if (session.isActive()) {
  // Execute more transactions
} else {
  // Session expired, need to create new one
}
```

### Use Cases in Leo Finance

#### 1. Circle Contributions

```typescript
// Traditional: Each contribution is a separate on-chain tx
// Result: $5 gas × 10 contributions = $50 in gas

// With Yellow: All contributions off-chain, one settlement
// Result: $5 gas × 1 settlement = $5 in gas
```

#### 2. Micro-Payments

```typescript
// Enable $0.01 contributions without worrying about gas
await session.executeGasless({
  to: circleAddress,
  value: parseUnits("0.01", 6), // Just 1 cent!
});
// No gas fee! Perfect for micro-savings.
```

#### 3. High-Frequency Circles

```typescript
// Daily contribution circle with 30 members
// Traditional: 30 people × 30 days = 900 on-chain txs = $4,500 gas
// Yellow Network: 1 settlement/day = 30 txs = $150 gas
// Savings: $4,350 (97%)!
```

### Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Pyth Network** | ✅ **Live** | Using Hermes API for price feeds |
| **Yellow Network** | ⚠️ **Mock** | SDK not released yet, framework ready |

### When Yellow SDK Releases

When Yellow Network launches their SDK, integration will be straightforward:

```typescript
// Just swap the mock implementation
import { YellowClient } from '@yellow-network/sdk'; // Real SDK

// Rest of the code stays the same!
const session = createYellowSession(config);
await session.initialize();
await session.executeGasless(params);
```

Our architecture is **ready** - we just need to plug in the real SDK.

---

## Combined Power: Pyth + Yellow

### Ultimate User Experience

```typescript
// Create circle with real-time pricing and gas-free contributions

async function createAndContribute() {
  // 1. Get real-time ETH/USD price from Pyth
  const ethPrice = await getETHPrice();

  // 2. Create Yellow Network session for gas-free contributions
  const session = await createYellowSession({
    userAddress: user,
    contractAddress: circle,
    allowance: parseUnits("1000", 6),
  });

  // 3. Create circle with fresh price
  await createCircleWithPrice(ethPrice);

  // 4. Make 10 instant, gas-free contributions
  for (let i = 0; i < 10; i++) {
    await session.executeGasless({
      to: circle,
      data: encodeContribute(),
    });
  }

  // 5. Settle everything on-chain
  await session.close();

  // Result:
  // - Accurate pricing from Pyth
  // - 10 instant contributions
  // - Only 2 on-chain transactions (create + settle)
  // - 90% gas savings
  // - Amazing UX! ⚡
}
```

---

## Resources

### Pyth Network
- **Docs**: https://docs.pyth.network/price-feeds
- **Price Feed IDs**: https://pyth.network/developers/price-feed-ids
- **Hermes API**: https://hermes.pyth.network
- **SDK**: `@pythnetwork/pyth-evm-js`

### Yellow Network
- **Website**: https://yellow.com
- **Docs**: Coming soon
- **SDK**: Awaiting release
- **ETHGlobal Prize**: https://ethglobal.com/events/bangkok/prizes#yellow-network

### Leo Finance
- **Pyth Integration**: `frontend/lib/pyth.ts`
- **Yellow Integration**: `frontend/lib/yellow.ts`
- **Hooks**: `frontend/hooks/usePythPrice.ts`, `frontend/hooks/useYellowNetwork.ts`

---

## Implementation Checklist

### Pyth Network ✅
- [x] Install SDK (`@pythnetwork/pyth-evm-js`)
- [x] Configure Hermes connection
- [x] Implement `fetchPriceUpdates()`
- [x] Add price streaming support
- [x] Create React hooks
- [x] Document integration

### Yellow Network ⚠️
- [x] Design session-based architecture
- [x] Implement mock session manager
- [x] Create gas savings calculator
- [x] Build React hooks
- [ ] **Wait for SDK release**
- [ ] Replace mock with real SDK
- [ ] Test on testnet

---

## Next Steps

1. **Deploy to Sepolia** - Test Pyth integration on testnet
2. **Monitor Yellow SDK** - Watch for SDK release announcement
3. **Integrate Real SDK** - Swap mock for real Yellow implementation
4. **User Testing** - Get feedback on gas-free experience
5. **Mainnet Launch** - Deploy with full Pyth + Yellow support

**Status**: Pyth is live and ready. Yellow Network framework is ready for SDK integration when released.

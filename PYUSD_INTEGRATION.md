# PYUSD Integration Guide

## Overview

Leo Finance is fully integrated with PayPal USD (PYUSD), a stablecoin pegged to the US Dollar. All contributions and payouts in Leo Finance circles use PYUSD as the payment token.

## What is PYUSD?

PYUSD is an ERC-20 stablecoin issued by Paxos and backed 1:1 with US Dollars. It combines the stability of the dollar with the efficiency of blockchain technology.

**Key Features:**
- 1:1 USD peg
- Fully collateralized and regulated
- 6 decimal precision
- Available on Ethereum mainnet and testnets

## Contract Addresses

### Mainnet
- **Ethereum Mainnet**: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`

### Testnets
- **Ethereum Sepolia**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **Base Sepolia**: Uses Sepolia PYUSD for testing

## How PYUSD Works in Leo Finance

### Circle Creation

When you create a circle, you specify:
1. Contribution amount in PYUSD (e.g., 100 PYUSD)
2. Contribution frequency (weekly, monthly, etc.)
3. Number of members

The contract stores the PYUSD address and enforces all payments in PYUSD.

### Making Contributions

Contributing to a circle requires a **two-step process**:

#### Step 1: Approve PYUSD Spending
Before the circle contract can accept your PYUSD, you must approve it to spend your tokens.

```typescript
// This happens automatically in our UI
// The user sees: "Approve PYUSD" button
// Behind the scenes:
await pyusdContract.approve(circleAddress, contributionAmount);
```

#### Step 2: Contribute
Once approved, you can contribute PYUSD to the circle.

```typescript
// The user sees: "Contribute" button
// Behind the scenes:
await circleContract.contribute();
// The contract calls: pyusd.transferFrom(user, circle, amount)
```

### Receiving Payouts

When it's your turn to receive the payout, the contract automatically transfers PYUSD from the circle pool to your wallet. No manual claiming required!

## Frontend Integration

### Hooks Available

```typescript
// Get PYUSD address for current chain
const pyusdAddress = usePYUSDAddress();

// Get user's PYUSD balance
const { data: balance } = usePYUSDBalance();

// Check if approval is needed
const { needsApproval } = usePYUSDNeedsApproval(spenderAddress, amount);

// Contribute with approval flow
const {
  needsApproval,
  approve,
  contribute,
  isApprovalSuccess,
} = useContribute(circleAddress, contributionAmount);
```

### Components Available

```typescript
// Display user's PYUSD balance
<PYUSDBalance />

// Display balance in a card
<PYUSDBalanceCard />

// Full contribution flow with approval
<ContributionFlow
  circleAddress={circleAddress}
  contributionAmount={amount}
  onSuccess={() => console.log("Contributed!")}
/>
```

## Getting Test PYUSD

### On Sepolia Testnet

1. **Get Sepolia ETH** for gas fees:
   - Use a Sepolia faucet: https://sepoliafaucet.com/

2. **Get Test PYUSD**:
   - Visit the PYUSD faucet (if available)
   - Or use a DEX on Sepolia to swap ETH for PYUSD
   - Contact the Leo Finance team for test PYUSD

### On Production

Users can acquire PYUSD through:
- Coinbase
- Crypto.com
- Venmo
- DEXs on Ethereum (Uniswap, etc.)

## Smart Contract Implementation

### LeoCircle Contract

The circle contract uses OpenZeppelin's IERC20 interface:

```solidity
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LeoCircle {
    IERC20 public paymentToken; // PYUSD token

    constructor(
        address _leoCore,
        address _creator,
        uint256 _contributionAmount,
        uint256 _contributionFrequency,
        uint256 _maxMembers,
        address _paymentToken // PYUSD address
    ) {
        paymentToken = IERC20(_paymentToken);
        // ...
    }

    function contribute() external {
        // Transfer PYUSD from user to contract
        require(
            paymentToken.transferFrom(
                msg.sender,
                address(this),
                contributionAmount
            ),
            "Transfer failed"
        );
        // ...
    }
}
```

## User Flow Example

### Contributing to a Circle

1. **User visits circle page**
   - Sees contribution amount: "100 PYUSD"
   - Sees their balance: "250 PYUSD"

2. **User clicks "Contribute"**
   - System checks if approval needed
   - If yes: Shows "Approve PYUSD" button

3. **User approves PYUSD**
   - MetaMask popup: "Allow circle to spend 100 PYUSD?"
   - User confirms
   - Transaction confirmed on-chain

4. **System automatically triggers contribution**
   - MetaMask popup: "Contribute 100 PYUSD?"
   - User confirms
   - PYUSD transferred to circle
   - Contribution recorded on-chain

5. **Success!**
   - User sees confirmation
   - Balance updated
   - Circle status updated

## Troubleshooting

### "Insufficient PYUSD Balance"
**Problem**: You don't have enough PYUSD to contribute.

**Solution**:
- Buy PYUSD on an exchange
- For testnet: Use a PYUSD faucet

### "Approval Failed"
**Problem**: The PYUSD approval transaction failed.

**Solution**:
- Check you have enough ETH for gas
- Try again with higher gas limit
- Ensure you're on the correct network

### "Transfer Failed"
**Problem**: The contribution transaction failed.

**Solution**:
- Ensure you approved enough PYUSD
- Check your PYUSD balance
- Verify you're interacting with the correct circle

## Security Considerations

### For Users

1. **Always verify contract addresses** before approving tokens
2. **Only approve the amount you need** (not MAX allowance)
3. **Use hardware wallets** for large amounts
4. **Verify transactions** on block explorers

### For Developers

1. **Use OpenZeppelin contracts** for ERC20 interactions
2. **Implement ReentrancyGuard** on all payment functions
3. **Check return values** from transferFrom calls
4. **Test thoroughly** on testnets before mainnet

## Resources

- **PYUSD Documentation**: https://build.pyusd.to
- **PYUSD Contract**: https://github.com/paxosglobal/pyusd-contract
- **OpenZeppelin ERC20**: https://docs.openzeppelin.com/contracts/erc20
- **Leo Finance Docs**: See other docs in this repo

## Support

For questions or issues with PYUSD integration:
1. Check this documentation
2. Review the code in `/frontend/hooks/` and `/frontend/lib/config/`
3. Open an issue on GitHub
4. Contact the Leo Finance team

---

**Note**: PYUSD integration is live on testnet. Mainnet deployment coming soon.

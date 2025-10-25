# Leo Finance - Smart Contracts

Solidity smart contracts for Leo Finance ROSCA (Rotating Savings and Credit Association) platform.

## Contracts

### LeoCore.sol
Main protocol contract that manages:
- Circle creation and registration
- Global parameters (fees, limits)
- User circle tracking
- Access control

### LeoCircle.sol
Individual ROSCA circle implementation:
- Member management
- Contribution tracking
- Automated payout distribution
- Circle lifecycle (Pending → Active → Completed)

## Architecture

```
LeoCore (Factory & Registry)
    │
    ├── Circle 1 (LeoCircle instance)
    ├── Circle 2 (LeoCircle instance)
    └── Circle N (LeoCircle instance)
```

## Features

- **Gasless Contributions**: Yellow Network integration (coming soon)
- **PYUSD Payments**: Stablecoin-based contributions
- **Trust Scoring**: On-chain reputation system (coming soon)
- **Pyth Oracle**: Real-time price feeds (coming soon)

## Development

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Local Network
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### Deploy to Testnet
```bash
npx hardhat run scripts/deploy.ts --network sepolia
# or
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your private key and RPC URLs
3. Never commit `.env` file

## Security

- Uses OpenZeppelin contracts
- ReentrancyGuard on all state-changing functions
- Access control with Ownable pattern
- Will undergo professional audit before mainnet deployment

## Future Enhancements

- [ ] Yellow Network integration for gasless transactions
- [ ] Pyth Oracle for price feeds
- [ ] Trust scoring mechanism
- [ ] Yield generation (LeoYield contract)
- [ ] Emergency pause functionality
- [ ] Dispute resolution
- [ ] Insurance pool

## License

MIT

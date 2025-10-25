# Leo Finance (Leo Protocol)

A decentralized **ROSCA (Rotating Savings & Credit Association)** platform with gasless transactions, built with mobile-first design.

## Overview

Leo Finance enables communities to create and participate in savings circles with:

- **Gasless Contributions** via Yellow Network
- **PYUSD Stablecoin** for payments
- **Pyth Oracle** for real-time price feeds
- **On-Chain Trust Scoring** for reputation
- **Mobile-First Design** for optimal UX across all devices

## Project Structure

```
Leo.finance/
├── frontend/          # Next.js 14 mobile-first web app
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   │   ├── ui/       # Core UI components
│   │   ├── mobile/   # Mobile-specific components
│   │   └── layout/   # Layout components
│   ├── lib/          # Utilities
│   └── config/       # Configuration
│
├── contracts/        # Solidity smart contracts
│   ├── contracts/    # Contract source files
│   ├── scripts/      # Deployment scripts
│   └── test/         # Contract tests
│
└── backend/          # API server (coming soon)
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Mobile-first styling
- **Wagmi + Viem** - Web3 React Hooks
- **RainbowKit** - Wallet connection UI
- **Lucide Icons** - Beautiful icons

### Smart Contracts
- **Solidity 0.8.24** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries

### Planned Integrations
- **Yellow Network** - Gasless transactions
- **Pyth Network** - Price oracles
- **PYUSD** - Stablecoin payments

## Mobile-First Design

Built from the ground up for mobile devices:

### Breakpoints
- `320px - 767px` - Mobile (single column)
- `768px - 1023px` - Tablet (two columns)
- `1024px+` - Desktop (multi-column)

### Mobile UX Features
- Bottom navigation (thumb-friendly)
- Large tap targets (44x44px minimum)
- Swipeable cards
- Touch-optimized interactions
- Safe area support (iOS notch)
- PWA-ready architecture

### Design System
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #F59E0B (Amber)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Web3 wallet (MetaMask, Rainbow, etc.)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_DEFAULT_CHAIN=sepolia
```

Get your WalletConnect Project ID: https://cloud.walletconnect.com/

### Smart Contracts Setup

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

Deploy to local network:
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

## Features

### Phase 1: MVP (Current) ✅
- [x] Mobile-first responsive landing page
- [x] Wallet connection (RainbowKit)
- [x] Design system and UI components
- [x] Core smart contracts (LeoCore, LeoCircle)
- [x] Navigation (header + bottom nav)

### Phase 2: Integration (In Progress)
- [ ] Circle creation flow
- [ ] Join existing circles
- [ ] Dashboard with user circles
- [ ] PYUSD integration
- [ ] Yellow Network SDK integration
- [ ] Pyth Oracle price feeds

### Phase 3: Advanced Features
- [ ] Trust scoring system
- [ ] Automated contributions
- [ ] Push notifications
- [ ] PWA installation
- [ ] Offline support
- [ ] Advanced analytics

## Smart Contract Architecture

### LeoCore.sol
Main protocol contract:
- Circle factory and registry
- Global parameters management
- Fee collection
- Access control

### LeoCircle.sol
Individual ROSCA circle:
- Member management
- Contribution tracking
- Payout distribution
- Circle lifecycle management

States: `Pending → Active → Completed`

## How It Works

### Creating a Circle
1. Connect your wallet
2. Set contribution amount and frequency
3. Define number of members
4. Share circle invitation
5. Start circle when ready

### Joining a Circle
1. Connect your wallet
2. Browse available circles
3. Join circle
4. Make contributions when due
5. Receive payout when it's your turn

### ROSCA Model
- Members contribute fixed amount each period
- One member receives full pot each round
- Payout rotates until everyone has received
- Trust-based participation

## Development

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Contract Commands
```bash
npx hardhat compile       # Compile contracts
npx hardhat test         # Run tests
npx hardhat node         # Start local node
npx hardhat run scripts/deploy.ts  # Deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Contracts use OpenZeppelin standards
- ReentrancyGuard on all state-changing functions
- Access control with Ownable pattern
- Professional audit planned before mainnet

**IMPORTANT**: Never commit private keys or sensitive data

## Roadmap

**Q1 2025**
- Complete MVP frontend
- Deploy testnet contracts
- Yellow Network integration

**Q2 2025**
- Pyth Oracle integration
- Trust scoring system
- Mobile app (React Native)

**Q3 2025**
- Security audit
- Mainnet deployment
- Marketing launch

**Q4 2025**
- Advanced features
- Governance token
- DAO formation

## Resources

- [Hardhat Documentation](https://hardhat.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Yellow Network](https://yellow.org)
- [Pyth Network](https://pyth.network)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- GitHub Issues: Report bugs and request features
- Discord: [Coming Soon]
- Twitter: [Coming Soon]

## Acknowledgments

- Built for the Web3 community
- Inspired by traditional ROSCAs
- Powered by cutting-edge DeFi technology

---

**Built with ❤️ for decentralized financial inclusion**
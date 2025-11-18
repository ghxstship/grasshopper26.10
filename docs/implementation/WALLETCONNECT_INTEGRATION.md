# WalletConnect Integration Guide

Complete Web3 wallet authentication and connection management for GVTEWAY platform.

## Overview

The WalletConnect integration provides:
- **Web3 Wallet Authentication**: Sign-in with Ethereum wallets
- **Multi-Chain Support**: Ethereum, Polygon, and other EVM chains
- **Session Management**: Persistent wallet connections
- **Transaction Signing**: Sign messages and transactions
- **React Hooks**: Easy-to-use hooks for React components
- **Database Integration**: Link wallets to user accounts

## Installation

### Required Dependencies

```bash
npm install @walletconnect/sign-client @web3modal/standalone @walletconnect/types
```

### Environment Variables

Add to `.env.local`:

```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture

### Components

1. **Client** (`client.ts`): Core WalletConnect client implementation
2. **Hooks** (`hooks.tsx`): React hooks for wallet management
3. **Auth** (`auth.ts`): Authentication and database integration
4. **API** (`/api/auth/wallet`): Server-side authentication endpoint
5. **UI** (`ConnectWalletButton.tsx`): Pre-built UI components

### Database Schema

The integration uses the existing `Wallet` model in Prisma:

```prisma
model Wallet {
  id          String   @id @default(cuid())
  userId      String
  address     String
  type        WalletType
  chainId     Int?
  isVerified  Boolean  @default(false)
  isPrimary   Boolean  @default(false)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Usage

### 1. Initialize WalletConnect Client

```typescript
import { initializeWalletConnect } from '@/lib/integrations/walletconnect';

// Initialize with default config
const client = await initializeWalletConnect();

// Or with custom config
const client = await initializeWalletConnect({
  projectId: 'your_project_id',
  metadata: {
    name: 'Your App',
    description: 'Your app description',
    url: 'https://yourapp.com',
    icons: ['https://yourapp.com/icon.png'],
  },
  chains: ['eip155:1', 'eip155:137'], // Ethereum and Polygon
  methods: ['eth_sendTransaction', 'personal_sign'],
  events: ['chainChanged', 'accountsChanged'],
});
```

### 2. Use React Hooks

#### Wrap Your App with Provider

```tsx
import { WalletConnectProvider } from '@/lib/integrations/walletconnect';
import { getWalletConnectClient } from '@/lib/integrations/walletconnect';

export default function App({ children }) {
  const client = getWalletConnectClient();
  
  return (
    <WalletConnectProvider client={client}>
      {children}
    </WalletConnectProvider>
  );
}
```

#### Connect Wallet

```tsx
import { useWalletConnection } from '@/lib/integrations/walletconnect';

function ConnectButton() {
  const { connect, disconnect, isConnecting } = useWalletConnection();
  
  return (
    <button onClick={connect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
```

#### Check Connection Status

```tsx
import { useWalletConnectionStatus } from '@/lib/integrations/walletconnect';

function WalletStatus() {
  const { isConnected, address, chainId } = useWalletConnectionStatus();
  
  if (!isConnected) {
    return <div>Not connected</div>;
  }
  
  return (
    <div>
      <p>Connected: {address}</p>
      <p>Chain: {chainId}</p>
    </div>
  );
}
```

#### Sign Messages

```tsx
import { useWalletSigning } from '@/lib/integrations/walletconnect';

function SignMessage() {
  const { signMessage } = useWalletSigning();
  
  const handleSign = async () => {
    const signature = await signMessage('Hello, GVTEWAY!');
    console.log('Signature:', signature);
  };
  
  return <button onClick={handleSign}>Sign Message</button>;
}
```

### 3. Authentication Flow

#### Client-Side

```tsx
import { authenticateWithWalletClient } from '@/lib/integrations/walletconnect';
import { useWalletConnect } from '@/lib/integrations/walletconnect';

function LoginWithWallet() {
  const { client } = useWalletConnect();
  
  const handleLogin = async () => {
    try {
      // Connect wallet
      await client.connect();
      
      // Authenticate
      const result = await authenticateWithWalletClient(client);
      
      if (result.success) {
        console.log('Authenticated!', result.userId);
        // Redirect to dashboard
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };
  
  return <button onClick={handleLogin}>Login with Wallet</button>;
}
```

#### Server-Side

The authentication API endpoint is already created at `/api/auth/wallet`:

```typescript
// POST /api/auth/wallet
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x...",
  "message": "Sign this message to authenticate...",
  "chainId": 1
}

// Response
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  },
  "walletId": "wallet_id"
}
```

### 4. Pre-built UI Components

#### Connect Wallet Button

```tsx
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';

function MyPage() {
  return (
    <ConnectWalletButton
      onConnect={(address) => console.log('Connected:', address)}
      onError={(error) => console.error('Error:', error)}
      variant="gvteway"
    />
  );
}
```

#### Wallet Connection Card

```tsx
import { WalletConnectionCard } from '@/components/wallet/ConnectWalletButton';

function MyPage() {
  return (
    <WalletConnectionCard
      onConnect={(address) => console.log('Connected:', address)}
      onDisconnect={() => console.log('Disconnected')}
      variant="gvteway"
    />
  );
}
```

## Advanced Usage

### Link Wallet to Existing User

```typescript
import { linkWalletToUser } from '@/lib/integrations/walletconnect';

const result = await linkWalletToUser(
  'user_id',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  1 // chainId
);
```

### Manage Multiple Wallets

```typescript
import { getUserWallets, setPrimaryWallet, unlinkWallet } from '@/lib/integrations/walletconnect';

// Get all user wallets
const wallets = await getUserWallets('user_id');

// Set primary wallet
await setPrimaryWallet('user_id', 'wallet_id');

// Unlink wallet
await unlinkWallet('user_id', 'wallet_id');
```

### Switch Chains

```typescript
import { useChainManagement } from '@/lib/integrations/walletconnect';

function ChainSwitcher() {
  const { chainId, switchChain, isCorrectChain } = useChainManagement();
  
  const handleSwitch = async () => {
    if (!isCorrectChain(137)) {
      await switchChain(137); // Switch to Polygon
    }
  };
  
  return (
    <div>
      <p>Current Chain: {chainId}</p>
      <button onClick={handleSwitch}>Switch to Polygon</button>
    </div>
  );
}
```

### Sign Transactions

```typescript
import { useWalletSigning } from '@/lib/integrations/walletconnect';

function SendTransaction() {
  const { sendTransaction } = useWalletSigning();
  
  const handleSend = async () => {
    const txHash = await sendTransaction({
      from: '0x...',
      to: '0x...',
      value: '0x0',
      data: '0x...',
    });
    
    console.log('Transaction hash:', txHash);
  };
  
  return <button onClick={handleSend}>Send Transaction</button>;
}
```

## Security Considerations

1. **Signature Verification**: Always verify signatures on the server side
2. **Nonce Management**: Use unique nonces for each authentication attempt
3. **Session Management**: Implement proper session expiration and rotation
4. **Chain Validation**: Verify the chain ID matches expected values
5. **Address Validation**: Validate Ethereum addresses before processing

## Supported Chains

- **Ethereum Mainnet** (chainId: 1)
- **Polygon** (chainId: 137)
- **Ethereum Goerli** (chainId: 5) - Testnet
- **Polygon Mumbai** (chainId: 80001) - Testnet

Add more chains by updating the `chains` array in the config.

## Troubleshooting

### WalletConnect Not Connecting

1. Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
2. Verify the project ID is valid at https://cloud.walletconnect.com
3. Check browser console for errors
4. Ensure wallet app supports WalletConnect v2

### Signature Verification Failing

1. Verify the message format matches what was signed
2. Check that the address is lowercase
3. Ensure signature includes '0x' prefix
4. Implement proper signature verification library (ethers.js)

### Session Not Persisting

1. Check cookie settings in production
2. Verify session expiration times
3. Check browser privacy settings
4. Ensure HTTPS in production

## Integration with NFT Tickets

WalletConnect integrates seamlessly with NFT ticket minting:

```typescript
import { useWalletConnect } from '@/lib/integrations/walletconnect';
import { mintNFTTicket } from '@/lib/integrations/web3/nft';

async function mintTicket(eventId: string, ticketId: string) {
  const { address } = useWalletConnect();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  const nft = await mintNFTTicket({
    to: address,
    tokenId: ticketId,
    metadata: {
      name: 'Event Ticket',
      description: 'NFT Ticket for event',
      image: 'ipfs://...',
      attributes: [
        { trait_type: 'Event', value: eventId },
        { trait_type: 'Ticket', value: ticketId },
      ],
    },
  });
  
  return nft;
}
```

## API Reference

See inline documentation in:
- `/src/lib/integrations/walletconnect/client.ts`
- `/src/lib/integrations/walletconnect/hooks.tsx`
- `/src/lib/integrations/walletconnect/auth.ts`

## Support

For issues or questions:
1. Check the WalletConnect documentation: https://docs.walletconnect.com
2. Review the implementation in `/src/lib/integrations/walletconnect/`
3. Check the example components in `/src/components/wallet/`

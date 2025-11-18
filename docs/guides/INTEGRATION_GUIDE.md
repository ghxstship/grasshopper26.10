# INTEGRATION GUIDE

> **Third-Party Integration Documentation**  
> **Agent 6 Deliverable**

---

## 📋 OVERVIEW

This guide documents all third-party integrations implemented for the GVTEWAY-ATLVS platform. All integration modules are located in `/src/lib/integrations/`.

**Integration Status: 70% Complete**

---

## 🔌 IMPLEMENTED INTEGRATIONS

### 1. Stripe Connect (Payment Processing) ✅

**Location:** `/src/lib/integrations/stripe/`

**Features:**
- Payment intent creation and management
- Customer management
- Subscription billing
- Connect account creation and onboarding
- Transfers to connected accounts
- Refund processing
- Checkout session creation
- Webhook signature verification

**Usage Example:**
```typescript
import { createPaymentIntent, createCustomer } from '@/lib/integrations/stripe';

// Create a customer
const customer = await createCustomer('user@example.com', 'John Doe');

// Create a payment intent
const payment = await createPaymentIntent({
  amount: 5000, // $50.00
  currency: 'usd',
  customerId: customer.data?.id,
  description: 'Event ticket purchase',
});
```

**Webhook Handler:** `/src/app/api/webhooks/stripe/route.ts`

**Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 2. WalletConnect SDK ✅

**Location:** `/src/lib/integrations/wallet/walletconnect.ts`

**Features:**
- Client-side wallet connection framework
- Multi-chain support (Ethereum, Polygon)
- Message signing preparation
- Balance checking preparation

**Usage Example:**
```typescript
import { initWalletConnect } from '@/lib/integrations/wallet';

// Initialize WalletConnect (client-side only)
const config = await initWalletConnect();
// Use with @web3modal/wagmi in React components
```

**Environment Variables:**
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

### 3. Apple Wallet API ✅

**Location:** `/src/lib/integrations/wallet/apple-wallet.ts`

**Features:**
- Event ticket pass generation
- Membership card pass generation
- QR code integration
- Pass field customization

**Usage Example:**
```typescript
import { AppleWallet } from '@/lib/integrations/wallet';

// Generate event ticket pass
const pass = await AppleWallet.generateEventTicketPass(
  'Summer Music Festival',
  'Central Park',
  new Date('2024-07-15'),
  'TICKET-12345',
  'QR-CODE-DATA'
);
```

**Environment Variables:**
```
APPLE_PASS_TYPE_ID=pass.com.gvteway.eventticket
APPLE_TEAM_ID=your_team_id
```

**Note:** Requires Apple Developer certificates for signing.

---

### 4. Google Wallet API ✅

**Location:** `/src/lib/integrations/wallet/google-wallet.ts`

**Features:**
- Event ticket class creation
- Pass generation with QR codes
- JWT generation framework
- Pass update and expiration

**Usage Example:**
```typescript
import { GoogleWallet } from '@/lib/integrations/wallet';

// Create ticket class
const ticketClass = await GoogleWallet.createEventTicketClass(
  'class-id-123',
  'Summer Music Festival',
  'Central Park',
  '123 Park Ave, New York, NY',
  '2024-07-15T18:00:00Z'
);

// Generate pass
const pass = await GoogleWallet.generateEventTicketPass(
  'object-id-456',
  'class-id-123',
  'TICKET-12345',
  'QR-CODE-DATA'
);
```

**Note:** Requires Google Cloud service account credentials.

---

### 5. Mapbox Integration ✅

**Location:** `/src/lib/integrations/mapbox/`

**Features:**
- Address geocoding
- Reverse geocoding
- Directions (driving, walking, cycling)
- Distance calculation
- Static map images
- Nearby place search
- GeoJSON feature collection generation

**Usage Example:**
```typescript
import { geocodeAddress, getDirections, calculateDistance } from '@/lib/integrations/mapbox';

// Geocode an address
const results = await geocodeAddress('123 Main St, New York, NY');

// Get directions
const directions = await getDirections(
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7589, longitude: -73.9851 },
  'walking'
);

// Calculate distance
const distance = calculateDistance(
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7589, longitude: -73.9851 }
);
```

**Environment Variables:**
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token
```

---

### 6. SendGrid Email ✅

**Location:** `/src/lib/integrations/communication/sendgrid.ts`

**Features:**
- Transactional email sending
- Template-based emails
- Bulk email sending
- Event confirmation emails
- Password reset emails
- Welcome emails
- Custom notification emails

**Usage Example:**
```typescript
import { SendGrid } from '@/lib/integrations/communication';

// Send template email
await SendGrid.sendTemplateEmail(
  'user@example.com',
  'template-id-123',
  {
    eventName: 'Summer Music Festival',
    eventDate: 'July 15, 2024',
    ticketNumber: 'TICKET-12345',
  }
);

// Send custom email
await SendGrid.sendEmail({
  to: 'user@example.com',
  subject: 'Your Order Confirmation',
  html: '<h1>Thank you for your order!</h1>',
});
```

**Webhook Handler:** `/src/app/api/webhooks/sendgrid/route.ts`

**Environment Variables:**
```
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@gvteway.com
```

---

### 7. Twilio SMS ✅

**Location:** `/src/lib/integrations/communication/twilio.ts`

**Features:**
- SMS sending
- MMS support (media URLs)
- Event reminders
- Ticket confirmations
- Verification codes
- Alert messages
- Bulk SMS
- Message status tracking

**Usage Example:**
```typescript
import { Twilio } from '@/lib/integrations/communication';

// Send SMS
await Twilio.sendSMS({
  to: '+1234567890',
  body: 'Your verification code is: 123456',
});

// Send event reminder
await Twilio.sendEventReminder(
  '+1234567890',
  'Summer Music Festival',
  'July 15, 2024',
  'Central Park'
);
```

**Webhook Handler:** `/src/app/api/webhooks/twilio/route.ts`

**Environment Variables:**
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

### 8. Socket.io Real-time ✅

**Location:** `/src/lib/integrations/realtime/socket.ts`

**Features:**
- Real-time event framework
- Room management
- Direct messaging
- Presence tracking
- Typing indicators
- Broadcast messaging
- Notification system

**Usage Example:**
```typescript
import { initSocket, joinRoom, sendNotification } from '@/lib/integrations/realtime/socket';

// Initialize (client-side)
const config = await initSocket();

// Join a room
const roomData = joinRoom('event-123', 'user-456');

// Send notification
const notification = sendNotification({
  id: 'notif-1',
  type: 'info',
  title: 'New Message',
  message: 'You have a new message',
  userId: 'user-456',
});
```

**Environment Variables:**
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

### 9. Supabase Storage ✅

**Location:** `/src/lib/integrations/storage/supabase.ts`

**Features:**
- File upload
- File download
- Public URL generation
- Signed URL generation
- File deletion
- File listing
- File move/copy
- Bucket creation
- Image upload optimization

**Usage Example:**
```typescript
import { Storage } from '@/lib/integrations/storage';

// Upload file
const result = await Storage.uploadFile({
  bucket: 'event-images',
  path: 'events/summer-fest.jpg',
  file: fileBuffer,
  contentType: 'image/jpeg',
});

// Get public URL
const url = Storage.getPublicUrl('event-images', 'events/summer-fest.jpg');

// Get signed URL for private file
const signedUrl = await Storage.getSignedUrl('private-docs', 'contract.pdf', 3600);
```

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🚧 PENDING INTEGRATIONS

### NFT Minting (Ethereum/Polygon)
- Smart contract integration
- Token minting
- Metadata storage (IPFS)
- Transaction signing

### Push Notifications
- Firebase Cloud Messaging
- Apple Push Notification Service
- Web Push API

### In-app Messaging
- Real-time chat implementation
- Message persistence
- File attachments

### Cloudflare CDN
- Asset optimization
- Cache configuration
- Edge functions

### Analytics (PostHog)
- Event tracking
- User analytics
- Conversion funnels
- A/B testing

### Monitoring (Sentry)
- Error tracking
- Performance monitoring
- Release tracking

---

## 📁 FILE STRUCTURE

```
src/lib/integrations/
├── types.ts                    # Shared types
├── utils.ts                    # Utility functions
├── index.ts                    # Main exports
├── stripe/
│   ├── types.ts
│   ├── client.ts
│   └── index.ts
├── wallet/
│   ├── types.ts
│   ├── walletconnect.ts
│   ├── apple-wallet.ts
│   ├── google-wallet.ts
│   └── index.ts
├── mapbox/
│   ├── types.ts
│   ├── client.ts
│   └── index.ts
├── communication/
│   ├── sendgrid.ts
│   ├── twilio.ts
│   └── index.ts
├── realtime/
│   └── socket.ts
└── storage/
    ├── supabase.ts
    └── index.ts
```

---

## 🔐 SECURITY BEST PRACTICES

1. **Environment Variables**
   - Never commit API keys to version control
   - Use `.env.local` for local development
   - Use platform secrets for production

2. **Webhook Verification**
   - Always verify webhook signatures
   - Use HTTPS endpoints only
   - Implement rate limiting

3. **API Key Management**
   - Rotate keys regularly
   - Use separate keys for development/production
   - Monitor API usage

4. **Data Encryption**
   - Use HTTPS for all API calls
   - Encrypt sensitive data at rest
   - Implement proper access controls

---

## 🧪 TESTING

Each integration includes error handling and returns standardized responses:

```typescript
interface IntegrationResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Testing Checklist:**
- [ ] Test with valid credentials
- [ ] Test with invalid credentials
- [ ] Test error handling
- [ ] Test webhook signature verification
- [ ] Test rate limiting
- [ ] Test timeout scenarios

---

## 📞 SUPPORT & RESOURCES

### Stripe
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Connect Guide](https://stripe.com/docs/connect)

### Mapbox
- [Mapbox API Documentation](https://docs.mapbox.com/api/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

### SendGrid
- [SendGrid API Documentation](https://docs.sendgrid.com/api-reference)
- [Email Templates](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates)

### Twilio
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Twilio Webhooks](https://www.twilio.com/docs/usage/webhooks)

### Supabase
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

## 🚀 NEXT STEPS FOR AGENT 6

1. **Complete NFT Minting Integration**
   - Set up Ethereum/Polygon provider
   - Deploy NFT smart contract
   - Implement minting functions

2. **Add Push Notifications**
   - Set up Firebase Cloud Messaging
   - Implement notification service
   - Create notification templates

3. **Implement Analytics**
   - Integrate PostHog
   - Set up event tracking
   - Create analytics dashboards

4. **Add Monitoring**
   - Set up Sentry
   - Configure error tracking
   - Implement performance monitoring

5. **Complete Wallet Features**
   - Implement Apple Wallet pass signing
   - Set up Google Wallet JWT generation
   - Add pass update notifications

---

**Built with GHXSTSHIP precision ⚓️**
**Agent 6: Integration Specialist**

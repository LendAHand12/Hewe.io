# 🚀 Quick Start Guide - Web3 Deposit

## ⚡ Setup (1 minute)

Add to `BE_Hewe/.env`:

```bash
SYSTEM_WALLET_ADDRESS=0x... # Your BSC wallet address
SYSTEM_WALLET_PRIVATE_KEY=... # Private key (without 0x)
BSC_RPC_URL=https://bsc-dataseed1.binance.org:443
USDT_CONTRACT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
```

**That's it!** Frontend verifies deposits instantly.

## ✅ Start & Test

```bash
# Backend
cd BE_Hewe
npm start

# Frontend (new terminal)
cd FE_Hewe_user
npm start
```

1. Open browser: http://localhost:3000
2. Go to Wallet → Deposit
3. Click "Quick Deposit (Web3)" tab
4. Click "Connect Wallet"
5. Deposit 10 USDT
6. Balance updates immediately after transaction confirms!

## 🧪 Test Deposit

**On Testnet (Recommended):**

1. Change `BSC_CHAIN_ID` to `97` in `web3Config.js`
2. Get testnet BNB: https://testnet.binance.org/faucet-smart
3. Try depositing 10 USDT
4. Check balance updates instantly

**On Mainnet:**

1. Start with small amount (5-10 USDT)
2. Monitor backend logs
3. Check database for deposit record

## 🐛 Troubleshooting

**"MetaMask Not Installed"**
→ Install MetaMask extension

**"Wrong Network"**
→ Click "Switch to BSC" button

**Deposit not detected**
→ Check backend logs for verification
→ Verify transaction on BSCScan

## 📚 Full Documentation

- [Setup Guide](file:///Users/guess/Desktop/HeweIo/WEB3_SETUP_GUIDE.md)
- [Walkthrough](file:///Users/guess/.gemini/antigravity/brain/0fce4b87-dfbb-479b-afd9-991576a67ed3/walkthrough.md)

---

**Simple & Fast!** No blockchain crawler needed.

## 📚 Full Documentation

- [Setup Guide](file:///Users/guess/Desktop/HeweIo/WEB3_SETUP_GUIDE.md) - Detailed setup instructions
- [Implementation Plan](file:///Users/guess/.gemini/antigravity/brain/0fce4b87-dfbb-479b-afd9-991576a67ed3/implementation_plan.md) - Technical details
- [Walkthrough](file:///Users/guess/.gemini/antigravity/brain/0fce4b87-dfbb-479b-afd9-991576a67ed3/walkthrough.md) - What was implemented

## 🎯 Next Steps

After testing works:

1. Get WalletConnect Project ID (for mobile support)
2. Test on production
3. Monitor for 24 hours
4. Enable for all users

---

**Need Help?** Check the full setup guide or review the implementation plan.

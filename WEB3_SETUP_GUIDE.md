# Web3 Wallet Integration - Setup Guide

## 📋 Prerequisites

1. **Node.js** version 14+ installed
2. **MetaMask** extension installed (for testing)
3. **BSC Wallet** with some BNB for gas fees
4. **USDT on BSC** for testing deposits

## 🔧 Installation Steps

### 1. Install Dependencies

#### Frontend
```bash
cd FE_Hewe_user
npm install ethers@^5.7.2
```

#### Backend
```bash
cd BE_Hewe
npm install ethers@^5.7.2 node-cron@^3.0.2
```

### 2. Create System Wallet

Bạn cần tạo 1 ví BSC mới làm ví hệ thống (hoặc dùng ví hiện có):

**Option A: Tạo ví mới bằng MetaMask**
1. Mở MetaMask
2. Create new account
3. Copy địa chỉ ví (0x...)
4. Export private key (Settings → Security & Privacy → Reveal Private Key)

**Option B: Tạo ví bằng code**
```javascript
const { ethers } = require('ethers');
const wallet = ethers.Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
```

> [!CAUTION]
> **BẢO MẬT PRIVATE KEY**
> - KHÔNG BAO GIỜ commit private key lên Git
> - KHÔNG chia sẻ private key cho ai
> - Nên dùng multi-sig wallet cho production

### 3. Configure Environment Variables

Thêm vào file `.env` của backend:

```bash
# System Wallet (ví chung nhận tiền từ tất cả user)
SYSTEM_WALLET_ADDRESS=0xYourSystemWalletAddress
SYSTEM_WALLET_PRIVATE_KEY=YourPrivateKeyWithout0x

# BSC RPC
BSC_RPC_URL=https://bsc-dataseed1.binance.org:443

# USDT Contract on BSC
USDT_CONTRACT_ADDRESS=0x55d398326f99059fF775485246999027B3197955

# Crawler Config
CRAWLER_INTERVAL_MS=10000
CRAWLER_START_BLOCK=latest
```

### 4. Get WalletConnect Project ID

1. Truy cập https://cloud.walletconnect.com
2. Đăng ký tài khoản miễn phí
3. Tạo project mới
4. Copy Project ID
5. Paste vào `FE_Hewe_user/src/config/web3Config.js`:

```javascript
export const WALLETCONNECT_PROJECT_ID = 'your_project_id_here';
```

### 5. Start Blockchain Crawler

Thêm vào file `BE_Hewe/index.js`:

```javascript
// Import crawler
const { startCrawler } = require('./module/blockchainCrawler');

// Start crawler sau khi server khởi động
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start blockchain crawler
  startCrawler();
});
```

### 6. Update Frontend Routes

Thêm component vào `FE_Hewe_user/src/components/WalletUSDTPage/components/index.js`:

```javascript
export { DepositWeb3 } from './DepositWeb3/DepositWeb3';
```

Thêm tab vào `ChooseTab.jsx`:

```javascript
import { DepositWeb3 } from '..';

const TAB_ITEMS = [
  {
    label: 'Quick Deposit (Web3)',
    key: 'WEB3',
    children: <DepositWeb3 />,
  },
  // ... existing tabs
];
```

## 🧪 Testing

### 1. Test trên Testnet (Khuyến nghị)

Trước khi test trên mainnet, nên test trên BSC Testnet:

1. Thay đổi config trong `web3Config.js`:
```javascript
export const BSC_CHAIN_ID = 97; // Testnet
export const BSC_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
export const USDT_CONTRACT_ADDRESS = '0x...'; // USDT testnet address
```

2. Lấy BNB testnet từ faucet: https://testnet.binance.org/faucet-smart

### 2. Test Flow

1. **Start backend:**
```bash
cd BE_Hewe
npm start
```

2. **Start frontend:**
```bash
cd FE_Hewe_user
npm start
```

3. **Test deposit:**
   - Mở browser với MetaMask
   - Vào trang Deposit
   - Click tab "Quick Deposit (Web3)"
   - Click "Connect Wallet"
   - Nhập số lượng USDT (min: 5)
   - Click "Deposit Now"
   - Approve transaction trong MetaMask
   - Chờ 10-20 giây
   - Kiểm tra số dư đã cập nhật

### 3. Check Logs

**Backend logs:**
```
[Crawler] Starting blockchain crawler...
[Crawler] Scanning blocks 12345 to 12355...
[Crawler] Found 1 Transfer events
[Crawler] ✅ Processed deposit: 10 USDT for user test@example.com
```

**Database:**
```javascript
// Check deposit record
db.deposits.find({ depositType: 'web3' }).sort({ createdAt: -1 }).limit(1)
```

## 🚀 Deployment

### 1. Production Checklist

- [ ] Đã test kỹ trên testnet
- [ ] Private key được mã hóa và bảo mật
- [ ] Crawler đang chạy ổn định
- [ ] Telegram notification hoạt động
- [ ] Backup database trước khi deploy

### 2. Deploy Steps

1. **Update .env trên production server**
2. **Deploy backend code**
3. **Deploy frontend code**
4. **Restart server**
5. **Monitor logs** trong 24h đầu

### 3. Monitoring

**Metrics cần theo dõi:**
- Số lượng deposit thành công
- Số lượng deposit failed
- Crawler uptime
- Response time của verify API
- Database size

**Alerts:**
- Crawler stopped
- Verify API error rate > 5%
- Deposit không được xử lý sau 1 phút

## 🔍 Troubleshooting

### Lỗi "MetaMask Not Installed"
- User cần cài MetaMask extension
- Hoặc dùng WalletConnect cho mobile

### Lỗi "Wrong Network"
- User cần switch sang BSC network
- Click button "Switch to BSC" trong UI

### Lỗi "Transaction Failed"
- Kiểm tra user có đủ BNB cho gas fee không
- Kiểm tra user có đủ USDT không
- Kiểm tra network congestion

### Crawler không chạy
- Kiểm tra `SYSTEM_WALLET_ADDRESS` trong .env
- Kiểm tra BSC RPC URL có hoạt động không
- Kiểm tra logs: `tail -f log.txt`

### Transaction không được xử lý
- Kiểm tra crawler logs
- Kiểm tra transaction hash trên BSCScan
- Manually trigger crawler: `crawlBlockchain()`

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Backend logs
2. Frontend console
3. BSCScan transaction details
4. Database records

## 🎯 Next Steps

Sau khi Web3 deposit hoạt động ổn định:

1. **A/B Testing**: So sánh conversion rate với flow cũ
2. **Optimize**: Giảm crawler interval nếu cần
3. **Scale**: Thêm multiple RPC URLs cho redundancy
4. **Deprecate**: Bỏ flow Coinpayments sau 1 tháng

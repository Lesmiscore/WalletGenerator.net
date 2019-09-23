---
name: Coin addition request
about: Request for adding coin to WalletGenerator
title: "[bitcoin] Coin addition request"
labels: ''
assignees: ''

---

**Please check the following:**
- [ ] I swear that this coin is not ETH token, NEM mosaic, Counterparty token, or anything else.
- [ ] I can provide format details for address and private key. (Not applicable for BTC-based coin)
- [ ] This is not bug report

**Information needed to implement**
You have to disclose following documents or repositories:
- Source code for the coin
- Format details for address and private key (Not applicable for BTC-based coins)
- For BTC-based coins:
  - PKH header number for address (e.g. BTC uses 0x01)
  - WIF header number for WIF private key (e.g. BTC uses 0x80)
- Coin logo and paper wallet background
  - Coin logo must be square and PNG format. Any image that don't meet them will be rejected.
  - If you want to use another layout for paper wallet, you must send PR instead of this issue.
- If you want to add Testnets, write about it too.
- If you also need SegWit support, you need 5MONA (Monacoin). This doesn't billed if you send PR instead of this. (Applicable for BTC-based coins)

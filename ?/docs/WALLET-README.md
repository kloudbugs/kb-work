# Bitcoin Paper Wallet Guide

This folder contains your Bitcoin paper wallet files. These files provide you with a secure way to store your Bitcoin offline and protect it from online threats.

## Files Included

1. **paper-wallet.html** - The complete paper wallet to print and store
2. **address-qr.png** - QR code for your public Bitcoin address
3. **private-key-qr.png** - QR code for your private key (KEEP SECRET!)
4. **wallet-info.html** - A simple viewer for your wallet information

## Your Bitcoin Address

Your Bitcoin address is:

```
bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps
```

This address is derived from your private key using a cryptographic process. It's in the "Native SegWit" format (begins with bc1q), which is a modern Bitcoin address format with lower transaction fees.

## How to Use Your Paper Wallet

1. **Open** the paper-wallet.html file in any web browser
2. **Print** the wallet on high-quality paper
3. **Fold** along the dotted line to hide your private key
4. **Store** the wallet in a secure location (safe, safety deposit box, etc.)
5. **Share** only your public address to receive Bitcoin

## Security Tips

- NEVER share your private key with anyone
- Consider making multiple copies of your paper wallet and storing them in different secure locations
- Laminate your paper wallet to protect it from damage
- Test with a small amount of Bitcoin before storing large amounts
- Remember that anyone with access to your private key can spend your Bitcoin

## Checking Your Balance

You can check your wallet balance anytime by visiting a Bitcoin block explorer and entering your public address:

- [Blockchain.com Explorer](https://www.blockchain.com/explorer/addresses/btc/bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps)
- [Blockstream.info Explorer](https://blockstream.info/address/bc1qfavnkrku005m4kdkvdtgthur4ha06us2lppdps)

## To Import Your Paper Wallet

When you want to spend the Bitcoin from your paper wallet, you'll need to import your private key into a Bitcoin wallet software. Different wallet applications have different methods for importing private keys:

1. Look for an "Import" or "Sweep" option in your chosen wallet software
2. When prompted, scan the private key QR code or enter it manually
3. The wallet will then have access to the Bitcoin at this address

## Important Notes

- Your private key is stored in the environment variables of this system
- The paper wallet QR code for the private key contains this private key
- For maximum security, generate your paper wallet on an offline computer and never expose your private key to the internet

This is a cold storage solution, meaning the private key is kept offline for maximum security.
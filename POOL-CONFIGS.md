# KLOUD BUGS Mining Platform - Supported Mining Pools

This document provides comprehensive information about all the mining pools currently supported by the KLOUD BUGS Mining Platform, along with their configurations and features.

## Currently Supported Mining Pools

### Bitcoin (BTC) Mining Pools

| Pool Name | URL | Algorithm | Fee % | Payout Threshold | Payout Frequency | Special Features |
|-----------|-----|-----------|-------|------------------|------------------|-----------------|
| SlushPool | btc.slushpool.com:3333 | SHA-256 | 2.0% | 0.001 BTC | Daily | FPPS, Detailed stats |
| F2Pool | btc.f2pool.com:3333 | SHA-256 | 2.5% | 0.005 BTC | Daily | PPS+, Multiple coins |
| AntPool | stratum.antpool.com:3333 | SHA-256 | 2.5% | 0.001 BTC | Daily | FPPS/PPS+, Daily payouts |
| ViaBTC | btc.viabtc.com:3333 | SHA-256 | 2.5% | 0.002 BTC | Daily | PPS+, Multi-currency |
| Binance Pool | btc.binancepool.com:3333 | SHA-256 | 2.0% | 0.001 BTC | Daily | FPPS, Exchange integration |
| Foundry USA | stratum.foundryusapool.com:3333 | SHA-256 | 2.0% | 0.0025 BTC | Weekly | FPPS, US-based |
| Poolin | btc.ss.poolin.com:443 | SHA-256 | 2.5% | 0.0005 BTC | Daily | FPPS+, Smart agent |

### Ethereum (ETH) Mining Pools

| Pool Name | URL | Algorithm | Fee % | Payout Threshold | Payout Frequency | Special Features |
|-----------|-----|-----------|-------|------------------|------------------|-----------------|
| Ethermine | stratum-eth.ethermine.org:4444 | Ethash | 1.0% | 0.01 ETH | Every 24 hours | PPS, MEV rewards |
| F2Pool | eth.f2pool.com:6688 | Ethash | 2.0% | 0.1 ETH | Daily | PPS, Multi-coin support |
| Hiveon | eth-eu.hiveon.net:4444 | Ethash | 0% | 0.1 ETH | Every 4 hours | PPS+, No fees |
| Flexpool | eth-us.flexpool.io:4444 | Ethash | 0.5% | 0.05 ETH | On-demand | PPLNS, Low fees |
| Nanopool | eth-us-east1.nanopool.org:9999 | Ethash | 1.0% | 0.05 ETH | Daily | PPLNS, Easy setup |
| 2Miners | eth.2miners.com:2020 | Ethash | 1.0% | 0.05 ETH | Every 2 hours | PPLNS, SOLO option |

### Multi-algorithm / Multi-coin Pools

| Pool Name | URL | Algorithms | Fee % | Payout Threshold | Payout Frequency | Special Features |
|-----------|-----|------------|-------|------------------|------------------|-----------------|
| Unmineable | rx.unmineable.com:3333 | RandomX | 0.75% | Coin-specific | Daily | Mine alt-coins with any hardware |
| Zergpool | stratum.zergpool.com:3333 | Multiple | 0.5-2% | 0.001 BTC equiv. | On-demand | Auto-exchange to BTC |
| Mining Dutch | mining-dutch.nl:8080 | Multiple | 0.25-1% | Varies | 12 hours | Auto profit switching |
| MinerMore | us.minermore.com:4444 | Multiple | 0.5-1% | Varies | Daily | Low fees, stable payouts |
| ProHashing | prohashing.com:3333 | Multiple | 3-4.5% | 0.0001 BTC equiv. | Hourly | Revenue sharing model |
| ZPool | stratum.zpool.ca:6233 | Multiple | 0.5-2% | 0.001 BTC | On-demand | Auto profit switching |

### Monero (XMR) and RandomX Pools

| Pool Name | URL | Algorithm | Fee % | Payout Threshold | Payout Frequency | Special Features |
|-----------|-----|-----------|-------|------------------|------------------|-----------------|
| SupportXMR | pool.supportxmr.com:5555 | RandomX | 0.6% | 0.01 XMR | Daily | PPLNS, Community-focused |
| MoneroOcean | gulf.moneroocean.stream:10128 | Multiple | 0.8% | 0.003 XMR | Every 2 hours | Algo-switching for best profit |
| HashVault | pool.hashvault.pro:5555 | RandomX | 1.0% | 0.1 XMR | Daily | Multiple portfolios |
| XMRpool | pool.xmr.pt:5555 | RandomX | 0.5% | 0.004 XMR | Daily | PPLNS, Low fees |

### Litecoin (LTC) and Scrypt Pools

| Pool Name | URL | Algorithm | Fee % | Payout Threshold | Payout Frequency | Special Features |
|-----------|-----|-----------|-------|------------------|------------------|-----------------|
| Litecoinpool | stratum.litecoinpool.org:3333 | Scrypt | 1.0% | 0.01 LTC | Daily | Merge-mining, PPS |
| F2Pool | ltc.f2pool.com:8888 | Scrypt | 2.0% | 0.1 LTC | Daily | PPS, Stable platform |
| ViaBTC | ltc.viabtc.com:3333 | Scrypt | 2.0% | 0.1 LTC | Daily | PPS+, Reliable payouts |
| Poolin | ltc.ss.poolin.com:443 | Scrypt | 1.0% | 0.1 LTC | Daily | FPPS, Multiple currencies |

## Upcoming Mining Pools

The KLOUD BUGS Mining Platform is continuously expanding its pool support. The following pools are scheduled to be added in future updates:

1. **BTC.com Pool** - High-performance BTC mining with competitive fees
2. **HeroMiners** - Multiple algorithm support with excellent UI
3. **K1Pool** - Specialized in low-latency CPU mining
4. **CrazyPool** - Focuses on emerging cryptocurrencies and new algorithms
5. **NiceHash** - Integration with the NiceHash marketplace
6. **SoloPool** - Solo mining options for various coins

## Pool Features Comparison

| Feature | Supported Pools | Description |
|---------|----------------|-------------|
| Auto-Exchange | Zergpool, Zpool, ProHashing | Automatically exchange mined coins to preferred currency |
| Merged Mining | Litecoinpool, ViaBTC | Mine multiple coins simultaneously with same algorithm |
| SOLO Mining | 2Miners, F2Pool, Mining Dutch | Option to mine blocks solo (higher variance, potentially higher rewards) |
| MEV Rewards | Ethermine, Flexpool | Maximal Extractable Value optimization for extra rewards |
| Prop/PPS/PPLNS | Most pools | Different payout systems affecting reward distribution |
| Customizable Payouts | Flexpool, Binance Pool | Control when and how you receive your mining rewards |

## Pool Configuration Guide

### Basic Pool Configuration Format

```json
{
  "stratumUrl": "pool.example.com",
  "stratumPort": 3333,
  "username": "WALLET_ADDRESS.WORKER_NAME",
  "password": "x",
  "algorithm": "SHA-256",
  "tls": false,
  "submitStaleShares": false
}
```

### Advanced Pool Configuration

```json
{
  "primary": {
    "stratumUrl": "btc.slushpool.com",
    "stratumPort": 3333,
    "username": "WALLET_ADDRESS.WORKER_NAME",
    "password": "x",
    "algorithm": "SHA-256"
  },
  "backup": [
    {
      "stratumUrl": "btc.f2pool.com",
      "stratumPort": 3333,
      "username": "WALLET_ADDRESS.WORKER_NAME",
      "password": "x",
      "algorithm": "SHA-256"
    }
  ],
  "autoSwitch": true,
  "switchThreshold": 5, // minutes of connection failure
  "reportHashrate": true
}
```

## Connection Management

The KLOUD BUGS Mining Platform automatically manages connections to mining pools with the following features:

1. **Fail-over Protection**: Automatically switches to backup pools if primary connection fails
2. **Geo-optimization**: Connects to the closest regional server for minimal latency
3. **Load Balancing**: Distributes mining power across multiple pools when advantageous
4. **Health Monitoring**: Continuously monitors pool status and performance

---

*Note: More mining pools are continuously being added to the platform. If you have specific pool requests, these can be integrated into the system with future updates.*
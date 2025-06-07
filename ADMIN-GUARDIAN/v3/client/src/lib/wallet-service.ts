// Real Bitcoin Wallet Service
export interface WalletBalance {
  address: string;
  balance: number; // in BTC
  unconfirmedBalance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
}

export interface Transaction {
  txid: string;
  amount: number;
  confirmations: number;
  timestamp: number;
  type: 'received' | 'sent';
  fee?: number;
  blockHeight?: number;
}

export interface AddressInfo {
  address: string;
  balance: WalletBalance;
  transactions: Transaction[];
}

class WalletService {
  private apiKey: string | null = null;
  private baseUrl = 'https://blockstream.info/api';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async getAddressInfo(address: string): Promise<AddressInfo> {
    try {
      // Get address balance and info
      const balanceResponse = await fetch(`${this.baseUrl}/address/${address}`);
      const balanceData = await balanceResponse.json();

      // Get transactions
      const txResponse = await fetch(`${this.baseUrl}/address/${address}/txs`);
      const txData = await txResponse.json();

      const balance: WalletBalance = {
        address,
        balance: balanceData.chain_stats.funded_txo_sum / 100000000, // Convert satoshis to BTC
        unconfirmedBalance: balanceData.mempool_stats.funded_txo_sum / 100000000,
        totalReceived: balanceData.chain_stats.funded_txo_sum / 100000000,
        totalSent: balanceData.chain_stats.spent_txo_sum / 100000000,
        transactionCount: balanceData.chain_stats.tx_count
      };

      const transactions: Transaction[] = txData.slice(0, 20).map((tx: any) => ({
        txid: tx.txid,
        amount: this.calculateTransactionAmount(tx, address),
        confirmations: tx.status.confirmed ? tx.status.block_height : 0,
        timestamp: tx.status.block_time * 1000,
        type: this.getTransactionType(tx, address),
        fee: tx.fee / 100000000,
        blockHeight: tx.status.block_height
      }));

      return {
        address,
        balance,
        transactions
      };
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw new Error('Failed to fetch wallet data from blockchain API');
    }
  }

  private calculateTransactionAmount(tx: any, address: string): number {
    let inputAmount = 0;
    let outputAmount = 0;

    // Calculate inputs from this address
    tx.vin.forEach((input: any) => {
      if (input.prevout && input.prevout.scriptpubkey_address === address) {
        inputAmount += input.prevout.value;
      }
    });

    // Calculate outputs to this address
    tx.vout.forEach((output: any) => {
      if (output.scriptpubkey_address === address) {
        outputAmount += output.value;
      }
    });

    // Return net amount (positive for received, negative for sent)
    return (outputAmount - inputAmount) / 100000000;
  }

  private getTransactionType(tx: any, address: string): 'received' | 'sent' {
    const amount = this.calculateTransactionAmount(tx, address);
    return amount > 0 ? 'received' : 'sent';
  }

  async getCurrentPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
      const data = await response.json();
      return parseFloat(data.bpi.USD.rate.replace(',', ''));
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      return 60000; // Fallback price
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    // Basic Bitcoin address validation
    const btcRegex = /^[13][a-km-z1-9A-HJ-NP-Z]{25,34}$|^bc1[a-z0-9]{39,59}$/;
    return btcRegex.test(address);
  }
}

export const walletService = new WalletService();
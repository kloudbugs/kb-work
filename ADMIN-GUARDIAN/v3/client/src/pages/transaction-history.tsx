import React from 'react';
import { Helmet } from 'react-helmet';
import TransactionHistory from '@/components/mining/transaction-history';

const TransactionHistoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Transaction History | KLOUD BUGS Mining</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Wallet Transactions</h1>
      <TransactionHistory />
    </div>
  );
};

export default TransactionHistoryPage;
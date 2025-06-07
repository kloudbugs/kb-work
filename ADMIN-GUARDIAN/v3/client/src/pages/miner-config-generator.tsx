import React from 'react';
import { CustomMinerConfigGenerator } from '@/components/mining/custom-miner-config-generator';

export default function MinerConfigGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <CustomMinerConfigGenerator />
    </div>
  );
}
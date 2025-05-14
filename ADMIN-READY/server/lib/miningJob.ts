/**
 * Mining Job Interface
 * Represents a job to be processed by the mining devices
 */
export interface MiningJob {
  jobId: string;
  prevHash?: string;
  coinbase1?: string;
  coinbase2?: string;
  merkleRoot?: string;
  version?: string;
  bits?: string;
  time?: string;
  cleanJobs?: boolean;
  target?: string;
  extraNonce1?: string;
  extraNonce2Size?: number;
}
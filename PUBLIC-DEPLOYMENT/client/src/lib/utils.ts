import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format hash rate appropriately
export function formatHashRate(hashRate: number | string): string {
  // Convert string to number if needed
  const numericHashRate = typeof hashRate === 'string' ? parseFloat(hashRate) : hashRate;
  
  // Check if valid number (handle NaN case)
  if (isNaN(numericHashRate)) {
    return '0.00 TH/s';
  }
  
  if (numericHashRate >= 1000000000) {
    return `${(numericHashRate / 1000000000).toFixed(2)} TH/s`;
  } else if (numericHashRate >= 1000000) {
    return `${(numericHashRate / 1000000).toFixed(2)} GH/s`;
  } else if (numericHashRate >= 1000) {
    return `${(numericHashRate / 1000).toFixed(2)} MH/s`;
  } else {
    return `${numericHashRate.toFixed(2)} KH/s`;
  }
}

// Format BTC amount with proper precision
export function formatBtc(amount: number | string, isSatoshi = false): string {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if valid number (handle NaN case)
  if (isNaN(numericAmount)) {
    return '0.00000000';
  }
  
  // Convert from satoshis to BTC if needed (1 BTC = 100,000,000 satoshis)
  const btcAmount = isSatoshi ? numericAmount / 100000000 : numericAmount;
  
  return btcAmount.toFixed(8);
}

// Format USD amount with proper currency symbol
export function formatUsd(amount: number | string): string {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if valid number (handle NaN case)
  if (isNaN(numericAmount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(numericAmount);
}

// Format date for display
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Calculate time difference for "X min/hours/days ago" display
export function timeAgo(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} mins ago`;
  }
  
  return `${Math.floor(seconds)} seconds ago`;
}

// Create random hash for simulated tx hashes
export function randomHash(): string {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Format IP address
export function formatIpAddress(ip: string): string {
  return ip;
}

// Calculate estimated earnings based on hash rate
export function calculateEstimatedEarnings(hashRate: number | string): number {
  // Convert string to number if needed
  const numericHashRate = typeof hashRate === 'string' ? parseFloat(hashRate) : hashRate;
  
  // Check if valid number (handle NaN case)
  if (isNaN(numericHashRate)) {
    return 0;
  }
  
  // Very simplified estimation: 1 MH/s ≈ 0.00000001 BTC per day
  return numericHashRate * 0.00000001;
}

// Create shortened version of address or hash
export function shortenHash(hash: string, length = 8): string {
  if (!hash) return '';
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
}

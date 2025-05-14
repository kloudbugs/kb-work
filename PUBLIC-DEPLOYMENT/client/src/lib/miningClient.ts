import { apiRequest } from "./queryClient";

// Constants for mining optimization
export const OPTIMIZATION_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  TURBO: 'turbo'
} as const;

// Mining Dashboard API
export const getMiningStats = async () => {
  const res = await fetch('/api/mining/stats', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch mining stats');
  }
  
  return res.json();
};

export const getMiningHistory = async (days = 7) => {
  const res = await fetch(`/api/mining/history?days=${days}`, {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch mining history');
  }
  
  return res.json();
};

export const toggleMining = async (enabled: boolean) => {
  const response = await apiRequest('POST', '/api/mining/toggle', { enabled });
  const data = await response.json();
  return data;
};

// Devices API
export const getDevices = async () => {
  const res = await fetch('/api/devices', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch devices');
  }
  
  return res.json();
};

export const addDevice = async (deviceData: any) => {
  return apiRequest('POST', '/api/devices', deviceData);
};

export const updateDevice = async (id: number, deviceData: any) => {
  return apiRequest('PUT', `/api/devices/${id}`, deviceData);
};

export const deleteDevice = async (id: number) => {
  return apiRequest('DELETE', `/api/devices/${id}`);
};

// Enhanced optimization function that improves mining performance
// Type for optimization levels
export type OptimizationLevel = 'low' | 'medium' | 'high' | 'turbo';

// Optimize a single device
export const optimizeDevice = async (id: number, optimizationLevel: OptimizationLevel = 'medium') => {
  // Different optimization levels for different device capabilities
  const optimizationSettings = {
    low: { 
      cpuAllocation: 60, 
      ramAllocation: 50,
      threadCount: 2,
      difficultyBoost: 0.9 
    },
    medium: { 
      cpuAllocation: 75, 
      ramAllocation: 65,
      threadCount: 4,
      difficultyBoost: 0.8
    },
    high: { 
      cpuAllocation: 90, 
      ramAllocation: 80,
      threadCount: 8,
      difficultyBoost: 0.7
    },
    turbo: { 
      cpuAllocation: 100, 
      ramAllocation: 90,
      threadCount: 16,
      difficultyBoost: 0.6  // Extra aggressive target difficulty
    }
  };
  
  // Apply optimization settings based on level
  const settings = optimizationSettings[optimizationLevel];
  
  // Add special optimizations to boost hashrate
  return updateDevice(id, { 
    ...settings,
    status: 'active',
    optimized: true,
    parallelMining: true,
    shareBooster: true
  });
};

export const pauseDevice = async (id: number) => {
  return updateDevice(id, { status: 'paused' });
};

export const resumeDevice = async (id: number) => {
  return updateDevice(id, { status: 'active' });
};

// Function to optimize all devices at once
export const optimizeAllDevices = async (optimizationLevel: OptimizationLevel = 'medium') => {
  const response = await apiRequest('POST', '/api/devices/optimize-all', { optimizationLevel });
  const data = await response.json();
  return data;
};

// Mining Pools API
export const getPools = async () => {
  const res = await fetch('/api/pools', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch mining pools');
  }
  
  return res.json();
};

export const addPool = async (poolData: any) => {
  return apiRequest('POST', '/api/pools', poolData);
};

export const updatePool = async (id: number, poolData: any) => {
  return apiRequest('PUT', `/api/pools/${id}`, poolData);
};

export const switchPool = async (id: number) => {
  return apiRequest('POST', `/api/pools/${id}/switch`, {});
};

// Functions for dual mining (connecting to multiple pools simultaneously)
export const enableDualMining = async (primaryPoolId: number, secondaryPoolId: number, primaryAllocation: number = 0.7) => {
  // Ensure primaryAllocation is between 0.1 and 0.9
  const safeAllocation = Math.min(Math.max(primaryAllocation, 0.1), 0.9);
  return apiRequest('POST', '/api/pools/dual-mining', { 
    primaryPoolId, 
    secondaryPoolId,
    primaryAllocation: safeAllocation
  });
};

// Disable dual mining and go back to single pool
export const disableDualMining = async (poolId: number) => {
  return apiRequest('POST', '/api/pools/disable-dual-mining', { poolId });
};

export const deletePool = async (id: number) => {
  return apiRequest('DELETE', `/api/pools/${id}`);
};

// Wallet API
export const getWalletDetails = async () => {
  const res = await fetch('/api/wallet', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch wallet details');
  }
  
  return res.json();
};

export const transferNow = async (params: { amount: number; useLedger?: boolean } | number) => {
  let amount: number;
  let useLedger = false;
  
  // Handle both direct number input and object with options
  if (typeof params === 'number') {
    amount = params;
  } else {
    amount = params.amount;
    useLedger = params.useLedger || false;
  }
  
  // Convert BTC amount (float) to satoshis (integer)
  // 1 BTC = 100,000,000 satoshis
  const satoshis = Math.floor(amount * 100000000);
  console.log(`Converting ${amount} BTC to ${satoshis} satoshis for transfer${useLedger ? ' using Ledger hardware wallet' : ''}`);
  
  // Include the useLedger flag in the API request
  const response = await apiRequest('POST', '/api/wallet/transfer', { 
    amount: satoshis,
    useLedger
  });
  
  const data = await response.json();
  return data;
};

// Check if Ledger support is available
export const isLedgerSupported = async () => {
  const res = await fetch('/api/wallet/ledger/supported', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to check Ledger support');
  }
  
  return res.json();
};

// Connect to Ledger hardware wallet
export const connectLedger = async () => {
  // First, check if we're in a browser environment with WebUSB support
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.usb) {
    return { 
      connected: false, 
      error: 'WebUSB not supported in this environment' 
    };
  }
  
  try {
    const response = await apiRequest('POST', '/api/wallet/ledger/connect', {});
    return response.json();
  } catch (error) {
    console.error('[connectLedger] Error:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error connecting to Ledger'
    };
  }
};

export const updatePayoutSettings = async (settings: {
  threshold?: number;
  schedule?: string;
  autoPayout?: boolean;
  walletAddress?: string;
}) => {
  return apiRequest('PUT', '/api/wallet/settings', settings);
};

export const getPayouts = async () => {
  const res = await fetch('/api/payouts', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch payouts');
  }
  
  return res.json();
};



// Auth API
export const login = async (username: string, password: string, retryCount = 0, maxRetries = 2) => {
  try {
    // Debug timestamp for request start
    const requestStartTime = new Date().toISOString();
    console.log(`[${requestStartTime}] Sending login request for user: ${username} (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    
    // Enhanced fetch request with better timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Time': requestStartTime,
        'X-Retry-Count': retryCount.toString()
      },
      body: JSON.stringify({ 
        username, 
        password,
        clientRequestTime: requestStartTime
      }),
      credentials: 'include',
      signal: controller.signal
    });
    
    // Clear the timeout since request completed
    clearTimeout(timeoutId);
    
    // Log detailed response info
    console.log(`Login response status: ${response.status}, headers:`, 
      [...response.headers.entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as Record<string, string>)
    );
    
    if (!response.ok) {
      let errorMessage = 'Login failed';
      let errorData = null;
      
      try {
        // First try to parse as JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorBody = await response.json();
          errorData = errorBody;
          errorMessage = errorBody.message || errorMessage;
        } else {
          // Fallback to text if not JSON
          const errorBody = await response.text();
          if (errorBody) {
            try {
              const errorObj = JSON.parse(errorBody);
              errorData = errorObj;
              errorMessage = errorObj.message || errorMessage;
            } catch (jsonParseError) {
              // If parsing fails, use the text directly
              errorMessage = errorBody || errorMessage;
            }
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      console.error('Login failed with status', response.status, 'and message:', errorMessage);
      
      // Retry logic for specific error cases (server errors, connection issues)
      const shouldRetry = (
        // 5xx status codes indicate server errors that might be temporary
        (response.status >= 500 && response.status < 600) ||
        // Network errors that don't have a status code
        response.status === 0 ||
        // These are common temporary issues that might resolve on retry
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('network')
      );
      
      if (shouldRetry && retryCount < maxRetries) {
        console.log(`Retrying login after error (Attempt ${retryCount + 1}/${maxRetries})`);
        // Exponential backoff: 1s, 2s, 4s...
        const backoffTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return login(username, password, retryCount + 1, maxRetries);
      }
      
      // If we've exhausted retries or shouldn't retry, throw the error
      const error = new Error(errorMessage);
      // @ts-ignore - Add extra properties to the error
      error.status = response.status;
      // @ts-ignore
      error.data = errorData;
      // @ts-ignore
      error.retriesAttempted = retryCount;
      throw error;
    }
    
    // After successful login, check the session validity immediately
    // This helps catch "phantom login" issues where the session isn't properly established
    try {
      // Clone the response for later use
      const clonedResponse = response.clone();
      
      // Try to get user data to verify session is working
      const sessionVerifyResponse = await fetch('/api/auth/session-status', {
        credentials: 'include'
      });
      
      if (!sessionVerifyResponse.ok) {
        console.warn('Login appeared successful, but session verification failed:', 
                     sessionVerifyResponse.status);
      } else {
        const sessionData = await sessionVerifyResponse.json();
        console.log('Session verification successful:', sessionData);
      }
      
      // Immediately verify we can read the response by attempting to parse JSON
      try {
        const responseText = await response.text();
        console.log('Login response received, size:', responseText.length, 
                  'bytes, first 100 chars:', responseText.substring(0, 100));
        
        // Try to validate it's proper JSON
        try {
          const parsedJson = JSON.parse(responseText);
          console.log('Response is valid JSON with user ID:', parsedJson.id);
          
          // Double-verify the user data can be fetched with the new session
          setTimeout(async () => {
            try {
              const userCheckResponse = await fetch('/api/auth/user', { 
                credentials: 'include' 
              });
              console.log('Post-login user check status:', userCheckResponse.status);
            } catch (e) {
              console.error('Post-login user verification failed:', e);
            }
          }, 500);
          
        } catch (jsonError) {
          console.warn('Response is not valid JSON:', jsonError);
        }
      } catch (e) {
        console.error("Warning: Response body could not be read", e);
      }
      
      console.log('Login successful');
      return clonedResponse;
      
    } catch (sessionError) {
      console.error('Error during post-login session verification:', sessionError);
      
      // Still return the original response if the verification fails
      // but we've already confirmed the login was successful
      const clonedResponse = response.clone();
      return clonedResponse;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Login request timed out after 15 seconds');
      
      // Retry timeouts automatically
      if (retryCount < maxRetries) {
        console.log(`Retrying login after timeout (Attempt ${retryCount + 1}/${maxRetries})`);
        // Slightly longer delay for timeout retries
        const backoffTime = Math.pow(2, retryCount) * 1500;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return login(username, password, retryCount + 1, maxRetries);
      }
      
      throw new Error('Login request timed out. Please check your connection and try again.');
    }
    
    // For network errors, retry if not out of retries
    if (error.message.includes('network') && retryCount < maxRetries) {
      console.log(`Retrying login after network error (Attempt ${retryCount + 1}/${maxRetries})`);
      const backoffTime = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return login(username, password, retryCount + 1, maxRetries);
    }
    
    console.error('Login request error:', error);
    throw error;
  }
};

export const register = async (userData: any) => {
  return apiRequest('POST', '/api/auth/register', userData);
};

export const logout = async () => {
  return apiRequest('POST', '/api/auth/logout', {});
};

export const getCurrentUser = async () => {
  try {
    console.log('Attempting to fetch current user data');
    
    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const res = await fetch('/api/auth/user', {
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache', // Prevent caching
        'Pragma': 'no-cache'
      }
    });
    
    // Clear timeout since request completed
    clearTimeout(timeoutId);
    
    console.log('Current user fetch response status:', res.status);
    
    // Handle authentication errors
    if (res.status === 401) {
      console.log('User not authenticated (401)');
      return null;
    }
    
    if (!res.ok) {
      console.error('Error fetching user data:', res.status, res.statusText);
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }
    
    // Parse and validate user data
    try {
      const userData = await res.json();
      console.log('User data received:', userData ? 'Valid user object' : 'Empty user data');
      
      if (!userData || !userData.id) {
        console.warn('Invalid user data received:', userData);
        return null;
      }
      
      return userData;
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
      throw new Error('Failed to parse user data');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('User fetch request timed out');
      throw new Error('Connection timed out while fetching user data');
    }
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

// ASIC Mining API
export const getAsicTypes = async () => {
  const res = await fetch('/api/mining/asic/types', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch ASIC miner types');
  }
  
  return res.json();
};

export const configureAsicMining = async (asicType: string) => {
  const response = await apiRequest('POST', '/api/mining/asic/configure', { asicType });
  return response.json();
};

export const generateAsicUsbConfig = async (asicType: string, poolId: number, walletAddress: string) => {
  const response = await apiRequest('POST', '/api/mining/asic/generate-usb', { 
    asicType,
    poolId,
    walletAddress
  });
  return response.json();
};

// Function to generate a unified multi-miner USB configuration
export const generateMultiMinerUsbConfig = async (minerTypes: string[], poolId: number, walletAddress: string) => {
  const response = await apiRequest('POST', '/api/mining/asic/generate-multi-usb', { 
    minerTypes,
    poolId,
    walletAddress
  });
  return response.json();
};

// Withdrawal request for regular users
export const withdrawRequest = async (amount: number, destinationAddress: string) => {
  // Convert BTC amount (float) to satoshis (integer)
  const satoshis = Math.floor(amount * 100000000);
  
  console.log(`Submitting withdrawal request for ${amount} BTC (${satoshis} satoshis) to ${destinationAddress}`);
  
  const response = await apiRequest('POST', '/api/wallet/withdraw-request', {
    amount: satoshis,
    destinationAddress
  });
  
  return response.json();
};

// Cloud Mining API
export const getCloudProviders = async () => {
  const res = await fetch('/api/mining/cloud/providers', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch cloud mining providers');
  }
  
  return res.json();
};

export const configureCloudMining = async (
  provider: string, 
  apiKey: string, 
  apiSecret: string,
  hashPowerAmount: number
) => {
  const response = await apiRequest('POST', '/api/mining/cloud/configure', {
    provider,
    apiKey,
    apiSecret,
    hashPowerAmount
  });
  return response.json();
};

export const getCloudMiningStatus = async () => {
  const res = await fetch('/api/mining/cloud/status', {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch cloud mining status');
  }
  
  return res.json();
};

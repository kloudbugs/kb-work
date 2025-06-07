import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Mock Bitcoin keys for display
const BITCOIN_KEYS = [
  {
    id: 1,
    privateKey: '5KQFVHAxyMMHCzVzNGY7Em9yyZ9nzENWy9ViCk8oYN1XSG8zQQF',
    publicKey: '04a7d66528d34ce4d1e5ddb6f190c72a78855388d870566e5d3356d3e5914c0e87d1e9b5aca8f9aa42158cf0906298c318a3caba9082394fd3b21169232022a7c4',
    address: '1JTDaKatQPQCYCkxMZ8wLkJe5Xsz1S4Zp4',
    compressed: true,
    balance: 0.00000000
  },
  {
    id: 2,
    privateKey: '5JjvGMBwYYEp6fJJUfV4BMBnJ2e2QDn4qwUcShLgDRBzE7TPEaM',
    publicKey: '04d0de0aaeaefad02b8bdc8a01a1b8b11c696bd3d66a2c5f10780d95b7df42645cd85228a6fb29940e858e7e55842ae2bd115d1ed7cc0e82d934e929c97648cb0d',
    address: '1GtQAjxiMiqmfxT5dK1P3KfvAhtfKYTvLi',
    compressed: true,
    balance: 0.00000000
  },
  {
    id: 3,
    privateKey: '5KXG9QULJ7gNnAGMK7LSsRXCPYhGED1bWVY4QRU2C8c7sTYy3EH',
    publicKey: '04b325e9f0a700eb138cc9161e5289c1d7daf9d947c2343a7e6aeb063aea1f83c9f7f6ddbd6b147e3e5f1cd9cd2a1363f3c6bc4b5645182de274da4bdd578f2e0d',
    address: '193P6LtvS4nCnkDvM9uXn1gsSRqh4aDAz7',
    compressed: true,
    balance: 0.00000000
  },
  {
    id: 4,
    privateKey: '5JUK3qj2xLfyxBSsN3JpYCQq5LER61YkhYnGJ4RAWb7dAgvbcwK',
    publicKey: '043b1f720732c50c18b5767e15a7f223514485f24c6403baa9a3e617b9f608057f5ef44146ae3dcf11dbe9527f8ec857a4dc3ba0ed19c6a9caa5f33d0cb075b742',
    address: '1MrpoVBJ33UgfVHxJYyvihD8VAkS5Btn4f',
    compressed: true,
    balance: 0.00000000
  },
  {
    id: 5,
    privateKey: '5JnADMvWfJcPV4YQcZz1uYBJWzNbNrNj5XmQmPmHYYxPWjZ3MVE',
    publicKey: '04ca3e99140f68e72c78295cebc0a38c1a7182ab628e8e8b6facbc807dc19b3d89a951a69a1ecb33fba71351a3d0a3a3cfebce88831265a7bc14477fcf51c0b890',
    address: '1QKBaU6WAcx4nKYsL128HwuTJMbwvG3JVi',
    compressed: true,
    balance: 0.00000000
  }
];

// Bitcoin puzzles
const PUZZLES = [
  {
    id: 1,
    title: 'The Vanity Address',
    description: 'Find a Bitcoin address that starts with "1PUZZLE"',
    difficulty: 'Medium',
    reward: '0.01 BTC',
    status: 'Unsolved',
    hint: 'Use a vanity address generator to create an address with the specified prefix.'
  },
  {
    id: 2,
    title: 'Hash Collision Challenge',
    description: 'Find two different inputs that produce the same SHA-256 hash output',
    difficulty: 'Hard',
    reward: '0.05 BTC',
    status: 'Unsolved',
    hint: 'Explore the birthday paradox and collision finding algorithms.'
  },
  {
    id: 3,
    title: 'The Private Key Hunt',
    description: 'Decrypt the private key using the provided clues and claim the funds',
    difficulty: 'Expert',
    reward: '0.1 BTC',
    status: 'Unsolved',
    hint: 'The key is encoded with a simple substitution cipher based on the Fibonacci sequence.'
  },
  {
    id: 4,
    title: 'Satoshi\'s Message',
    description: 'Find the hidden message in the blockchain starting at block 54321',
    difficulty: 'Medium',
    reward: '0.02 BTC',
    status: 'Unsolved',
    hint: 'Look at the OP_RETURN data in the transactions of consecutive blocks.'
  },
  {
    id: 5,
    title: 'The Merkle Tree Challenge',
    description: 'Reconstruct the Merkle tree from the provided partial information',
    difficulty: 'Hard',
    reward: '0.03 BTC',
    status: 'Unsolved',
    hint: 'You need to compute the missing hashes based on the properties of a binary Merkle tree.'
  },
];

export default function BitcoinDatabase() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof BITCOIN_KEYS>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10000); // Simulate large database
  const [selectedKey, setSelectedKey] = useState<typeof BITCOIN_KEYS[0] | null>(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState<typeof PUZZLES[0] | null>(null);
  const [lotteryKey, setLotteryKey] = useState({
    privateKey: '',
    publicKey: '',
    address: '',
    balance: 0
  });
  
  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Search Error',
        description: 'Please enter a search query.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      let results;
      
      if (searchQuery.length === 64 || searchQuery.length === 51 || searchQuery.length === 52) {
        // Searching for private key
        results = BITCOIN_KEYS.filter(key => key.privateKey.includes(searchQuery));
      } else if (searchQuery.length > 25 && searchQuery.length < 35) {
        // Searching for address
        results = BITCOIN_KEYS.filter(key => key.address.includes(searchQuery));
      } else {
        // Generic search
        results = BITCOIN_KEYS.filter(key => 
          key.privateKey.includes(searchQuery) || 
          key.publicKey.includes(searchQuery) || 
          key.address.includes(searchQuery)
        );
      }
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: 'No Results Found',
          description: 'No keys matching your search criteria were found in the database.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Search Complete',
          description: `Found ${results.length} keys matching your criteria.`
        });
      }
    }, 1500);
  };
  
  // Generate lottery key
  const generateLotteryKey = () => {
    // Simulate key generation delay
    setLotteryKey({
      privateKey: '',
      publicKey: '',
      address: '',
      balance: 0
    });
    
    setTimeout(() => {
      // Generate random private key (just for display)
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      const privateKey = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // For demo purposes, we'll use one of our mock keys
      const randomIndex = Math.floor(Math.random() * BITCOIN_KEYS.length);
      const mockKey = BITCOIN_KEYS[randomIndex];
      
      setLotteryKey({
        privateKey: mockKey.privateKey,
        publicKey: mockKey.publicKey,
        address: mockKey.address,
        balance: 0 // Always 0 for demo
      });
      
      toast({
        title: 'Key Generated',
        description: 'A new Bitcoin key pair has been generated for the lottery.'
      });
    }, 2000);
  };
  
  // View key details
  const viewKeyDetails = (key: typeof BITCOIN_KEYS[0]) => {
    setSelectedKey(key);
  };
  
  // View puzzle details
  const viewPuzzleDetails = (puzzle: typeof PUZZLES[0]) => {
    setSelectedPuzzle(puzzle);
  };
  
  // Handle pagination
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    // In a real app, we would fetch the data for the new page here
  };
  
  return (
    <div className="bitcoin-database">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="database">Bitcoin Database</TabsTrigger>
          <TabsTrigger value="search">Key Search</TabsTrigger>
          <TabsTrigger value="puzzles">Crypto Puzzles</TabsTrigger>
          <TabsTrigger value="lottery">Bitcoin Lottery</TabsTrigger>
        </TabsList>
        
        {/* Bitcoin Database Tab */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Key Database</CardTitle>
              <CardDescription>
                Explore our comprehensive database of Bitcoin private keys and addresses.
                This database is for educational purposes only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages.toLocaleString()} ({(totalPages * 5).toLocaleString()} keys)
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">{currentPage}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Private Key (WIF)</th>
                      <th className="text-left py-3 px-4">Bitcoin Address</th>
                      <th className="text-left py-3 px-4">Balance</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BITCOIN_KEYS.map((key) => (
                      <tr key={key.id} className="border-b">
                        <td className="py-3 px-4 font-mono text-xs truncate max-w-[200px]">{key.privateKey}</td>
                        <td className="py-3 px-4 font-mono text-xs">{key.address}</td>
                        <td className="py-3 px-4">{key.balance.toFixed(8)} BTC</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" onClick={() => viewKeyDetails(key)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Database Information</h3>
                <div className="text-sm space-y-1">
                  <p>This database contains private keys and addresses for educational purposes.</p>
                  <p>Total entries: {(totalPages * 5).toLocaleString()}</p>
                  <p>Range: Keys from 1 to 2^51</p>
                  <p><strong>Disclaimer:</strong> Searching for Bitcoin private keys with funds is equivalent to trying to find a specific grain of sand in the Sahara desert. The probability is extremely low.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedKey && (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Key Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedKey(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Private Key (WIF)</Label>
                    <div className="font-mono text-xs mt-1 p-2 bg-muted rounded-md">{selectedKey.privateKey}</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Public Key (Hex)</Label>
                    <div className="font-mono text-xs mt-1 p-2 bg-muted rounded-md overflow-x-auto">{selectedKey.publicKey}</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Bitcoin Address</Label>
                    <div className="font-mono text-xs mt-1 p-2 bg-muted rounded-md">{selectedKey.address}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Compressed</Label>
                      <div className="mt-1">{selectedKey.compressed ? 'Yes' : 'No'}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Balance</Label>
                      <div className="mt-1">{selectedKey.balance.toFixed(8)} BTC</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline">Check Balance</Button>
                    <Button variant="default">Add to Watchlist</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Key Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Key Search</CardTitle>
              <CardDescription>
                Search our database for specific Bitcoin keys or addresses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter private key, public key, or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-md">
                    <div className="font-medium mb-1">Private Key (WIF)</div>
                    <div className="text-sm text-muted-foreground">Search by WIF format private key</div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="font-medium mb-1">Bitcoin Address</div>
                    <div className="text-sm text-muted-foreground">Search by Bitcoin address</div>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="font-medium mb-1">Public Key</div>
                    <div className="text-sm text-muted-foreground">Search by hexadecimal public key</div>
                  </div>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Search Results</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Private Key (WIF)</th>
                            <th className="text-left py-3 px-4">Bitcoin Address</th>
                            <th className="text-left py-3 px-4">Balance</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((key) => (
                            <tr key={key.id} className="border-b">
                              <td className="py-3 px-4 font-mono text-xs truncate max-w-[200px]">{key.privateKey}</td>
                              <td className="py-3 px-4 font-mono text-xs">{key.address}</td>
                              <td className="py-3 px-4">{key.balance.toFixed(8)} BTC</td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm" onClick={() => viewKeyDetails(key)}>
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Crypto Puzzles Tab */}
        <TabsContent value="puzzles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crypto Puzzles</CardTitle>
              <CardDescription>
                Test your cryptographic skills with these blockchain challenges.
                Solve the puzzles to win Bitcoin rewards!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PUZZLES.map((puzzle) => (
                  <div 
                    key={puzzle.id} 
                    className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => viewPuzzleDetails(puzzle)}
                  >
                    <h3 className="font-medium mb-2">{puzzle.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{puzzle.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="px-2 py-0.5 bg-muted rounded-full">{puzzle.difficulty}</span>
                      <span className="font-medium">{puzzle.reward}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">How Puzzles Work</h3>
                <div className="text-sm space-y-2">
                  <p>Each puzzle presents a unique cryptographic challenge related to Bitcoin and blockchain technology.</p>
                  <p>When you solve a puzzle, you gain access to a private key that controls the Bitcoin reward.</p>
                  <p>Puzzles range from beginner-friendly to expert-level challenges.</p>
                  <p>Join our community to discuss approaches and share hints with other puzzle solvers!</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedPuzzle && (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{selectedPuzzle.title}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPuzzle(null)}>Close</Button>
                </div>
                <CardDescription>{selectedPuzzle.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <div className="mt-1">{selectedPuzzle.description}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Difficulty</Label>
                      <div className="mt-1">{selectedPuzzle.difficulty}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Reward</Label>
                      <div className="mt-1">{selectedPuzzle.reward}</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Hint</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">{selectedPuzzle.hint}</div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Submit Solution</h3>
                    <div className="space-y-3">
                      <Input placeholder="Enter your solution (private key or address)" />
                      <Button className="w-full">Submit Solution</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Bitcoin Lottery Tab */}
        <TabsContent value="lottery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Key Lottery</CardTitle>
              <CardDescription>
                Generate random Bitcoin private keys and check if they control any funds.
                It's like finding a needle in a haystack, but with extremely low odds!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    className="animate-pulse"
                    onClick={generateLotteryKey}
                  >
                    Generate Random Key
                  </Button>
                </div>
                
                {lotteryKey.privateKey && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <div>
                      <Label className="text-sm text-muted-foreground">Private Key (WIF)</Label>
                      <div className="font-mono text-xs mt-1 p-2 bg-muted rounded-md">{lotteryKey.privateKey}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Bitcoin Address</Label>
                      <div className="font-mono text-xs mt-1 p-2 bg-muted rounded-md">{lotteryKey.address}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Balance</Label>
                      <div className="mt-1 text-xl font-bold">{lotteryKey.balance.toFixed(8)} BTC</div>
                      {lotteryKey.balance > 0 ? (
                        <div className="text-green-500 text-sm">Congratulations! This key has a balance!</div>
                      ) : (
                        <div className="text-muted-foreground text-sm">This key has no balance. Try again!</div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Understanding the Odds</h3>
                  <div className="text-sm space-y-2">
                    <p>The total number of possible Bitcoin private keys is 2^256, which is an astronomically large number.</p>
                    <p>For comparison, the total number of atoms in the observable universe is estimated to be 10^80 (or 2^266).</p>
                    <p>The chance of randomly generating a key that controls any funds is extremely small - far less than winning the lottery multiple times in a row.</p>
                    <p>This tool is for educational purposes only to demonstrate the security of Bitcoin's cryptography.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lottery Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Successful Finds</div>
                  </div>
                  
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-3xl font-bold">427,844</div>
                    <div className="text-sm text-muted-foreground">Keys Generated</div>
                  </div>
                  
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-3xl font-bold">0.0000%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-3xl font-bold">2^256</div>
                    <div className="text-sm text-muted-foreground">Key Space Size</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Keyspace Explored</span>
                    <span>0.0000000000000000000000000000000001%</span>
                  </div>
                  <Progress value={0.000000001} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Community Lottery Results</h3>
                  <div className="space-y-2">
                    <div className="p-2 border rounded-md flex justify-between">
                      <span className="font-mono text-xs">1Pvs9S7sGMR...</span>
                      <span className="text-green-500 font-medium">0.05234 BTC</span>
                    </div>
                    <div className="p-2 border rounded-md flex justify-between">
                      <span className="font-mono text-xs">3K5HzxRJ7s2...</span>
                      <span className="text-green-500 font-medium">0.00123 BTC</span>
                    </div>
                    <div className="p-2 border rounded-md flex justify-between">
                      <span className="font-mono text-xs">bc1qerty32z...</span>
                      <span className="text-green-500 font-medium">0.00012 BTC</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    * Note: These results are for demonstration purposes only and do not represent actual finds.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
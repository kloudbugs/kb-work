import { Link } from "wouter";
import { useState } from "react";

export default function TeraToken() {
  const [amount, setAmount] = useState(100);
  const tokenPrice = 0.00012;
  const estimatedTokens = (amount / tokenPrice).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo1.png" alt="KloudBugs Logo" className="h-12 mr-3" />
          <h1 className="text-2xl font-bold">KloudBugs</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/mining" className="hover:text-primary">Mining</Link></li>
            <li><Link href="/tera" className="hover:text-primary">TERA Token</Link></li>
            <li><Link href="/tera-info" className="hover:text-primary">Civil Rights</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold mb-6">TERA Token</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            The first cryptocurrency dedicated to supporting civil rights initiatives through direct funding and legal support.
          </p>
          <div className="flex justify-center gap-4 mb-10">
            <Link href="/tera-info" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition">
              Learn More
            </Link>
            <a href="#buy" className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition">
              Buy Tokens
            </a>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 rounded-xl inline-block mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Current Price</p>
                <p className="text-2xl font-bold">$0.00012</p>
              </div>
              <div className="h-12 w-px bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-300">24h Change</p>
                <p className="text-2xl font-bold text-green-400">+5.3%</p>
              </div>
              <div className="h-12 w-px bg-gray-600"></div>
              <div>
                <p className="text-sm text-gray-300">Market Cap</p>
                <p className="text-2xl font-bold">$42.3M</p>
              </div>
            </div>
          </div>
        </section>

        <section id="buy" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Buy TERA Tokens</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Token Purchase</h3>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Amount to Spend (USD)</label>
                  <input
                    type="number"
                    min="10"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium">Wallet Address (Solana)</label>
                  <input
                    type="text"
                    placeholder="Enter your Solana wallet address"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <p className="text-sm text-gray-400 mt-1">Tokens will be sent to this address after purchase</p>
                </div>
                <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition">
                  Buy Tokens
                </button>
              </div>
              <div className="bg-gray-700/30 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Purchase Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Price:</span>
                    <span>${tokenPrice.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span>${(amount * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
                    <span>Estimated Tokens:</span>
                    <span>{Number(estimatedTokens).toLocaleString()} TERA</span>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Fee Breakdown:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Network Fee:</span>
                      <span>5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Token Creation:</span>
                      <span>15%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Liquidity Pool:</span>
                      <span>30%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Civil Rights Fund:</span>
                      <span>10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>1%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Development:</span>
                      <span>39%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">TERA Tokenomics</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Token Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Public Sale</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Civil Rights Fund</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Team & Development</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Liquidity Pool</span>
                      <span>10%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Marketing & Partnerships</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Advisors</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Token Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Token Name:</span>
                    <span className="font-medium">TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Token Type:</span>
                    <span className="font-medium">Solana SPL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Supply:</span>
                    <span className="font-medium">100,000,000,000 TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Circulating Supply:</span>
                    <span className="font-medium">86,500,000,000 TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Initial Price:</span>
                    <span className="font-medium">$0.00005</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Price:</span>
                    <span className="font-medium">$0.00012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Launch Date:</span>
                    <span className="font-medium">January 15, 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} KloudBugs. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
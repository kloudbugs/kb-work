import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebsiteLayout from "./WebsiteLayout";
import { CosmicSlideshow } from "@/components/ui/CosmicSlideshow";

export default function TeraInfo() {
  const features = [
    {
      title: "Advanced Blockchain Architecture",
      description: "Tera utilizes a cutting-edge blockchain with improved scalability and transaction speeds."
    },
    {
      title: "Peer-to-Peer Transactions",
      description: "Direct transfers between users without intermediaries, ensuring privacy and lower fees."
    },
    {
      title: "Smart Contract Capability",
      description: "Support for complex programmable agreements and decentralized applications."
    },
    {
      title: "Eco-Friendly Mining",
      description: "Energy-efficient consensus mechanism that reduces environmental impact."
    }
  ];

  return (
    <WebsiteLayout>
      <div>
        {/* Cosmic Slideshow Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 lg:order-2">
                <CosmicSlideshow className="h-[400px] shadow-2xl shadow-blue-500/20 border border-blue-500/30" />
              </div>
              <div className="lg:col-span-7 lg:order-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white" style={{ 
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}>
                  EXPLORE THE COSMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">BLOCKCHAIN</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Journey through the digital universe where technology meets limitless possibility.
                </p>
              </div>
            </div>
          </div>
          
          {/* Background star effect */}
          <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
          <div className="absolute inset-0 z-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[1px] h-[1px] rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  boxShadow: `0 0 ${Math.random() * 3 + 1}px ${Math.random() * 3 + 1}px rgba(255,255,255,${Math.random() * 0.7 + 0.3})`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>
        </section>
        
        {/* Civil Rights Mission */}
        <section className="py-20 bg-gradient-to-b from-black to-purple-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-10 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>SOCIAL JUSTICE MISSION</h2>
              <p className="text-lg text-gray-300">
                Supporting families worldwide who need help and answers
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-gray-900/60 p-8 rounded-xl border border-purple-500/20 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-purple-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADVOCACY THROUGH BLOCKCHAIN</h3>
                  <p className="text-gray-300 mb-4">
                    The TERA token was created with a higher purpose beyond cryptocurrency innovation. At its core, TERA is dedicated to bringing justice for families worldwide who need help and answers.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Through our blockchain technology, we create transparent systems that help advocate for those who have been marginalized or forgotten by traditional systems.
                  </p>
                  <p className="text-gray-300 mb-4">
                    A portion of all TERA token transactions is allocated to supporting legal resources, community education, and direct assistance to families in need.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Learn About Our Advocacy
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent pointer-events-none"></div>
                    <img 
                      src="/attached_assets/146DFB52-35C2-46E6-966A-ABDA69B3A96A.PNG" 
                      alt="The faces of our mission - families and children" 
                      className="max-w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Core Mission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
            
        {/* Token Economics */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>TOKEN ECONOMICS</h2>
              <p className="text-lg text-gray-300">
                A sustainable economic model designed for long-term growth
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Supply</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">100M</p>
                  <p className="text-gray-400 mt-2">Fixed maximum supply</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Circulation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">68M</p>
                  <p className="text-gray-400 mt-2">Currently circulating</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Burn Rate</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">2%</p>
                  <p className="text-gray-400 mt-2">Per transaction</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Use Cases */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Real-World Use Cases</h2>
              <p className="text-lg text-gray-300">
                Tera is designed for practical applications in various industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Decentralized Finance</h3>
                <p className="text-gray-300 mb-4">
                  Used for lending, borrowing, and earning yield in DeFi protocols. Tera's smart contract capabilities enable complex financial products.
                </p>
                <Button variant="link" className="text-blue-400 p-0 hover:text-blue-300">Learn more →</Button>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">E-Commerce</h3>
                <p className="text-gray-300 mb-4">
                  Fast, low-fee payments for online purchases. Integration with major e-commerce platforms allows for seamless Tera payments.
                </p>
                <Button variant="link" className="text-blue-400 p-0 hover:text-blue-300">Learn more →</Button>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Gaming & NFTs</h3>
                <p className="text-gray-300 mb-4">
                  In-game currency and NFT marketplace transactions. Tera enables true ownership of digital assets in gaming ecosystems.
                </p>
                <Button variant="link" className="text-blue-400 p-0 hover:text-blue-300">Learn more →</Button>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Cross-Border Payments</h3>
                <p className="text-gray-300 mb-4">
                  International transfers without the delays and fees of traditional banking. Send value globally in minutes instead of days.
                </p>
                <Button variant="link" className="text-blue-400 p-0 hover:text-blue-300">Learn more →</Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join the Tera Ecosystem?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're an investor, developer, or user, there's a place for you in the growing Tera community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Buy TERA Token
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Join Community
              </Button>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
}
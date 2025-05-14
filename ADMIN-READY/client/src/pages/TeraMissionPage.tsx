import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Gavel, Users, Star, BarChart3, Gift, Zap } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export function TeraMissionPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Floating particles in background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-amber-500/20"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: 'blur(1px)'
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Hero Section with Mission Statement */}
        <div className="relative mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Mission
          </motion.h1>
          
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="text-xl text-gray-300 mb-6">
              The TERA Token exists to create sustainable funding for legal accountability and social justice initiatives through the power of blockchain technology. Named after Tera Ann Harris, our token embeds social impact directly into its design.
            </p>
            
            <div className="relative inline-block">
              <motion.div 
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-500/30 to-yellow-400/30 blur-md"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <Button className="relative bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white border-none">
                Join Our Movement
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Mission Pillars */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full bg-black/40 backdrop-blur-sm border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                  <Gavel className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-xl text-amber-400">Legal Accountability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We support initiatives that promote transparency and accountability in law enforcement and the legal system, ensuring equal justice for all.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full bg-black/40 backdrop-blur-sm border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                  <Heart className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-xl text-amber-400">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We provide direct assistance to families affected by police violence, helping them navigate legal, financial, and emotional challenges.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full bg-black/40 backdrop-blur-sm border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-xl text-amber-400">Policy Reform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We advocate for systemic changes in policing practices, including improved training, independent oversight, and community-led initiatives.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* How TERA Works */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">How TERA Makes An Impact</h2>
          
          <Card className="bg-black/40 backdrop-blur-sm border-amber-500/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">Tokenomics With Purpose</h3>
                  <p className="text-gray-300 mb-4">
                    The TERA Token has a unique economic model that directs 33% of all mining rewards 
                    toward our mission-driven initiatives. This creates a sustainable funding mechanism 
                    that grows alongside our community.
                  </p>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-amber-500">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Transparent Allocation</h4>
                        <p className="text-sm text-gray-400">All fund allocations are publicly verifiable on the blockchain</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-amber-500">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Community Governance</h4>
                        <p className="text-sm text-gray-400">Token holders can vote on which initiatives receive funding</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 mr-3 text-amber-500">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Quarterly Grants</h4>
                        <p className="text-sm text-gray-400">Organizations working on legal accountability can apply for funding</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">Impact Metrics</h3>
                  <p className="text-gray-300 mb-6">
                    We measure our success not by market capitalization but by real-world impact. 
                    Our transparent reporting system tracks how TERA Token funds are used and what 
                    they accomplish.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                      <div className="text-2xl font-bold text-amber-400 mb-1">12+</div>
                      <div className="text-sm text-gray-300">Legal cases supported</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                      <div className="text-2xl font-bold text-amber-400 mb-1">23</div>
                      <div className="text-sm text-gray-300">Families assisted</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                      <div className="text-2xl font-bold text-amber-400 mb-1">4</div>
                      <div className="text-sm text-gray-300">Policy reforms advanced</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                      <div className="text-2xl font-bold text-amber-400 mb-1">8,500+</div>
                      <div className="text-sm text-gray-300">Community members</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How to Join */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 backdrop-blur-sm border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Join The TERA Mission</CardTitle>
              <CardDescription className="text-center text-gray-400">
                There are multiple ways to support our work for justice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-lg bg-black/30 border border-amber-500/20">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-amber-400 mb-2">Mine TERA</h3>
                  <p className="text-sm text-gray-300">
                    Contribute computing power to our network and earn TERA tokens while supporting our mission.
                  </p>
                  <Button variant="outline" className="mt-4 w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                    Start Mining
                  </Button>
                </div>
                
                <div className="p-5 rounded-lg bg-black/30 border border-amber-500/20">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-amber-400 mb-2">Join Community</h3>
                  <p className="text-sm text-gray-300">
                    Become part of our governance system and help decide which initiatives receive funding.
                  </p>
                  <Button variant="outline" className="mt-4 w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                    Join DAO
                  </Button>
                </div>
                
                <div className="p-5 rounded-lg bg-black/30 border border-amber-500/20">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center mb-3">
                    <Heart className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-amber-400 mb-2">Spread Awareness</h3>
                  <p className="text-sm text-gray-300">
                    Help us grow our community by sharing Tera's story and the mission of the TERA token.
                  </p>
                  <Button variant="outline" className="mt-4 w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                    Share Story
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default TeraMissionPage;
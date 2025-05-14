import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Shield, Zap, Server, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';

export default function ZigGuardians() {
  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Crown className="h-16 w-16 text-amber-500" />
            <Sparkles 
              className="h-8 w-8 text-yellow-300 absolute"
              style={{ right: '-10px', top: '-5px' }}
            />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ZIG Guardians Command Center
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Premium guardians with special privileges and direct oracle access
        </motion.p>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-amber-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-950/40 data-[state=active]:text-amber-400">Overview</TabsTrigger>
            <TabsTrigger value="privileges" className="data-[state=active]:bg-amber-950/40 data-[state=active]:text-amber-400">Special Privileges</TabsTrigger>
            <TabsTrigger value="oracle" className="data-[state=active]:bg-amber-950/40 data-[state=active]:text-amber-400">Oracle Access</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-amber-950/40 data-[state=active]:text-amber-400">Network Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-400">ZIG Guardian Program</CardTitle>
                <CardDescription>Elite members with advanced validation capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  ZIG Guardians represent the highest tier of our guardian program, with direct connection 
                  to network oracles and advanced validation capabilities. They help maintain the integrity 
                  of the KLOUD BUGS ecosystem and receive exclusive rewards.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30">
                    <h3 className="font-medium text-amber-400 mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Network Protection
                    </h3>
                    <p className="text-sm text-gray-400">Monitor and verify transactions at the highest level</p>
                  </div>
                  
                  <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30">
                    <h3 className="font-medium text-amber-400 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Enhanced Mining
                    </h3>
                    <p className="text-sm text-gray-400">Priority access to mining rewards and special bonuses</p>
                  </div>
                  
                  <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30">
                    <h3 className="font-medium text-amber-400 mb-2 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Oracle Access
                    </h3>
                    <p className="text-sm text-gray-400">Direct connection to network oracles for validation</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-amber-800/20 bg-amber-950/10 flex justify-between">
                <div className="text-sm text-gray-400">
                  Status: <Badge variant="outline" className="ml-2 bg-amber-900/30 text-amber-400 border-amber-500/40">Training in Progress</Badge>
                </div>
                <Button variant="outline" className="border-amber-500/30 hover:bg-amber-900/30 hover:text-amber-300">
                  Apply for Membership
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-400">Guardian Training Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Protocol Training</span>
                      <span className="text-amber-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-amber-950/40" indicatorClassName="bg-gradient-to-r from-amber-600 to-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Oracle Integration</span>
                      <span className="text-amber-400">62%</span>
                    </div>
                    <Progress value={62} className="h-2 bg-amber-950/40" indicatorClassName="bg-gradient-to-r from-amber-600 to-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Advanced Security</span>
                      <span className="text-amber-400">78%</span>
                    </div>
                    <Progress value={78} className="h-2 bg-amber-950/40" indicatorClassName="bg-gradient-to-r from-amber-600 to-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-400">Guardian Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30 flex flex-col items-center justify-center">
                      <Users className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-2xl font-bold text-amber-300">7</span>
                      <span className="text-xs text-gray-400">Active Guardians</span>
                    </div>
                    
                    <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30 flex flex-col items-center justify-center">
                      <Shield className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-2xl font-bold text-amber-300">94.3%</span>
                      <span className="text-xs text-gray-400">Network Security</span>
                    </div>
                    
                    <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30 flex flex-col items-center justify-center">
                      <Zap className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-2xl font-bold text-amber-300">2.5x</span>
                      <span className="text-xs text-gray-400">Mining Boost</span>
                    </div>
                    
                    <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-800/30 flex flex-col items-center justify-center">
                      <Server className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-2xl font-bold text-amber-300">3</span>
                      <span className="text-xs text-gray-400">Active Oracles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="privileges" className="mt-6">
            <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-400">Special Privileges</CardTitle>
                <CardDescription>Exclusive benefits for ZIG Guardians</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  As a ZIG Guardian, you receive access to special privileges and enhanced capabilities within the KLOUD BUGS ecosystem.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Enhanced Mining Capabilities</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>2.5x boost to mining rewards on all devices</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Priority access to new mining blocks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Reduced energy consumption for mining operations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Special mining pools with higher efficiency</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Platform Administration</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Transaction validation and verification privileges</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Network monitoring and security tools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Participation in governance decisions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Early access to new features and platform updates</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Financial Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Special token allocations from new blocks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Reduced transaction fees across the network</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Guardian staking pool with enhanced returns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Monthly reward distributions for active guardians</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Community Status</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Exclusive Guardian badge and profile recognition</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Access to Guardian-only communication channels</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Ability to mentor new community members</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Invitation to exclusive virtual and in-person events</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="oracle" className="mt-6">
            <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-400">Oracle Access</CardTitle>
                <CardDescription>Direct connection to network oracles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  ZIG Guardians have direct access to network oracles, providing real-time validation and verification capabilities.
                </p>
                
                <div className="p-6 border border-amber-800/30 rounded-lg bg-gradient-to-br from-amber-950/30 to-transparent mb-6">
                  <h3 className="text-lg font-medium text-amber-400 mb-4">Oracle Connection Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-amber-800/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400 font-medium">Oracle Alpha</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/40">Online</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-green-400">99.7%</span>
                        </div>
                        <Progress value={99.7} className="h-1 bg-black/40" indicatorClassName="bg-green-500" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Load</span>
                          <span className="text-green-400">42%</span>
                        </div>
                        <Progress value={42} className="h-1 bg-black/40" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg border border-amber-800/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400 font-medium">Oracle Beta</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/40">Online</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-green-400">98.2%</span>
                        </div>
                        <Progress value={98.2} className="h-1 bg-black/40" indicatorClassName="bg-green-500" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Load</span>
                          <span className="text-green-400">37%</span>
                        </div>
                        <Progress value={37} className="h-1 bg-black/40" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg border border-amber-800/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-400 font-medium">Oracle Gamma</span>
                        <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-500/40">Maintenance</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-amber-400">87.5%</span>
                        </div>
                        <Progress value={87.5} className="h-1 bg-black/40" indicatorClassName="bg-amber-500" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Load</span>
                          <span className="text-amber-400">18%</span>
                        </div>
                        <Progress value={18} className="h-1 bg-black/40" indicatorClassName="bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Oracle Capabilities</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Real-time transaction validation and verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Network consensus participation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Block confirmation and chain validation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Advanced security monitoring and threat detection</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Oracle Training</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      ZIG Guardians undergo specialized training to effectively utilize oracle capabilities:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Advanced network protocol training</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Oracle interface and command system mastery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Consensus mechanism understanding</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        <span>Crisis response and security threat management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="network" className="mt-6">
            <Card className="border border-amber-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-400">Network Status</CardTitle>
                <CardDescription>Real-time network monitoring and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center bg-amber-950/20 p-4 rounded-lg border border-amber-800/30 mb-6">
                  <div className="text-amber-400 font-medium">Network Health</div>
                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/40 ml-2">Excellent</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-black/30 rounded-lg border border-amber-800/20 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-1">Network Uptime</div>
                    <div className="text-2xl font-bold text-amber-400">99.8%</div>
                    <Progress value={99.8} className="w-full h-1 mt-2 bg-black/40" indicatorClassName="bg-amber-500" />
                  </div>
                  
                  <div className="p-4 bg-black/30 rounded-lg border border-amber-800/20 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-1">Active Nodes</div>
                    <div className="text-2xl font-bold text-amber-400">1,247</div>
                    <Progress value={85} className="w-full h-1 mt-2 bg-black/40" indicatorClassName="bg-amber-500" />
                  </div>
                  
                  <div className="p-4 bg-black/30 rounded-lg border border-amber-800/20 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-1">Block Validation</div>
                    <div className="text-2xl font-bold text-amber-400">4.2s</div>
                    <Progress value={92} className="w-full h-1 mt-2 bg-black/40" indicatorClassName="bg-amber-500" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-4">Guardian Activity</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-black/30 p-3 rounded-lg border border-amber-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-amber-400 mr-2" />
                            <span className="text-sm font-medium text-amber-300">Guardian_Alpha</span>
                          </div>
                          <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/40">Active</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Blocks Verified:</span>
                            <span className="text-amber-300 ml-1">8,729</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Uptime:</span>
                            <span className="text-amber-300 ml-1">99.4%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className="text-green-400 ml-1">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-lg border border-amber-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-amber-400 mr-2" />
                            <span className="text-sm font-medium text-amber-300">Guardian_Omega</span>
                          </div>
                          <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/40">Active</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Blocks Verified:</span>
                            <span className="text-amber-300 ml-1">7,982</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Uptime:</span>
                            <span className="text-amber-300 ml-1">98.7%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className="text-green-400 ml-1">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-lg border border-amber-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-amber-400 mr-2" />
                            <span className="text-sm font-medium text-amber-300">Guardian_Delta</span>
                          </div>
                          <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-500/40">Standby</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Blocks Verified:</span>
                            <span className="text-amber-300 ml-1">6,451</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Uptime:</span>
                            <span className="text-amber-300 ml-1">95.2%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className="text-amber-400 ml-1">Idle</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-amber-800/30 rounded-lg p-4 bg-gradient-to-br from-amber-950/30 to-transparent">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">Recent Events</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start p-2 border-b border-amber-800/10">
                        <span className="text-green-400 mr-2">•</span>
                        <div>
                          <span className="text-gray-300">Block #893,241 verified by multiple guardians</span>
                          <span className="text-xs text-gray-500 block">Today, 03:24 AM</span>
                        </div>
                      </div>
                      <div className="flex items-start p-2 border-b border-amber-800/10">
                        <span className="text-amber-400 mr-2">•</span>
                        <div>
                          <span className="text-gray-300">Network throughput optimization initiated</span>
                          <span className="text-xs text-gray-500 block">Today, 02:17 AM</span>
                        </div>
                      </div>
                      <div className="flex items-start p-2 border-b border-amber-800/10">
                        <span className="text-green-400 mr-2">•</span>
                        <div>
                          <span className="text-gray-300">Oracle Gamma maintenance scheduled</span>
                          <span className="text-xs text-gray-500 block">Yesterday, 11:53 PM</span>
                        </div>
                      </div>
                      <div className="flex items-start p-2">
                        <span className="text-red-400 mr-2">•</span>
                        <div>
                          <span className="text-gray-300">Suspicious transaction detected and blocked</span>
                          <span className="text-xs text-gray-500 block">Yesterday, 10:29 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
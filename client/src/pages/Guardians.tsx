import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Award, Star, Crown, Sparkles, ChevronRight, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function Guardians() {
  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            KLOUD BUGS Guardian Program
          </motion.h1>
          <motion.p 
            className="text-lg text-center text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Elite members protecting and supporting the KLOUD BUGS ecosystem
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Tera-Guardians Card */}
          <Card className="overflow-hidden border-2 border-purple-500/20 bg-black/40 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent rounded-lg" />
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-8" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                  <div className="relative">
                    <Award className="w-6 h-6 text-white" />
                    <Star className="w-3 h-3 text-yellow-300 absolute -right-1 -top-1" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  Tera-Guardians
                </CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Elite protectors of the Tera ecosystem
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-4">
              <p className="text-gray-300">
                Tera-Guardians are chosen from our most dedicated community members. They help maintain network integrity and receive special privileges.
              </p>
              
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-800/30">
                  <h3 className="font-semibold text-purple-400 mb-1">Special Access</h3>
                  <p className="text-xs text-gray-400">Exclusive tools and resources</p>
                </div>
                <div className="bg-indigo-950/30 rounded-lg p-3 border border-indigo-800/30">
                  <h3 className="font-semibold text-indigo-400 mb-1">Enhanced Rewards</h3>
                  <p className="text-xs text-gray-400">Premium mining bonuses</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="relative flex justify-between items-center">
              <div className="flex items-center text-sm text-purple-400">
                <Users className="w-4 h-4 mr-1" />
                <span>Elite membership</span>
              </div>
              <Link href="/guardians/tera">
                <Button variant="outline" className="relative overflow-hidden border-purple-500/50 hover:border-purple-500 hover:bg-purple-950/30 group">
                  <span className="relative z-10">Enter Portal</span>
                  <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-900/20 to-indigo-800/20 transition-opacity" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* ZIG Card */}
          <Card className="overflow-hidden border-2 border-amber-500/20 bg-black/40 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-yellow-900/10 to-transparent rounded-lg" />
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-8" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded-lg">
                  <div className="relative">
                    <Crown className="w-6 h-6 text-white" />
                    <Sparkles className="w-3 h-3 text-yellow-300 absolute -right-1 -top-1" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
                  ZIG Guardians
                </CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Premium guardians with direct oracle access
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-4">
              <p className="text-gray-300">
                ZIG Guardians represent the highest tier of our guardian program, with direct connection to network oracles and advanced validation capabilities.
              </p>
              
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-amber-950/30 rounded-lg p-3 border border-amber-800/30">
                  <h3 className="font-semibold text-amber-400 mb-1">Oracle Access</h3>
                  <p className="text-xs text-gray-400">Direct validation capabilities</p>
                </div>
                <div className="bg-yellow-950/30 rounded-lg p-3 border border-yellow-800/30">
                  <h3 className="font-semibold text-yellow-400 mb-1">Priority Mining</h3>
                  <p className="text-xs text-gray-400">First access to new blocks</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="relative flex justify-between items-center">
              <div className="flex items-center text-sm text-amber-400">
                <Shield className="w-4 h-4 mr-1" />
                <span>Special status</span>
              </div>
              <Link href="/guardians/zig">
                <Button variant="outline" className="relative overflow-hidden border-amber-500/50 hover:border-amber-500 hover:bg-amber-950/30 group">
                  <span className="relative z-10">Enter Portal</span>
                  <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-900/20 to-yellow-800/20 transition-opacity" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-12 p-6 rounded-xl border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-indigo-400">Guardian Program Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-indigo-900/20 border border-indigo-800/30">
              <h3 className="font-semibold text-indigo-300 mb-2">Enhanced Mining Power</h3>
              <p className="text-gray-400 text-sm">Guardians receive boosted mining capabilities and priority access to new blocks.</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-800/30">
              <h3 className="font-semibold text-purple-300 mb-2">Ecosystem Protection</h3>
              <p className="text-gray-400 text-sm">Help secure and validate transactions across the network with enhanced security tools.</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800/30">
              <h3 className="font-semibold text-blue-300 mb-2">Community Leadership</h3>
              <p className="text-gray-400 text-sm">Take a leading role in governance decisions and future development directions.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
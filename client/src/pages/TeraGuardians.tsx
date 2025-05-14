import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function TeraGuardians() {
  return (
    <MainLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <Award className="h-16 w-16 text-purple-500" />
            <Star 
              className="h-8 w-8 text-amber-400 absolute"
              style={{ right: '-10px', top: '-5px' }}
            />
          </div>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tera-Guardians Portal
        </motion.h1>
        
        <motion.div 
          className="mt-8 p-6 rounded-xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Training in Progress</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            The Tera-Guardians program is currently in development. Our elite guardians are being trained 
            and prepared to protect the KLOUD BUGS ecosystem.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="relative w-64 h-6 bg-purple-950/50 rounded-full overflow-hidden border border-purple-800/30">
              <motion.div 
                className="absolute h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-300 font-medium">
                60% Complete
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-800/30">
            <h3 className="font-semibold text-purple-300 mb-2">Guardian Recruitment</h3>
            <p className="text-gray-400">Selection of elite members is underway.</p>
          </div>
          <div className="p-4 rounded-lg bg-indigo-900/20 border border-indigo-800/30">
            <h3 className="font-semibold text-indigo-300 mb-2">Protocol Development</h3>
            <p className="text-gray-400">Security protocols being established.</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800/30">
            <h3 className="font-semibold text-blue-300 mb-2">Training Program</h3>
            <p className="text-gray-400">Guardian training modules in progress.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
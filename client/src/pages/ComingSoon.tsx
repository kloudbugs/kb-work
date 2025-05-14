import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft, Clock, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function ComingSoon() {
  const [location, setLocation] = useLocation();
  
  // Extract page name from URL path
  const getPageName = () => {
    const path = location.split('/');
    const lastSegment = path[path.length - 1];
    
    // Format the page name
    if (lastSegment === 'zig') return 'ZIG Guardians';
    if (lastSegment === 'tera') return 'Tera-Guardians';
    if (lastSegment === 'guardians') return 'Guardians Portal';
    
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };
  
  const pageName = getPageName();
  
  return (
    <MainLayout>
      <div className="h-full flex items-center justify-center p-6">
        <motion.div 
          className="max-w-2xl w-full p-8 rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-950/30 via-indigo-950/20 to-blue-950/30 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <motion.div
                className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-600/20 to-indigo-600/30 flex items-center justify-center"
                animate={{ 
                  boxShadow: ['0 0 15px rgba(29, 78, 216, 0.2)', '0 0 30px rgba(29, 78, 216, 0.4)', '0 0 15px rgba(29, 78, 216, 0.2)'],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <Clock className="h-12 w-12 text-blue-400" />
              </motion.div>
              <motion.div 
                className="absolute -right-2 -top-2 h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 flex items-center justify-center"
                animate={{ 
                  boxShadow: ['0 0 10px rgba(79, 70, 229, 0.2)', '0 0 20px rgba(79, 70, 229, 0.4)', '0 0 10px rgba(79, 70, 229, 0.2)'],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Rocket className="h-5 w-5 text-indigo-400" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              {pageName} Coming Soon
            </h1>
            
            <p className="text-gray-400 mb-8 max-w-lg">
              The {pageName} section is currently in development. Our team is working hard to bring you an amazing experience.
            </p>
            
            <div className="space-y-4 w-full max-w-md">
              <div className="bg-blue-950/20 rounded-lg p-4 border border-blue-800/30">
                <h3 className="font-medium text-blue-400 text-sm mb-2">Development in Progress</h3>
                <div className="h-2 w-full bg-blue-950/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Development</span>
                  <span>60% Complete</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30 text-blue-400 hover:text-blue-300"
                onClick={() => setLocation('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
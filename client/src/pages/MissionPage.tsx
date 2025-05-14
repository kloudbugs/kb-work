import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import teraLogo from '@/assets/tera-logo.png';
import { useToast } from '@/hooks/use-toast';

export default function MissionPage() {
  const { toast } = useToast();
  
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header with animated elements */}
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-blue-500/20 rounded-xl blur-xl transform -translate-y-4 scale-110" />
            
            <div className="relative bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl">
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-pink-400/70"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <motion.div 
                  className="w-32 h-32 relative flex-shrink-0"
                  initial={{ rotate: -5 }}
                  animate={{ 
                    rotate: 5,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: {
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse"
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                >
                  {/* Glow effect behind logo */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/80 to-purple-600/80 blur-xl transform scale-90" />
                  <img 
                    src={teraLogo} 
                    alt="TERA Logo" 
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" 
                  />
                </motion.div>
                
                <div className="space-y-2 text-center md:text-left">
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-300 to-pink-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    The TERA Mission
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-gray-300 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Transforming digital mining into a force for social justice and community healing
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content with tabs */}
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="mission" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                Mission
              </TabsTrigger>
              <TabsTrigger value="legacy" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                Legacy
              </TabsTrigger>
              <TabsTrigger value="evidence" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                Evidence
              </TabsTrigger>
              <TabsTrigger value="story" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                Story
              </TabsTrigger>
            </TabsList>
            
            {/* Mission Tab */}
            <TabsContent value="mission" className="space-y-6">
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Our Core Mission</h2>
                <div className="prose prose-invert max-w-none">
                  <p>
                    The TERA project is dedicated to channeling the collective power of cryptocurrency mining toward meaningful social change. 
                    We combine cutting-edge blockchain technology with a deep commitment to justice, creating a platform where digital mining 
                    directly supports communities affected by systemic inequities.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-pink-300 mt-6 mb-3">Principles That Guide Us</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-pink-500/20 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-pink-300">Transparency:</strong> All mining revenues and fund allocations are publicly verifiable on the blockchain</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-pink-500/20 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-pink-300">Collective Action:</strong> Every participant contributes to a shared pool of resources for maximum impact</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-pink-500/20 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-pink-300">Community-Led:</strong> Direction and priorities are determined by those most impacted by injustice</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-pink-500/20 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-pink-300">Sustainable Impact:</strong> Building long-term solutions rather than temporary fixes</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">Impact Areas</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-lg font-medium text-pink-300">Legal Justice Initiatives</span>
                      <p className="text-gray-300 text-sm">Supporting advocacy work and legal resources for affected communities</p>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-lg font-medium text-pink-300">Community Healing Programs</span>
                      <p className="text-gray-300 text-sm">Funding for mental health resources and community rebuilding efforts</p>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-lg font-medium text-pink-300">Education & Awareness</span>
                      <p className="text-gray-300 text-sm">Creating platforms for truth-telling and historical documentation</p>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-lg font-medium text-pink-300">Economic Empowerment</span>
                      <p className="text-gray-300 text-sm">Building sustainable economic opportunities within impacted communities</p>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">Get Involved</h3>
                  <p className="text-gray-300 mb-4">
                    There are multiple ways to contribute to the TERA mission and help transform systems of injustice:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                      <h4 className="text-pink-300 font-medium">Mine With Purpose</h4>
                      <p className="text-sm text-gray-300">
                        Direct your mining power toward meaningful change by joining our mining pools
                      </p>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                      <h4 className="text-pink-300 font-medium">Community Advocacy</h4>
                      <p className="text-sm text-gray-300">
                        Join our community forums to help shape fund allocation and strategic initiatives
                      </p>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                      <h4 className="text-pink-300 font-medium">Direct Contribution</h4>
                      <p className="text-sm text-gray-300">
                        Contribute directly to the fund using cryptocurrency or traditional payment methods
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Legacy Tab */}
            <TabsContent value="legacy" className="space-y-6">
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Honoring Our Roots</h2>
                <div className="prose prose-invert max-w-none">
                  <p>
                    The TERA initiative was born from a profound recognition that technology can serve as a powerful tool
                    for addressing historical harms and creating pathways toward healing and restoration. Our legacy is built on 
                    recognizing the interconnection between technological advancement and social responsibility.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-pink-300 mt-6 mb-3">Our Founding Story</h3>
                  
                  <p>
                    TERA began when a diverse group of technologists, community organizers, and justice advocates came 
                    together to answer a crucial question: How can we harness the power of blockchain technology to 
                    address systemic inequities and create lasting change for marginalized communities?
                  </p>
                  
                  <p>
                    This initial collaboration identified a unique opportunity. While cryptocurrency mining consumed 
                    significant resources, it also generated substantial wealth. By redirecting a portion of this wealth 
                    creation toward social justice initiatives, we could create a sustainable funding mechanism for
                    community-led transformation.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-pink-400 mb-4">The Seeds of Change</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-pink-300">Family-Centered Approach</h4>
                    <p className="text-gray-300">
                      At the heart of our work is a commitment to families and communities affected by injustice. 
                      We recognize that lasting change must address the needs of the entire family unit,
                      supporting multiple generations in their journey toward healing.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-pink-300">Growing Our Impact</h4>
                    <p className="text-gray-300">
                      What began as a small initiative has grown into a global movement connecting technology,
                      finance, and social justice in powerful new ways. Our network now spans multiple countries,
                      with local chapters adapting our core mission to address specific community needs.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-6">
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Documented Impact</h2>
                <div className="prose prose-invert max-w-none">
                  <p>
                    Transparency is foundational to our mission. We meticulously document the impact of our work
                    and make all relevant data accessible to our community and the public.
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-pink-300">Mining Contributions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">152</span>
                          <span className="text-xs text-gray-400">Active Miners</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">15.2 PH/s</span>
                          <span className="text-xs text-gray-400">Total Hashrate</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">3.8 BTC</span>
                          <span className="text-xs text-gray-400">Mined This Year</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">$186K</span>
                          <span className="text-xs text-gray-400">Total Value</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-pink-300">Fund Allocations</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">42%</span>
                          <span className="text-xs text-gray-400">Legal Defense</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">26%</span>
                          <span className="text-xs text-gray-400">Community Programs</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">18%</span>
                          <span className="text-xs text-gray-400">Education</span>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3 text-center">
                          <span className="block text-2xl font-bold text-white">14%</span>
                          <span className="text-xs text-gray-400">Infrastructure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-pink-400 mb-4">Success Stories</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-pink-300">Family Reunification Program</h4>
                    <p className="text-gray-300 mt-2">
                      TERA funding supported legal assistance for 23 families facing separation, resulting in successful reunification
                      and ongoing support services.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-pink-300">Community Health Initiative</h4>
                    <p className="text-gray-300 mt-2">
                      Established three community-based mental health centers providing trauma-informed care
                      to over 450 individuals annually.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-pink-300">Truth and Documentation Project</h4>
                    <p className="text-gray-300 mt-2">
                      Created a digital archive preserving over 1,200 testimonies and historical documents,
                      making this vital information accessible to researchers and the public.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Story Tab */}
            <TabsContent value="story" className="space-y-6">
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-pink-400 mb-4">Our Ongoing Journey</h2>
                <div className="prose prose-invert max-w-none">
                  <p>
                    The TERA story is one of continuous evolution, learning, and growth. From our inception,
                    we've remained committed to centering the voices of those most impacted by injustice
                    while adapting our strategies to create the greatest possible impact.
                  </p>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-pink-300 mb-3">Timeline of Growth</h3>
                    
                    <div className="relative border-l-2 border-pink-500/40 pl-6 ml-4 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-gray-900"></div>
                        <h4 className="text-lg font-medium text-pink-300">Genesis</h4>
                        <p className="text-gray-300">
                          TERA began as a collaboration between technologists and community organizers
                          seeking to redirect the power of blockchain toward social justice causes.
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-gray-900"></div>
                        <h4 className="text-lg font-medium text-pink-300">Community Expansion</h4>
                        <p className="text-gray-300">
                          As our mining network grew, we established our first community-led governance
                          structure, ensuring those most impacted by injustice directed our resources.
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-gray-900"></div>
                        <h4 className="text-lg font-medium text-pink-300">Global Impact</h4>
                        <p className="text-gray-300">
                          TERA expanded internationally, creating regional chapters that adapted our core
                          mission to address local justice needs while maintaining global solidarity.
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-gray-900"></div>
                        <h4 className="text-lg font-medium text-pink-300">Present Day</h4>
                        <p className="text-gray-300">
                          Today, TERA represents a global network of miners, advocates, and communities
                          working together to transform systems and create lasting change.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/80 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-pink-400 mb-4">Join Our Story</h3>
                <p className="text-gray-300 mb-4">
                  The TERA story continues to unfold, and you're invited to be part of its next chapter.
                  By contributing your mining power, expertise, or advocacy, you become an integral part
                  of a global movement for justice and healing.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Button 
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "The community forum will be available in the next update.",
                      });
                    }}
                  >
                    Join Community Forum
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "The documentation center will be available in the next update.",
                      });
                    }}
                  >
                    Explore Full Documentation
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
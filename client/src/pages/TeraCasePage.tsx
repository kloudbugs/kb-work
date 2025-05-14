import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Gavel, Lock, Search, Shield } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

export function TeraCasePage() {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 relative">
        {/* Floating particles in background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-purple-500/20"
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

        {/* Hero Section with Title */}
        <div className="relative mb-12 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent pb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Tera Harris Case
          </motion.h1>
          
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          <motion.p 
            className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Documenting the truth and challenging the concealment of evidence
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Case Details */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Case Overview */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Gavel className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">Case Overview</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Tera Ann Harris was suing the Multnomah County Detention Center for $7.5 million for civil rights violations, 
                    medical neglect, and mistreatment during her incarceration. Her case was progressing through the courts and 
                    was headed to the Supreme Court when she died under suspicious circumstances on October 26, 2023, just two 
                    months after filing her lawsuit.
                  </p>
                  
                  <p>
                    The lawsuit alleged violations of Ms. Harris's Eighth and Fourteenth Amendment rights, specifically cruel 
                    and unusual punishment through the deliberate indifference to her serious medical needs. The civil action 
                    documented how Ms. Harris had been requesting medical attention for days before her death, reporting severe 
                    pain and medical distress that was repeatedly ignored by jail staff.
                  </p>
                  
                  <p>
                    Ms. Harris's death occurred under circumstances that suggest a direct connection to her legal action. The 
                    timing of her death—just as her case was gaining traction—and the immediate destruction of evidence by jail 
                    staff raise serious questions about whether her death was preventable and whether there was a coordinated 
                    effort to obstruct the progress of her lawsuit.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Evidence Concealment */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 text-amber-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">Concealed Evidence</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    The Multnomah County Detention Center has systematically concealed critical evidence related to 
                    Ms. Harris's death. Despite legal requirements to preserve all evidence when a death occurs in custody, 
                    jail officials began removing items from Ms. Harris's cell immediately after her death was confirmed, 
                    potentially destroying valuable evidence.
                  </p>
                  
                  <p>
                    The following evidence has been either concealed, tampered with, or destroyed:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Complete surveillance footage showing Ms. Harris's final hours, including footage showing her banging on her cell door requesting medical assistance</li>
                    <li>Original, unaltered medical records documenting her healthcare requests and the responses from jail staff</li>
                    <li>Communications between jail staff regarding Ms. Harris's condition and her lawsuit</li>
                    <li>Physical evidence from Ms. Harris's cell, including personal notes and documentation she maintained about her treatment</li>
                    <li>Full toxicology reports and complete autopsy findings</li>
                    <li>Records of staff assignments and shift changes during the critical period</li>
                    <li>Training records showing whether staff were properly trained to handle medical emergencies</li>
                  </ul>
                  
                  <p>
                    Despite multiple official requests and court orders demanding the preservation and production of this evidence, 
                    county officials have cited various administrative barriers, claimed that certain records do not exist, or 
                    provided heavily redacted and incomplete documentation that obscures the full picture of what occurred.
                  </p>
                  
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-700/30 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-1" />
                      <p className="text-red-200">
                        The county's continued obstruction of evidence has significantly hampered the family's pursuit of justice 
                        and highlights the critical need for independent investigation and accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Legal Timeline */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">Legal Timeline</h2>
                </div>
                
                <div className="space-y-2 text-gray-300 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-700"></div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">December 30, 2021</div>
                    <p>Tera Ann Harris enters Multnomah County custody and is housed at the Multnomah County Detention Center.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">August 2023</div>
                    <p>Ms. Harris files a $7.5 million lawsuit against Multnomah County for civil rights violations, claiming inadequate medical care, mistreatment, and retaliation by jail staff.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">September 2023</div>
                    <p>Court hearings begin. Initial discovery requests are filed. The case is assigned to a federal judge who orders Multnomah County to preserve all evidence related to Ms. Harris's treatment.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">October 25, 2023</div>
                    <p>Ms. Harris reports feeling cold and nauseous. Medical staff advises bed rest. Later that night, she reports feeling like she will pass out, but medical staff refuse to see her.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-red-600 border-2 border-red-900 z-10"></div>
                    <div className="text-xl text-white mb-1">October 26, 2023</div>
                    <p>Ms. Harris reports severe pain multiple times throughout the day. She is seen banging on her cell door at 4:37 PM. By 5:11 PM, she is found unresponsive. She is pronounced dead at 5:40 PM.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">October 27, 2023</div>
                    <p>Family is notified of Ms. Harris's death. Initial reports claim "natural causes." Family attorneys file emergency motions to preserve evidence and conduct independent investigation.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">November 2023</div>
                    <p>Family attorneys discover evidence has been removed from Ms. Harris's cell. Court orders immediate production of all surveillance footage and medical records.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">December 2023</div>
                    <p>County produces heavily redacted records. Claims some surveillance footage "no longer exists." Independent pathologist raises questions about official cause of death.</p>
                  </div>
                  
                  <div className="pl-10 relative pb-6">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-900 z-10"></div>
                    <div className="text-xl text-white mb-1">Current Status</div>
                    <p>The Harris family continues to pursue legal action against Multnomah County. Court hearings regarding the destroyed evidence are ongoing. Criminal investigation has been requested but not yet initiated.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Right Column - Documents and Resources */}
          <motion.div 
            className="lg:col-span-4 lg:sticky lg:top-24 self-start"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Legal Documents */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-purple-500 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Legal Documents</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20 transition-all hover:border-purple-400/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Tort Claim Notice</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20 transition-all hover:border-purple-400/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Original Lawsuit Filing</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20 transition-all hover:border-purple-400/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Evidence Preservation Order</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20 transition-all hover:border-purple-400/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-white">County Response</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20 transition-all hover:border-purple-400/40 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Independent Medical Report</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 text-center">
                  <span className="text-xs text-gray-400">More documents will be added as the legal case progresses</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Call to Action */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Support The Fight</h2>
                </div>
                
                <p className="text-gray-300 mb-4">
                  The TERA Token initiative helps fund the ongoing legal battle to uncover the truth and seek justice for Tera Ann Harris and others who have suffered similar fates.
                </p>
                
                <div className="space-y-3 mt-5">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Learn About TERA Token
                  </Button>
                  
                  <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-900/20">
                    Spread Awareness
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Continuing Investigation */}
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Search className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-xl font-semibold text-white">Ongoing Investigation</h2>
                </div>
                
                <p className="text-gray-300 mb-4">
                  With your support, we continue to investigate and pursue all legal avenues to uncover the truth about what happened to Tera Ann Harris.
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">7</div>
                    <div className="text-xs text-gray-400">Deaths in custody during the same period</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">68%</div>
                    <div className="text-xs text-gray-400">Of evidence still being withheld</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">12</div>
                    <div className="text-xs text-gray-400">Legal motions filed to date</div>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-300">3</div>
                    <div className="text-xs text-gray-400">Independent investigators working on the case</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

export default TeraCasePage;
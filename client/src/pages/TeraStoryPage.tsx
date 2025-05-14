import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Film, Gavel, Heart, Award, Info, Shield } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import MusicPlayer from '@/components/ui/MusicPlayer';

// Using a placeholder for Tera's image
// For a real implementation, upload tera-ann-harris.jpg to public folder

export function TeraStoryPage() {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 relative">
        {/* Music Player - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full transform transition-transform duration-300 hover:scale-105">
          <MusicPlayer 
            audioSrc="/music/tribute_song.mp3" 
            songTitle="No Weapon Formed Against Me Shall Prosper" 
            artistName="Fred Hammond" 
            autoPlay={false}
          />
        </div>
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

        {/* Title */}
        <div className="relative mb-16 mt-8">
          {/* Background flower image */}
          <div 
            className="absolute inset-0 z-0 rounded-xl overflow-hidden opacity-30"
            style={{
              backgroundImage: "url('/images/il_fullxfull.4332995241_al1f.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(2px) brightness(1.2)",
              transform: "scale(1.1)",
            }}
          />
          
          {/* Main title with calligraphy styling */}
          <motion.h1 
            className="text-6xl md:text-8xl text-center relative z-20"
            style={{
              fontFamily: "'Pinyon Script', 'Tangerine', 'Great Vibes', 'Dancing Script', cursive",
              background: "linear-gradient(to right, #ff9cee, #a78bfa, #c026d3, #9d4edd, #e0aaff)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 25px rgba(192, 38, 211, 0.9), 0 0 30px rgba(255, 255, 255, 0.4)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              transform: "rotate(-2deg)",
              padding: "50px 20px 20px",
              lineHeight: 1.2,
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "rgba(192, 38, 211, 0.4)",
              textDecorationThickness: "1px",
              textUnderlineOffset: "15px",
            }}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
              backgroundPosition: ["0% center", "200% center"]
            }}
            transition={{ 
              duration: 1.8,
              backgroundPosition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            Tera's Story
          </motion.h1>
          
          {/* Pink subtitle in all caps */}
          <motion.h2
            className="text-4xl md:text-5xl text-center font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent mt-4 relative z-20 uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              textShadow: "0 0 15px rgba(219, 39, 119, 0.6)",
              fontWeight: 800,
              letterSpacing: "0.1em"
            }}
          >
            TERA ANN HARRIS
          </motion.h2>
          
          <motion.p 
            className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto relative z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Her life, her legacy, and the movement for justice that carries her name forward
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Photo and Quote */}
          <motion.div 
            className="lg:col-span-5 lg:sticky lg:top-24 self-start"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-purple-500/20">
              <div className="relative">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="w-full h-64 flex items-center justify-center bg-purple-900/30">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-800/50 border border-purple-500/30">
                        <span className="text-3xl font-bold text-purple-300">T</span>
                      </div>
                      <p className="text-purple-300 font-medium">Tera Ann Harris</p>
                      <p className="text-sm text-purple-400/70 mt-1">1972 - 2018</p>
                    </div>
                  </div>
                </div>
                
                {/* Quote Card */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <Card className="bg-black/80 backdrop-blur-md border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="text-2xl text-purple-300 mb-1">"</div>
                      <p className="italic text-gray-300 mb-2">
                        Her spirit lives on in every effort for justice, in every voice raised against injustice, and in every step toward a more accountable society.
                      </p>
                      <div className="text-sm text-gray-400 text-right">— Family Statement</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Key Info */}
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-1">Age</div>
                    <div className="text-white">51</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-1">Family</div>
                    <div className="text-white">Mother, grandmother, sister, aunt</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-1">Passed Away</div>
                    <div className="text-white">October 26, 2023</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20">
                    <div className="text-xs text-gray-400 mb-1">Legacy</div>
                    <div className="text-white">TERA Token, #JUSTICEFORTERA movement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Right Column - Story Text */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Her Life */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 text-pink-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">Her Life</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Tera Ann Harris was a loving mother to seven daughters, a grandmother, sister, and aunt whose life was centered around her family. 
                    She was known for her strength in overcoming hardships to create a better life for her children, and her determination 
                    to fight for what she believed was right.
                  </p>
                  
                  <p>
                    Those who knew Tera describe her as a warrior for justice who never backed down from challenges and worked tirelessly to 
                    obtain the resources needed to accomplish her goals. She was a strong advocate for justice and taught her family 
                    the importance of standing up for what is right.
                  </p>
                  
                  <p>
                    Family was the center of Tera's world. She had experienced significant losses in her life, including the death of her mother 
                    just two weeks before her own passing, and her brother a year prior. Tragically, she was denied the opportunity to say her 
                    final goodbyes to them, adding to the injustices she faced throughout her life.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* The Tragedy */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Gavel className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">The Tragedy</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Tera Ann Harris entered Multnomah County custody on December 30, 2021, and was housed at the 
                    Multnomah County Detention Center. She had multiple chronic health issues that were documented in her medical chart. 
                    Prior to her death, Ms. Harris had been suing the jail for $7.5 million, and her case was heading to the Supreme Court. 
                    Just two months before her death, this legal action was progressing through the courts. For days leading up to her death, 
                    Ms. Harris had been repeatedly complaining about her serious health concerns. On October 25, 2023, 
                    Ms. Harris reported that she was feeling cold and nauseous. She saw a medical provider, who told her to 
                    lay down and be on bedrest. Around 10:00 PM that night, Ms. Harris told a deputy that she felt like she was going to 
                    pass out, but a provider refused to see her, stating they'd already spoken with her that day.
                  </p>
                  
                  <p>
                    On October 26, 2023, first at 1:54 AM, then again at 9:30 AM, Ms. Harris spoke to medical staff and complained of pain in her back, 
                    arm, and flank. She also reported shortness of breath. Ms. Harris had requested to be sent to the hospital but was instead 
                    scheduled for a medical visit with the jail nurse in the afternoon of October 26. At this appointment, she reported that her 
                    entire spine felt like it was on fire and that she had knee pain. The jail medical providers dismissed her concerns and 
                    sent her back to her cell despite her continued requests for hospital care.
                  </p>
                  
                  <p>
                    At 4:37 PM on October 26, Ms. Harris was still able to stand at the door of her cell. She was seen banging on her cell door 
                    desperately trying to get help while officers watched but did not respond. By 5:11 PM, she was found on the floor 
                    of her cell, unresponsive. Deputies alerted medical staff and called AMR to respond to the scene. After resuscitation efforts, 
                    she was pronounced dead at 5:40 PM. The family believes her death was the result of an overdose caused by the medical staff 
                    who had been treating her. In violation of county policy, Multnomah County Detention Center employees began to remove 
                    items from Ms. Harris's cell immediately after her death, potentially destroying evidence.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* The Movement */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">The Movement</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    In the aftermath of Tera's death, her family has taken legal action by filing a tort claim notice against 
                    Multnomah County. This legal action alleges negligence, wrongful death, and violations of Tera's constitutional rights 
                    under the Eighth and Fourteenth Amendments. The claim has been filed on behalf of her estate and six surviving daughters, 
                    who are seeking both financial damages and systemic reforms.
                  </p>
                  
                  <p>
                    Ms. Harris had reached out to her family multiple times in the days leading up to her death, expressing her fear 
                    that deputies were retaliating against her, that she was in pain, and that she was not receiving proper medical care. 
                    She had been beaten and placed in solitary confinement ("the hole") as punishment for complaining about her health issues and 
                    requesting medical attention. Her daughters' quest for justice highlights the broader issues of inadequate medical care, 
                    mistreatment, and retaliation in correctional facilities.
                  </p>
                  
                  <p>
                    Between May and October of 2023, seven people died in Multnomah County custody. The legal representation for the Harris family
                    has pointed to Multnomah County's failure to provide adequate medical care, substance use treatment, and mental health 
                    support to people in custody as factors that contributed to Ms. Harris's death. Through their legal action, the family 
                    aims to create accountability and bring about meaningful changes to prevent similar tragedies.
                  </p>
                  
                  <p>
                    The family continues to face significant obstacles in their pursuit of justice. Multnomah County officials have 
                    systematically hidden crucial evidence related to Tera's death, including surveillance footage, complete medical records, 
                    and staff testimonies. Despite court orders to preserve evidence, jail officials removed items from Tera's cell immediately 
                    after her death and have been uncooperative with investigators. The TERA Token initiative is partly designed to fund the 
                    extensive legal battle required to uncover this concealed evidence and hold responsible parties accountable.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Video Documentation */}
            <Card className="mb-8 bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Film className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">Case Documentation</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Video evidence and documentation of Tera Ann Harris's case will be available here. These videos provide important context 
                    about the legal proceedings, testimonies from witnesses, and evidence that corroborates the family's account of events.
                  </p>
                  
                  {/* Officer Misconduct Evidence Video */}
                  <div className="mt-6 bg-black/60 p-5 rounded-lg border border-red-900/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black/60 pointer-events-none"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" /> 
                        Officer Misconduct Evidence
                      </h3>
                      <p className="text-gray-300 mb-4">
                        This footage shows how officers at Multnomah County Detention Center handled Tera Ann Harris in her final hours. 
                        The video documents evidence of medical neglect as she repeatedly asked for help and was ignored.
                      </p>
                      
                      <div className="aspect-video bg-black/80 rounded-md overflow-hidden relative mb-3">
                        <iframe 
                          className="w-full h-full"
                          src="https://drive.google.com/file/d/1mfYdaNDFDpKRea74hRlnoV3wLFQWYXpF/preview"
                          title="Officer Misconduct Evidence"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        
                        {/* Red glow effect */}
                        <div className="absolute inset-0 pointer-events-none" 
                          style={{
                            boxShadow: "0 0 30px 5px rgba(220, 38, 38, 0.3) inset",
                            zIndex: 5
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between bg-red-950/40 p-2 rounded">
                        <span className="text-xs text-red-400">Evidence ID: DCM-20231026-A</span>
                        <span className="text-xs text-red-400">Classification: URGENT</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="bg-black/50 p-4 rounded-lg border border-purple-900/40">
                      <h3 className="text-lg font-medium text-white mb-2">Upcoming: Court Proceedings</h3>
                      <p className="text-sm text-gray-400">
                        Video documentation of court proceedings related to the $7.5 million lawsuit against Multnomah County.
                      </p>
                    </div>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-purple-900/40">
                      <h3 className="text-lg font-medium text-white mb-2">Upcoming: Family Testimonies</h3>
                      <p className="text-sm text-gray-400">
                        Interviews with Tera's family members detailing her communications in the days before her death.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 py-3 px-4 rounded-md bg-blue-900/30 border border-blue-700/30">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-200">
                        Additional video content will be added as it becomes available. Check back for updates as the case progresses.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* The TERA Token */}
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-amber-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-white">The TERA Token</h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    The TERA Token represents a revolutionary approach to supporting social justice initiatives through blockchain technology. 
                    Named in honor of Tera Ann Harris, this token directs 33% of all mining rewards toward legal accountability and justice initiatives.
                  </p>
                  
                  <p>
                    The tokenonomics of TERA are designed to create a sustainable funding mechanism for organizations working on police 
                    accountability, legal support for victims of injustice, and policy reform. By embedding these values directly into 
                    the blockchain architecture, the TERA Token ensures that support for these critical causes continues to grow as the 
                    network expands.
                  </p>
                  
                  <p>
                    Beyond its financial impact, the TERA Token serves as a symbol of commitment to justice and a reminder that technology 
                    can be harnessed for social good. Token holders become part of a community dedicated to carrying forward Tera's legacy 
                    and working toward a world where equal justice is not just an ideal but a reality.
                  </p>
                  
                  <p className="pt-4 border-t border-gray-700 mt-6 text-center italic text-gray-400">
                    "Through the TERA Token, we've found a way to ensure my mother's name will forever be associated with the fight for justice. 
                    Every transaction, every mining reward is a step toward the more accountable society she would have wanted to see."
                    <span className="block mt-2 text-sm">— Darius Harris, Son of Tera Ann Harris</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

export default TeraStoryPage;
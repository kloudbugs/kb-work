import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, Scale, Heart, Users, Landmark, FileText, ExternalLink, AlertTriangle, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import teraTokenImage from "@/assets/tera-family.png";
import teraTokenLogo from "@/assets/tera-logo.png";
import { useState, useEffect } from "react";

export default function TeraInfo() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Text to be read aloud
  const teraTokenDescription = `
    The TERA token, also known as TAH for Tera Ann Harris token, was created to honor the memory of Tera Ann Harris of Portland, Oregon, and to 
    fund legal initiatives addressing civil rights issues in the criminal justice system.
    
    Tera Ann Harris was a beloved mother of seven daughters from Portland, Oregon, whose legacy 
    now lives on through her children's unwavering commitment to justice and transparency in our 
    legal system. 
    
    On October 26, 2023, Tera passed away while in custody at the Multnomah County Detention Center, 
    leaving her seven daughters to navigate a complex and often opaque system in search of answers. 
    
    The TERA token focuses on civil rights initiatives, funding legal actions addressing detention 
    facility conditions, medical care standards, and justice system accountability.
    
    Ten percent of all MPT token purchases, which stands for Mining Power Token, and mining rewards are automatically directed to the TERA token 
    initiative, creating a sustainable funding mechanism for civil rights cases worldwide.
    
    By participating in the MPT ecosystem, you're automatically contributing to important civil rights initiatives.
  `;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
      const utterance = new SpeechSynthesisUtterance(teraTokenDescription);
      
      // Set voice parameters for a more human female voice
      utterance.rate = 0.9;  // Slightly slower than default
      utterance.pitch = 1.2; // Slightly higher pitch for female voice
      utterance.volume = 1.0; // Maximum volume
      
      // Try to use a female voice if available
      const loadVoices = () => {
        // Get all available voices
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
          // First, look for high-quality female voices
          const femaleVoices = voices.filter(voice => 
            (voice.name.includes('female') || 
             voice.name.includes('Samantha') || 
             voice.name.includes('Victoria') ||
             voice.name.includes('Ava') ||
             voice.name.includes('Karen') ||
             voice.name.includes('Moira') ||
             voice.name.includes('Tessa'))
          );
          
          // Use a female voice if available, otherwise default
          if (femaleVoices.length > 0) {
            utterance.voice = femaleVoices[0];
          }
        }
      };
      
      // Voice list might not be loaded immediately
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
      
      utterance.onend = () => setIsSpeaking(false);
      setSpeechUtterance(utterance);
      
      // Auto-play the speech when page loads
      const timer = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }, 1500); // Wait 1.5 seconds before starting
      
      return () => {
        clearTimeout(timer);
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }

    // Cleanup
    return () => {
      if (speechSynthesis && isSpeaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!speechSynthesis || !speechUtterance) return;
    
    if (isSpeaking) {
      // Stop speech
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Always ensure we're using the best available voice before speaking
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Look for high-quality female voices
        const femaleVoices = voices.filter(voice => 
          (voice.name.includes('female') || 
           voice.name.includes('Samantha') || 
           voice.name.includes('Victoria') ||
           voice.name.includes('Ava') ||
           voice.name.includes('Karen') ||
           voice.name.includes('Moira') ||
           voice.name.includes('Tessa'))
        );
        
        // Use a female voice if available
        if (femaleVoices.length > 0 && speechUtterance) {
          speechUtterance.voice = femaleVoices[0];
        }
      }
      
      // Start speech
      speechSynthesis.speak(speechUtterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back to Dashboard Button */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8">
            <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-[280px] h-[280px] mx-auto mb-6 overflow-hidden rounded-full">
              <img 
                src={teraTokenLogo} 
                alt="TERA Civil Rights Token" 
                className="w-full h-full object-contain"
                style={{ 
                  padding: '10px'
                }}
              />
            </div>
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white mb-6">
              Justice System Reform Initiative
            </div>
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <span className="text-primary">TERA</span> Token: In Memory of Tera Ann Harris
              </h1>
            </div>
            
            <div className="flex justify-center mb-8">
              <button 
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isSpeaking 
                    ? "bg-red-100 text-red-600 hover:bg-red-200" 
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
                title={isSpeaking ? "Stop narration" : "Listen to narration"}
                aria-label={isSpeaking ? "Stop narration" : "Listen to narration"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-5 w-5" />
                    <span>Stop Narration</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5" />
                    <span>Listen to Story</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              The TERA token (TAH - Tera Ann Harris) was created to honor the memory of Tera Ann Harris of Portland, Oregon, and to 
              fund legal initiatives addressing civil rights issues in the criminal justice system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tera">
                <Button size="lg" className="rounded-full px-8">
                  Support Reform Cases
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href="/#buy">MPT Token Connection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tera Ann Harris Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Tera Ann Harris: A Legacy of Justice</h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-2/5 flex-shrink-0">
                  <img 
                    src={teraTokenImage} 
                    alt="Tera Ann Harris with her daughters" 
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: 'none' }}
                  />
                </div>
                <div className="p-8 md:w-3/5">
                  <div className="prose max-w-none">
                    <p>
                      Tera Ann Harris was a beloved mother of seven daughters from Portland, Oregon, whose legacy 
                      now lives on through her children's unwavering commitment to justice and transparency in our 
                      legal system. Tera's story represents the challenges many families face when seeking truth 
                      and accountability within the justice system.
                    </p>
                    
                    <p className="mt-4">
                      On October 26, 2023, Tera passed away while in custody at the Multnomah County Detention Center, 
                      leaving her seven daughters to navigate a complex and often opaque system in search of answers. 
                      What they discovered was troubling: evidence potentially mishandled, important information withheld, 
                      and a system seemingly resistant to providing the transparency every family deserves.
                    </p>
                    
                    <p className="mt-4">
                      Her daughters—united in grief but determined in purpose—have become powerful advocates for 
                      justice system reform. They've channeled their loss into a movement seeking to ensure that 
                      other families won't face similar obstacles when searching for truth about their loved ones.
                    </p>
                    
                    <p className="mt-4">
                      The TERA token honors not just Tera Ann Harris's memory, but also the inspiring strength and 
                      resilience of her seven daughters who continue to fight for justice in her name—asking important 
                      questions and demanding accountability where it's desperately needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 mb-8">
              <div className="flex items-start">
                <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Seven Daughters Seeking Justice</h3>
                  <p className="text-gray-700">
                    Tera's seven daughters have faced a challenging journey seeking transparency and truth 
                    from law enforcement authorities who have withheld crucial information and evidence. Their 
                    experience highlights the need for greater accountability in our justice system and the 
                    importance of supporting families fighting for answers when their loved ones die in custody.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Legal Case Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seeking Justice Through Legal Action</h2>
            <p className="text-lg text-gray-600">
              The family of Tera Ann Harris, represented by the Oregon Justice Resource Center, 
              is pursuing legal action to address the serious concerns surrounding her care while in custody.
            </p>
          </div>

          {/* Officer Smiling Image - Walking away from Tera's cell */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="/images/tera/officer-smiling.png" 
                  alt="Officer smiling while walking away from Tera's cell as she was dying" 
                  className="w-full h-auto object-contain" 
                  style={{ maxHeight: '600px' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">
                    <span className="text-red-400 font-bold">CRITICAL EVIDENCE:</span> Detention officer smiling while walking away from Tera's cell shortly before she died
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed explanation of the evidence */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded shadow-md">
              <h4 className="text-lg font-semibold text-red-700 mb-2">Evidence Breakdown:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-800">
                <li><strong>Officer's Expression:</strong> The officer is visibly smiling while walking away from Tera's cell.</li>
                <li><strong>Location:</strong> This is the exact corridor where Tera's cell was located in Multnomah County Detention Center.</li>
                <li><strong>Timing:</strong> This footage was captured shortly before Tera was found unresponsive.</li>
                <li><strong>Critical Detail:</strong> Looking closely at the back corner of the image (upper right), you can see Tera slumped against her cell door, already in medical distress.</li>
                <li><strong>Legal Significance:</strong> This evidence suggests that detention staff failed to recognize or respond to a life-threatening medical emergency, despite visible signs of distress.</li>
              </ul>
              <p className="mt-4 text-red-700 font-medium">This surveillance footage is a key piece of evidence in the $7.5 million lawsuit against Multnomah County and the specific officers involved in Tera's care.</p>
            </div>
          </div>

          {/* Tera's Injuries Image */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="/images/tera/tera-injured.jpeg" 
                  alt="Tera Ann Harris with injuries while in detention" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '500px', objectPosition: 'center' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">
                    <span className="text-red-400 font-bold">EVIDENCE OF MISTREATMENT:</span> Tera Ann Harris with visible injuries sustained while in detention
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto mb-16">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">$7.5 Million Lawsuit in Portland, Oregon</h3>
              
              <div className="space-y-6">
                <div className="bg-black/5 p-4 rounded-lg border-l-4 border-red-600">
                  <h4 className="font-semibold text-lg mb-2 text-red-700">Medical Care Denial in Multnomah County</h4>
                  <p className="text-gray-800">
                    Despite documented chronic health issues and multiple requests for medical assistance in the 
                    Multnomah County Detention Center in Portland, Oregon, Tera's symptoms and pain were deliberately ignored. 
                    On the day before her passing, she reported feeling cold, nauseous, and like she was "going to pass out," 
                    yet was callously denied medical attention by detention officers.
                  </p>
                </div>
                
                <div className="bg-black/5 p-4 rounded-lg border-l-4 border-purple-600">
                  <h4 className="font-semibold text-lg mb-2 text-purple-700">Final Day Timeline - Portland Detention Center</h4>
                  <p className="text-gray-800">
                    On October 26, 2023, Tera reported severe pain, describing her spine as feeling "like it was on fire." 
                    Despite these serious symptoms, Portland detention officers sent her back to her cell without proper 
                    medical assessment. Hours later, at 5:11 PM, she was found unresponsive against her cell door 
                    and was subsequently pronounced deceased.
                  </p>
                </div>
                
                <div className="bg-black/5 p-4 rounded-lg border-l-4 border-blue-600">
                  <h4 className="font-semibold text-lg mb-2 text-blue-700">Final Communications with Family</h4>
                  <p className="text-gray-800">
                    In her final days at the Portland facility, Tera reached out to her daughters multiple times, 
                    expressing fears about retaliation from detention staff, reporting increasingly severe pain, 
                    and concerns about being denied proper medical care. These communications document 
                    the systematic neglect she experienced in Multnomah County custody.
                  </p>
                </div>
                
                <div className="bg-black/5 p-4 rounded-lg border-l-4 border-indigo-600">
                  <h4 className="font-semibold text-lg mb-2 text-indigo-700">Systemic Issues in Portland's Justice System</h4>
                  <p className="text-gray-800">
                    Between May and October of 2023, seven people died while in Multnomah County custody in Portland, 
                    revealing deeply troubling systemic issues regarding medical care, accountability, and 
                    humane treatment in Portland's detention facilities. This pattern demonstrates institutional 
                    neglect and potential civil rights violations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is TERA Token Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The TERA Token Mission</h2>
            <p className="text-lg text-gray-600">
              The TERA token (TAH - Tera Ann Harris) focuses on the civil rights side of our platform. 
              It funds legal initiatives addressing detention facility conditions, medical care standards, and justice 
              system accountability—issues highlighted by Tera Ann Harris's experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Medical Care Advocacy
              </h3>
              <p className="text-gray-600">
                We support legal actions addressing medical care standards in detention facilities, 
                ensuring that health concerns are taken seriously, documented properly, and treated 
                appropriately—preventing unnecessary suffering and potentially fatal outcomes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Scale className="mr-2 h-5 w-5 text-primary" />
                Justice System Accountability
              </h3>
              <p className="text-gray-600">
                TERA funds cases seeking to hold detention facilities accountable for their treatment 
                of those in custody, promoting transparency and proper documentation of medical care 
                and incidents, with particular focus on facilities with concerning patterns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Support for Families
              </h3>
              <p className="text-gray-600">
                We provide resources for families seeking answers and justice after losing loved ones in custody. 
                This includes supporting legal representation, documentation preservation, and navigating 
                complex systems to ensure the truth is revealed and addressed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Transparent Impact
              </h3>
              <p className="text-gray-600">
                99% of all funds contributed to TERA tokens go directly to these initiatives, with 
                only 1% allocated to Replit for platform support. Contributors receive regular updates 
                on case progress and the impact of their support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MPT Connection Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">MPT & TERA: A Powerful Connection</h2>
            <p className="text-lg text-gray-600">
              10% of all MPT (Mining Power Token) purchases and mining rewards are automatically directed to the TERA token 
              initiative, creating a sustainable funding mechanism for civil rights cases worldwide.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2">
              <div className="p-8 bg-primary/5">
                <h3 className="text-xl font-bold mb-3 text-primary">How It Works</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">1</div>
                    <div>
                      <p className="text-gray-700">When you purchase MPT tokens, 10% of your purchase amount is automatically allocated to the TERA initiative.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">2</div>
                    <div>
                      <p className="text-gray-700">Similarly, when you mine MPT tokens, 10% of the mining rewards contribute to TERA-supported civil rights cases.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">3</div>
                    <div>
                      <p className="text-gray-700">These funds are then directed to active civil rights cases being supported through the TERA token.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">4</div>
                    <div>
                      <p className="text-gray-700">By participating in the MPT ecosystem, you're automatically contributing to important civil rights initiatives.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3">The Impact of Your Participation</h3>
                <p className="text-gray-600 mb-4">
                  This connection between MPT and TERA creates a sustainable funding model for civil rights initiatives:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <p className="text-gray-700">Building a community of supporters who contribute to civil rights through everyday crypto activities</p>
                  </div>
                  <div className="flex items-start">
                    <Scale className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <p className="text-gray-700">Providing consistent funding to legal initiatives that might otherwise lack resources</p>
                  </div>
                  <div className="flex items-start">
                    <Landmark className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <p className="text-gray-700">Creating institutional support for long-term legal battles that require sustained backing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Case Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Active Case</h2>
            <p className="text-lg text-gray-600">
              This is the civil rights case currently being supported by TERA token contributions. Your 
              support makes a direct impact on the success of this important initiative.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-200">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">Equal Educational Access Initiative</h3>
              <p className="text-gray-600 mb-6">
                Supporting legal action to ensure equal access to quality education in underserved communities. 
                This case challenges systemic inequalities in educational resource allocation and works to 
                establish legal precedents for educational equity.
              </p>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Funding Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$65K</div>
                  <div className="text-xs text-gray-500">Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$100K</div>
                  <div className="text-xs text-gray-500">Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">21 days</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> Recent Updates
                </h4>
                <ul className="space-y-3">
                  <li className="flex">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="text-gray-800 font-medium">Apr 2, 2025:</p>
                      <p className="text-gray-600">Initial filings submitted to federal court</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="text-gray-800 font-medium">Mar 15, 2025:</p>
                      <p className="text-gray-600">Expert witnesses secured for testimonies</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                    <div>
                      <p className="text-gray-800 font-medium">Feb 28, 2025:</p>
                      <p className="text-gray-600">Research phase completed</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-8 text-center">
                <Link href="/tera">
                  <Button className="rounded-full px-8">
                    Support This Case <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Evidence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Critical Evidence Documentation</h2>
            <p className="text-lg text-gray-600">
              The following evidence is critical to understanding the circumstances surrounding Tera's death
              and the basis for the family's lawsuit against Multnomah County.
            </p>
          </div>
          
          {/* Computer Terminal with Medical Data */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="/images/tera/tera-terminal.jpeg" 
                  alt="Computer terminal showing Tera's medical data discrepancies" 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '600px' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">
                    <span className="text-red-400 font-bold">MEDICAL DATA EVIDENCE:</span> Computer terminal displaying medical records with contradictory information
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed explanation of the terminal evidence */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded shadow-md">
              <h4 className="text-lg font-semibold text-red-700 mb-2">Computer Records Analysis:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-800">
                <li><strong>Timing Discrepancies:</strong> The computer records show that medical checks were reportedly conducted at times when video evidence shows no staff entered Tera's cell.</li>
                <li><strong>Data Entry Issues:</strong> Records were entered retroactively, after Tera was already in distress.</li>
                <li><strong>Missing Documentation:</strong> Critical medical assessments that should have been performed are entirely absent from the records.</li>
                <li><strong>Falsified Records:</strong> The computer terminal shows entries made claiming "normal vital signs" during periods when surveillance footage shows Tera was clearly in medical distress.</li>
                <li><strong>Legal Significance:</strong> These discrepancies between official records and surveillance footage form a key component of the lawsuit.</li>
              </ul>
              <p className="mt-4 text-red-700 font-medium">The computer terminal records have been secured as evidence through legal discovery and will be presented in court as part of the family's case against the facility.</p>
            </div>
          </div>
          
          {/* Black Eye Image */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src="/images/tera/tera-black-eye.jpeg" 
                  alt="Tera Ann Harris with black eye injury sustained in detention" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '550px', objectPosition: 'center' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">
                    <span className="text-red-400 font-bold">PHYSICAL EVIDENCE:</span> Tera's facial injuries documented after an altercation with detention staff
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Movement for Change</h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether through direct TERA token contributions or by participating in the MPT ecosystem, 
              you can be part of a community committed to advancing civil rights through innovative funding approaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tera">
                <Button size="lg" className="rounded-full px-8">
                  Support TERA Directly
                </Button>
              </Link>
              <Link href="/mining">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Mining Subscription
                </Button>
              </Link>
              <Link href="/#buy">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Buy MPT Tokens
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
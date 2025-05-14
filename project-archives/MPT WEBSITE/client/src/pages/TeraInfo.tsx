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
              The TERA token funds legal initiatives that address critical civil rights issues within our justice system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
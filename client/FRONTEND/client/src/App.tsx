// ************************************************************************ 
// KLOUDBUGS COSMIC MINING PLATFORM - FRONTEND VISUALIZATION INTERFACE
// ************************************************************************
// This file represents the frontend visualization interface for the Kloudbugs Mining Platform.
// The mining operations logic will be implemented in separate backend services.
// This interface provides a visual representation of the mining operations using
// an immersive cosmic-themed environment with interactive elements.
// ************************************************************************

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import Cell from "./components/Cell";
import Environment from "./components/Environment";
import BackgroundParticles from "./components/BackgroundParticles";
import MouseInteractionLayer from "./components/MouseInteractionLayer";
import PulseWave from "./components/PulseWave";
import ControlPanel from "./components/ui/ControlPanel";
import OrbitingLogo from "./components/OrbitingLogo";
import StarSparkles from "./components/StarSparkles";
import ElectricTendrils from "./components/ElectricTendrils";
import ElectricGrid from "./components/ElectricGrid";
import MiningBlocks from "./components/MiningBlocks";
import SideNavigation from "./components/SideNavigation";
import BottomMenu from "./components/BottomMenu";
import PurpleNodeBackground from "./components/PurpleNodeBackground";
import { useAudio } from "./lib/stores/useAudio";
import { useControls } from "./lib/stores/useControls";
import * as THREE from "three";

// Import styles
import "./components/ZigNotification.css";
import "./components/fixes.css";

// Main App component
function App() {
  const [showPerformance, setShowPerformance] = useState(false);
  const { toggleMute, isMuted } = useAudio();
  const [bitcoinTendrilsActive, setBitcoinTendrilsActive] = useState(false);
  const [miningMode, setMiningMode] = useState(false);
  const [electricEffects, setElectricEffects] = useState(false);
  const [showMiningPlatform, setShowMiningPlatform] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const welcomeAudioRef = useRef<HTMLAudioElement>(null);

  // Hide any mouse notification or usage guide 
  useEffect(() => {
    // Run this once to remove any mouse notification
    const hideMouseNotification = () => {
      const elementsToHide = document.querySelectorAll('[class*="mouse-"], [id*="mouse-"], [class*="info-box"], [id*="info-box"]');
      elementsToHide.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
      
      // Also try to find elements by text content
      document.querySelectorAll('div, p, span').forEach(el => {
        if (el.textContent && (
            el.textContent.toLowerCase().includes('mouse') || 
            el.textContent.toLowerCase().includes('click') ||
            el.textContent.toLowerCase().includes('drag')
          )) {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
          }
        }
      });
    };
    
    // Run immediately and then periodically
    hideMouseNotification();
    const interval = setInterval(hideMouseNotification, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Voice functionality has been disabled
  useEffect(() => {
    console.log("Voice functionality disabled - not loading speech synthesis");
    console.log("Press 'V' to manually trigger voice if needed (for debug only)");
    
    // Load audio assets
    const audioStore = useAudio.getState();
    if (audioStore.backgroundMusic) {
      console.log("Background music loaded and ready");
    }
  }, []);

  // Toggle stats with 'p' key and handle music toggle with 'm' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        setShowPerformance((prev) => !prev);
      }
      if (e.key === "m") {
        toggleMute();
      }
      if (e.key === "v") {
        // Play background music instead of voice
        playBackgroundMusic();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

  // Text for Zig's welcome message (kept for reference only, not used)
  const zigWelcomeMessage = "I AM ZIG. AN ENHANCED AI MINER. GUARDIAN OF THE COSMIC CORE.";
  
  // Background beat audio element
  const [backgroundBeat] = useState<HTMLAudioElement | null>(null);
  
  // Simple function to play background music and show animation
  const playBackgroundMusic = () => {
    console.log("Playing background music");
    
    // Activate Bitcoin tendrils animation
    setBitcoinTendrilsActive(true);
    
    // Set a timeout to deactivate the tendrils after a few seconds
    setTimeout(() => {
      setBitcoinTendrilsActive(false);
    }, 10000); // 10 seconds
    
    // Play the J. Cole beat
    const audioStore = useAudio.getState();
    if (audioStore.backgroundMusic) {
      audioStore.backgroundMusic.currentTime = 0;
      audioStore.backgroundMusic.play().catch(e => {
        console.log("Could not play background music:", e);
      });
    }
  };
  
  // Handler for opening the mining platform
  const handleOpenMiningPlatform = () => {
    setShowMiningPlatform(true);
    console.log("Opening Mining Platform...");
    // Show a notification that mining platform is coming soon
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-notification-header">
        <h2 style="color: #ff9900; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Mining Platform</h2>
        <button class="close-button" title="Close message">✕</button>
      </div>
      <div class="zig-message">
        <p>Mining Platform is currently being prepared for launch. Stay tuned for updates!</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Add click event listener to the close button
    const closeButton = notification.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Remove notification with animation
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  };

  // Handler for opening the vault
  const handleOpenVault = () => {
    setShowVault(true);
    console.log("Opening Vault...");
    // Show a notification that vault is coming soon
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-notification-header">
        <h2 style="color: #ff00cc; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">The Vault</h2>
        <button class="close-button" title="Close message">✕</button>
      </div>
      <div class="zig-message">
        <p>The Vault is currently being secured. Access will be granted soon!</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Add click event listener to the close button
    const closeButton = notification.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Remove notification with animation
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  };
  
  // Use Hume AI for Zig's voice (high-quality British accent)
  const playWelcomeVoice = () => {
    // Display the message in the console for testing
    console.log("Zig's Message:", zigWelcomeMessage);
    
    // Create more human-sounding text by converting to sentence case
    // rather than all-caps, and adding proper pauses
    const humanText = zigWelcomeMessage
      .toLowerCase()
      // Capitalize first letter of sentences
      .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
      // Add pauses at logical points
      .replace(/\./g, '. ')
      // Add slight emphasis in important places
      .replace(/tera ann harris/i, 'Tera Ann Harris')
      .replace(/kloud bugs/i, 'Kloud Bugs')
      .replace(/mother of seven/i, 'mother of seven')
      .replace(/mining platform/i, 'mining platform')
      .replace(/social justice/i, 'social justice')
      .replace(/digital realm/i, 'digital realm');

    // Show a notification in the UI
    const notification = document.createElement('div');
    notification.className = 'zig-notification';
    notification.innerHTML = `
      <div class="zig-notification-header">
        <h2 style="color: #00ffff; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">ZIG - Enhanced AI Miner</h2>
        <button class="close-button" title="Close message">✕</button>
      </div>
      <div class="zig-message">
        <p>${humanText}</p>
      </div>
      <div id="hume-voice-container"></div>
    `;
    document.body.appendChild(notification);
    
    // Activate Bitcoin tendrils immediately
    setBitcoinTendrilsActive(true);
    
    // Create an instance of our HumeAIVoice component programmatically
    // and mount it to the container in the notification
    const humeVoiceContainer = notification.querySelector('#hume-voice-container');
    if (humeVoiceContainer) {
      console.log('Starting Hume AI voice request for Zig...');
      
      // Create a loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'hume-loading-indicator';
      loadingIndicator.innerHTML = `<span>Loading AI voice...</span>`;
      loadingIndicator.style.color = '#00ffff';
      loadingIndicator.style.fontSize = '12px';
      loadingIndicator.style.fontStyle = 'italic';
      loadingIndicator.style.marginTop = '6px';
      humeVoiceContainer.appendChild(loadingIndicator);
      
      // Fetch the Hume AI voice
      fetch('/api/hume/zig-welcome')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          // Remove loading indicator
          if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
          }
          
          if (data.audioPath) {
            // Log if we're using a fallback
            if (data.fallback) {
              console.warn("Using fallback audio instead of Hume AI voice:", data.error);
            }
            
            // Create audio element
            const audio = document.createElement('audio');
            audio.src = data.audioPath;
            audio.style.display = 'none';
            
            // Add event listeners for audio
            audio.onloadedmetadata = () => {
              console.log(`Audio duration: ${audio.duration} seconds`);
            };
            
            audio.onerror = (e) => {
              console.error("Error loading audio:", e);
              // Use fallback if audio loading fails
              fallbackToWebSpeech(humanText, notification);
            };
            
            audio.onended = () => {
              console.log("Speech finished");
              
              // Auto-dismiss Zig's notification with animation
              notification.style.opacity = '0';
              notification.style.transform = 'translateY(-20px)';
              notification.style.transition = 'opacity 0.3s, transform 0.3s';
              
              setTimeout(() => {
                if (notification.parentNode) {
                  notification.parentNode.removeChild(notification);
                }
              }, 300);
              
              // Deactivate tendrils
              setBitcoinTendrilsActive(false);
              
              // Display a message to indicate song is now playing
              console.log("ZIG SPEECH COMPLETE - PLAYING J. COLE BEAT");
              
              // Add a visual indicator that speech is done and song is playing
              const songReadyMessage = document.createElement('div');
              songReadyMessage.className = 'song-ready-message';
              songReadyMessage.innerHTML = `
                <div class="song-message">
                  <p>ZIG'S MESSAGE COMPLETE - PLAYING J. COLE BEAT</p>
                </div>
              `;
              songReadyMessage.style.position = 'fixed';
              songReadyMessage.style.bottom = '80px';
              songReadyMessage.style.right = '20px';
              songReadyMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              songReadyMessage.style.color = '#00ffff';
              songReadyMessage.style.padding = '10px 15px';
              songReadyMessage.style.borderRadius = '5px';
              songReadyMessage.style.border = '1px solid #00ffff';
              songReadyMessage.style.zIndex = '1000';
              songReadyMessage.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
              songReadyMessage.style.fontFamily = 'Courier New, monospace';
              songReadyMessage.style.fontSize = '14px';
              songReadyMessage.style.textTransform = 'uppercase';
              document.body.appendChild(songReadyMessage);
              
              // Start playing the J. Cole beat
              const audioStore = useAudio.getState();
              if (audioStore.backgroundMusic) {
                audioStore.backgroundMusic.currentTime = 0; // Start from the beginning
                audioStore.backgroundMusic.play().catch(e => {
                  console.log("Could not auto-play music after speech:", e);
                });
                console.log("Started playing J. Cole beat after Zig's speech");
              }
              
              // Remove the message after 10 seconds
              setTimeout(() => {
                if (songReadyMessage.parentNode) {
                  songReadyMessage.parentNode.removeChild(songReadyMessage);
                }
              }, 10000);
            };
            
            // Play the audio
            humeVoiceContainer.appendChild(audio);
            
            // Add a small button to replay the audio
            const replayButton = document.createElement('button');
            replayButton.className = 'replay-button';
            replayButton.innerHTML = '↻ Replay Voice';
            replayButton.style.background = 'rgba(0, 0, 0, 0.6)';
            replayButton.style.color = '#00ffff';
            replayButton.style.border = '1px solid #00ffff';
            replayButton.style.borderRadius = '4px';
            replayButton.style.padding = '4px 8px';
            replayButton.style.fontSize = '11px';
            replayButton.style.cursor = 'pointer';
            replayButton.style.marginTop = '8px';
            replayButton.style.display = 'inline-block';
            
            replayButton.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              audio.currentTime = 0;
              audio.play().catch(err => console.error("Error replaying audio:", err));
            };
            
            humeVoiceContainer.appendChild(replayButton);
            
            // Start playing audio
            audio.play().catch(err => {
              console.error("Error playing Hume AI voice:", err);
              // Fall back to regular speech synthesis if Hume AI fails
              fallbackToWebSpeech(humanText, notification);
            });
          } else {
            console.error("No audio path returned from Hume AI API");
            // Fall back to regular speech synthesis
            fallbackToWebSpeech(humanText, notification);
          }
        })
        .catch(error => {
          console.error("Error fetching Hume AI speech:", error);
          
          // Remove loading indicator if it exists
          if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
          }
          
          // Fall back to regular speech synthesis if Hume AI fails
          fallbackToWebSpeech(humanText, notification);
        });
    }
    
    // Add click event listener to the close button
    const closeButton = notification.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Find and stop any playing audio
        const audio = notification.querySelector('audio');
        if (audio) {
          audio.pause();
        }
        
        setBitcoinTendrilsActive(false); // Stop tendrils animation
        
        // Remove notification with animation
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
    
    // If the Hume AI voice doesn't start within a reasonable time, set a maximum time for the effect
    const maxDuration = 25000; // 25 seconds
    const tendrilTimeout = setTimeout(() => {
      if (bitcoinTendrilsActive) {
        setBitcoinTendrilsActive(false);
        
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }
    }, maxDuration);
  };
  
  // Fallback to Web Speech API if Hume AI fails
  const fallbackToWebSpeech = (text: string, notification: HTMLElement) => {
    console.log("Using Web Speech API with Stella voice if available");
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Make sure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      // If voices aren't loaded yet, set up an event listener
      console.log("No voices available yet. Waiting for voices to load...");
      
      // Show loading indicator in notification
      const loadingMsg = document.createElement('div');
      loadingMsg.innerHTML = "Loading voice... please wait";
      loadingMsg.style.color = "#00ffff";
      loadingMsg.style.fontSize = "12px";
      loadingMsg.style.fontStyle = "italic";
      loadingMsg.style.marginTop = "8px";
      notification.appendChild(loadingMsg);
      
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        console.log("Voices loaded. Available voices:", voices.map(v => v.name).join(", "));
        if (loadingMsg.parentNode) {
          loadingMsg.parentNode.removeChild(loadingMsg);
        }
        setupVoiceAndSpeak();
      };
    } else {
      console.log("Available voices:", voices.map(v => v.name).join(", "));
      setupVoiceAndSpeak();
    }
    
    function setupVoiceAndSpeak() {
      // Try to find Stella voice first
      const stellaVoice = voices.find(voice => 
        voice.name.includes('Stella') || voice.name.includes('stella')
      );
      
      // Create debug element to show found voices
      const voiceDebugInfo = document.createElement('div');
      voiceDebugInfo.style.fontSize = '10px';
      voiceDebugInfo.style.color = '#00ffff';
      voiceDebugInfo.style.marginTop = '4px';
      voiceDebugInfo.style.maxHeight = '60px';
      voiceDebugInfo.style.overflow = 'auto';
      
      if (stellaVoice) {
        console.log("Found Stella voice, using it for speech");
        utterance.voice = stellaVoice;
        voiceDebugInfo.innerHTML = `Using voice: ${stellaVoice.name}`;
      } else {
        // If Stella not found, look for any British voices as fallback
        console.log("Stella voice not found, falling back to British voice");
        const britishVoices = voices.filter(voice => 
          voice.lang.includes('en-GB') || 
          voice.name.includes('British') ||
          voice.name.includes('UK')
        );
        
        // Set British voice if available
        if (britishVoices.length > 0) {
          utterance.voice = britishVoices[0];
          console.log("Using British voice:", britishVoices[0].name);
          voiceDebugInfo.innerHTML = `Using British voice: ${britishVoices[0].name}`;
        } else {
          voiceDebugInfo.innerHTML = 'Using default voice (Stella voice not found)';
        }
      }
      
      // List all available voices for debugging
      const allVoicesStr = voices.map(v => v.name).join(', ');
      voiceDebugInfo.innerHTML += `<br>Available voices: ${allVoicesStr}`;
      notification.appendChild(voiceDebugInfo);
      
      // Configure voice
      utterance.pitch = 1.15;
      utterance.rate = 0.95;
      utterance.volume = 1.0;
      
      // Start speaking
      try {
        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
        console.log("Started speaking with Web Speech API...");
      } catch (error) {
        console.error("Speech synthesis error:", error);
      }
    }
    
    // When speech ends
    utterance.onend = () => {
      console.log("Speech finished (fallback)");
      
      // Auto-dismiss Zig's notification with animation
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      notification.style.transition = 'opacity 0.3s, transform 0.3s';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
      
      // Deactivate tendrils
      setBitcoinTendrilsActive(false);
      
      // Display a message to indicate song is now playing
      console.log("ZIG SPEECH COMPLETE - PLAYING J. COLE BEAT");
      
      // Start playing the J. Cole beat
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic) {
        audioStore.backgroundMusic.currentTime = 0;
        audioStore.backgroundMusic.play().catch(e => {
          console.log("Could not play background music after speech:", e);
        });
      }
    };
  };

  // Remove auto-play (now handled in the voice initialization effect)

  // Load audio elements
  useEffect(() => {
    // Load the J. Cole beat as background music
    const backgroundMusic = new Audio("/sounds/background-beat.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Try to play background music immediately (will be allowed after user interaction)
    backgroundMusic.play().catch(e => {
      console.log("Auto-play prevented. Click the button to enable audio:", e);
    });
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    const audioStore = useAudio.getState();
    audioStore.setBackgroundMusic(backgroundMusic);
    audioStore.setHitSound(hitSound);
    audioStore.setSuccessSound(successSound);
    
    console.log("J. Cole beat loaded. Press 'M' to toggle sound.");
    
    return () => {
      backgroundMusic.pause();
      backgroundMusic.src = "";
    };
  }, []);

  const controls = useControls();

  return (
    <>
      {/* Twinkling stars background animation - keep this black cosmic background with stars */}
      <div className="stars"></div>
      
      {/* Side Navigation */}
      <SideNavigation 
        onVoice={playBackgroundMusic}
        onToggleStats={() => setShowPerformance(prev => !prev)}
        onToggleElectricEffects={() => setElectricEffects(prev => !prev)}
      />
      
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
        <ControlPanel />
      </div>
      
      <Canvas
        style={{ height: "100vh", width: "100vw" }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        camera={{ position: [0, 1, 10], fov: 65 }}
      >
        {showPerformance && <Stats />}
        
        <Suspense fallback={null}>
          <Environment />

          {/* Purple nodes background effect */}
          <PurpleNodeBackground count={100} radius={20} size={0.09} />
          
          {/* Main core cell */}
          <Cell />
          
          {/* Pulse wave */}
          <PulseWave 
            frequency={1.0} 
            baseColor={controls.getColorByScheme('pulse')}
            intensity={2}
          />
          
          {/* Floating mining blocks revolving around center - the cube with tokens floating around it that you liked */}
          <MiningBlocks 
            count={16}
            minDistance={3.5}
            maxDistance={5.5}
            orbitRadius={4.8}
          />
          
          {/* Background particles */}
          <BackgroundParticles 
            count={500}
            radius={20}
            size={0.05}
            color="#ffffff"
          />
          
          {/* Floating logo items around the inner orbit */}
          <OrbitingLogo radius={7} speed={0.5} />
          
          {/* Sparkle stars around the scene */}
          <StarSparkles 
            count={15} 
            radius={8} 
            size={0.15} 
            color="#ffffff" 
          />
          
          {/* Electric grid for computational visualization - the nodes visualization you liked */}
          <ElectricGrid 
            size={8} 
            gridDivisions={14} 
            nodeSize={0.09}
            coreColor={controls.getColorByScheme('core')}
          />
          
          {/* Electric tendrils effect for bitcoin core */}
          {bitcoinTendrilsActive && (
            <group position={[0, 0, 0]}>
              <ElectricTendrils 
                count={12}
                length={5}
                color="#00ffff"
                width={0.15}
              />
            </group>
          )}
        </Suspense>
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={20}
          enablePan={false}
        />
      </Canvas>
      
      {/* Bottom Menu */}
      <BottomMenu 
        onEnterCafe={() => {
          console.log("Enter Cafe button clicked - playing music and animation");
          // Use our simplified background music function
          playBackgroundMusic();
        }}
      />
    </>
  );
}

export default App;
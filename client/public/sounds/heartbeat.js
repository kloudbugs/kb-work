// Heartbeat sound
function playHeartbeat(duration = 5) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mainGainNode = audioContext.createGain();
  mainGainNode.gain.value = 0.5;
  mainGainNode.connect(audioContext.destination);
  
  console.log("Playing heartbeat sound with Web Audio API");
  
  // Create a sequence of heartbeats
  const startTime = audioContext.currentTime;
  const beatsPerSecond = 1.2; // Slightly elevated heartbeat
  const totalBeats = Math.floor(duration * beatsPerSecond);
  
  for (let i = 0; i < totalBeats; i++) {
    // First part of heartbeat (louder)
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    
    osc1.type = "sine";
    osc1.frequency.value = 60; // Low frequency for heartbeat
    
    gain1.gain.value = 0;
    gain1.gain.setValueAtTime(0, startTime + (i / beatsPerSecond));
    gain1.gain.linearRampToValueAtTime(0.7, startTime + (i / beatsPerSecond) + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + (i / beatsPerSecond) + 0.2);
    
    osc1.connect(gain1);
    gain1.connect(mainGainNode);
    
    osc1.start(startTime + (i / beatsPerSecond));
    osc1.stop(startTime + (i / beatsPerSecond) + 0.2);
    
    // Second part of heartbeat (softer, comes shortly after)
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    
    osc2.type = "sine";
    osc2.frequency.value = 50;
    
    gain2.gain.value = 0;
    gain2.gain.setValueAtTime(0, startTime + (i / beatsPerSecond) + 0.15);
    gain2.gain.linearRampToValueAtTime(0.3, startTime + (i / beatsPerSecond) + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + (i / beatsPerSecond) + 0.35);
    
    osc2.connect(gain2);
    gain2.connect(mainGainNode);
    
    osc2.start(startTime + (i / beatsPerSecond) + 0.15);
    osc2.stop(startTime + (i / beatsPerSecond) + 0.35);
  }
}

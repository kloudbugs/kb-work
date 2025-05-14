// Keyboard typing sound
function playTyping(duration = 3) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mainGainNode = audioContext.createGain();
  mainGainNode.gain.value = 0.2;
  mainGainNode.connect(audioContext.destination);
  
  // Create typing sounds
  const startTime = audioContext.currentTime;
  const keyPresses = Math.floor(duration * 8); // 8 keypresses per second
  
  for (let i = 0; i < keyPresses; i++) {
    // Randomize to make it sound more natural
    if (Math.random() > 0.9) continue;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Randomize the frequency slightly
    const freq = 200 + Math.random() * 100;
    osc.type = "sine";
    osc.frequency.value = freq;
    
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, startTime + i * 0.12 + Math.random() * 0.05);
    gain.gain.linearRampToValueAtTime(0.1, startTime + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.12 + 0.07);
    
    osc.connect(gain);
    gain.connect(mainGainNode);
    
    osc.start(startTime + i * 0.12);
    osc.stop(startTime + i * 0.12 + 0.07);
  }
}

// Scanning sound
function playScanning() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mainGainNode = audioContext.createGain();
  mainGainNode.gain.value = 0.3;
  mainGainNode.connect(audioContext.destination);
  
  // Create a sequence of beeps
  const startTime = audioContext.currentTime;
  for (let i = 0; i < 20; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 800 + Math.random() * 600;
    
    gain.gain.value = 0.2;
    gain.gain.setValueAtTime(0.2, startTime + i * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.2 + 0.1);
    
    osc.connect(gain);
    gain.connect(mainGainNode);
    
    osc.start(startTime + i * 0.2);
    osc.stop(startTime + i * 0.2 + 0.1);
  }
}

// Alert sound when case file is found
function playFound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mainGainNode = audioContext.createGain();
  mainGainNode.gain.value = 0.3;
  mainGainNode.connect(audioContext.destination);
  
  // Higher pitched alert sound
  const startTime = audioContext.currentTime;
  
  // First tone (higher)
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  
  osc1.type = "sine";
  osc1.frequency.value = 1400;
  
  gain1.gain.value = 0;
  gain1.gain.setValueAtTime(0, startTime);
  gain1.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
  gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
  
  osc1.connect(gain1);
  gain1.connect(mainGainNode);
  
  osc1.start(startTime);
  osc1.stop(startTime + 0.8);
  
  // Second tone (lower)
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  
  osc2.type = "sine";
  osc2.frequency.value = 800;
  
  gain2.gain.value = 0;
  gain2.gain.setValueAtTime(0, startTime + 0.4);
  gain2.gain.linearRampToValueAtTime(0.4, startTime + 0.45);
  gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
  
  osc2.connect(gain2);
  gain2.connect(mainGainNode);
  
  osc2.start(startTime + 0.4);
  osc2.stop(startTime + 1.0);
}

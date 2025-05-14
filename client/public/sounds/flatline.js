// Flatline sound (medical monitor flatline)
function playFlatline() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mainGainNode = audioContext.createGain();
  mainGainNode.gain.value = 0.3;
  mainGainNode.connect(audioContext.destination);
  
  console.log("Playing flatline sound with Web Audio API");
  
  // Continuous tone
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.type = "sine";
  osc.frequency.value = 440; // Flatline tone
  
  gain.gain.value = 0.3;
  
  osc.connect(gain);
  gain.connect(mainGainNode);
  
  const startTime = audioContext.currentTime;
  osc.start(startTime);
  osc.stop(startTime + 3.0); // 3 seconds of flatline
  
  // Add slight fade-out at the end
  gain.gain.setValueAtTime(0.3, startTime + 2.5);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 3.0);
}

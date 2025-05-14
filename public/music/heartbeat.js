// Generate a heartbeat sound file using Web Audio API
const fs = require('fs');
const { exec } = require('child_process');

// We'll use ffmpeg to create the audio file
const heartbeatCommand = `
ffmpeg -f lavfi -i "sine=frequency=60:duration=0.3,volume=0.8" \
-f lavfi -i "sine=frequency=90:duration=0.15,volume=0.6" \
-filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[heartbeat]; \
[heartbeat]adelay=0|0[beat]; \
[beat]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo, \
volume=2.0,areverse,afade=t=in:st=0:d=0.05,areverse,afade=t=out:st=0.45:d=0.05, \
asettb=1/44100, acopy[out]; \
[out]concat=n=5:v=0:a=1[final]" \
-map "[final]" public/music/heartbeat.mp3
`;

// Execute the command to create the file
exec(heartbeatCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating heartbeat sound: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`ffmpeg stderr: ${stderr}`);
  }
  console.log('Heartbeat sound generated successfully');
});
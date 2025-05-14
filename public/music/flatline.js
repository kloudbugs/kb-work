// Generate a flatline beep sound file using Web Audio API
const fs = require('fs');
const { exec } = require('child_process');

// We'll use ffmpeg to create the audio file
const flatlineCommand = `
ffmpeg -f lavfi -i "sine=frequency=1000:duration=0.5,volume=0.7" \
-filter_complex "[0:a]asettb=1/44100,apad=pad_dur=1.5[beep]; \
[beep]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo, \
volume=1.5,afade=t=in:st=0:d=0.01,afade=t=out:st=0.45:d=0.05[s1]; \
[s1]concat=n=6:v=0:a=1[final]" \
-map "[final]" public/music/flatline.mp3
`;

// Execute the command to create the file
exec(flatlineCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating flatline sound: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`ffmpeg stderr: ${stderr}`);
  }
  console.log('Flatline sound generated successfully');
});
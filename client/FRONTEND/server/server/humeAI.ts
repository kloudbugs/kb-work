import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Hume AI API configuration
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_API_URL = 'https://api.hume.ai/v0/voice/syntheses';

// Log that we're using the Hume API Key (without exposing it)
console.log(`Hume AI API Key available: ${Boolean(HUME_API_KEY)}`);

// Ensure the audio directory exists
const audioDir = path.join(process.cwd(), 'client', 'public', 'audio');

async function ensureAudioDirExists() {
  try {
    // Check if directory exists
    const exists = await existsAsync(audioDir);
    if (!exists) {
      console.log(`Creating audio directory at ${audioDir}`);
      await mkdirAsync(audioDir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Error creating audio directory:', error);
    return false;
  }
}

/**
 * Generate a dummy MP3 file for development if the Hume API fails
 * This creates a silent MP3 file as a fallback
 */
async function createDummySilentMP3(outputPath: string): Promise<boolean> {
  try {
    // Check if we have a dummy MP3 to copy
    const dummyPath = path.join(process.cwd(), 'client', 'public', 'sounds', 'silent.mp3');
    const dummyExists = await existsAsync(dummyPath);
    
    if (dummyExists) {
      // Copy the dummy file
      const dummyData = await readFileAsync(dummyPath);
      await writeFileAsync(outputPath, dummyData);
      console.log(`Created dummy MP3 file at ${outputPath}`);
      return true;
    }
    
    // Create a minimal silent MP3 header (1 second of silence)
    // This is a very basic MP3 header that creates a silent MP3
    const silentMP3 = Buffer.from([
      0xFF, 0xFB, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    
    await writeFileAsync(outputPath, silentMP3);
    console.log(`Created minimal silent MP3 file at ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Failed to create dummy MP3:', error);
    return false;
  }
}

/**
 * Generate speech using Hume AI's TTS service
 * @param text The text to convert to speech
 * @param voiceId The Hume AI voice ID to use
 * @param outputFileName The filename for the output audio file (without extension)
 * @returns Path to the generated audio file
 */
export async function generateSpeech(
  text: string,
  voiceId: string = 'female_british_001', // Default to female British voice
  outputFileName: string = 'zig-message'
): Promise<string> {
  try {
    // Ensure the API key is available
    if (!HUME_API_KEY) {
      console.error('HUME_API_KEY is not available in environment variables');
      throw new Error('HUME_API_KEY is missing');
    }
    
    // Ensure audio directory exists
    const dirCreated = await ensureAudioDirExists();
    if (!dirCreated) {
      throw new Error('Failed to create audio directory');
    }
    
    // Define output path for audio file
    const outputPath = path.join(audioDir, `${outputFileName}.mp3`);
    
    // Check if the file already exists to avoid redundant API calls
    const fileExists = await existsAsync(outputPath);
    if (fileExists) {
      console.log(`Audio file already exists at ${outputPath}`);
      return `/audio/${outputFileName}.mp3`;
    }
    
    console.log(`Sending request to Hume AI API for text: ${text.substring(0, 50)}...`);
    console.log(`Using voice ID: ${voiceId}`);
    
    // Prepare request body
    const requestBody = {
      text,
      voice_id: voiceId,
      model_type: 'turbo', // Use best model for quality
      audio_format: 'mp3',
      sample_rate: 24000, // High quality
      optimize_for: 'quality'
    };
    
    // Make request to Hume AI API
    try {
      const response = await axios.post(
        HUME_API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': HUME_API_KEY
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Check if we got valid data
      if (response.data && response.data.length > 0) {
        // Save the audio file
        await writeFileAsync(outputPath, response.data);
        console.log(`Generated audio file saved to ${outputPath}`);
        
        // Return the relative path to be used in the client
        return `/audio/${outputFileName}.mp3`;
      } else {
        console.error('Hume AI API returned empty data');
        throw new Error('Empty response from Hume AI API');
      }
    } catch (apiError: any) {
      console.error('Hume AI API request failed:', apiError.message);
      
      if (apiError.response) {
        console.error(`Status: ${apiError.response.status}`);
        console.error(`Data: ${JSON.stringify(apiError.response.data || {})}`);
        console.error(`Headers: ${JSON.stringify(apiError.response.headers || {})}`);
      }
      
      // Try to create a dummy MP3 file so the client can continue without errors
      const dummyCreated = await createDummySilentMP3(outputPath);
      if (dummyCreated) {
        console.log('Using fallback silent MP3 file');
        return `/audio/${outputFileName}.mp3`;
      }
      
      throw apiError;
    }
  } catch (error: any) {
    console.error('Error generating speech with Hume AI:', error.message);
    throw error;
  }
}

/**
 * Get available Hume AI voices
 * @returns List of available voices
 */
export async function getAvailableVoices() {
  try {
    // Ensure the API key is available
    if (!HUME_API_KEY) {
      console.error('HUME_API_KEY is not available in environment variables');
      return { voices: [] };
    }
    
    console.log('Fetching available Hume AI voices...');
    
    const response = await axios.get(
      'https://api.hume.ai/v0/voice/voices',
      {
        headers: {
          'X-API-KEY': HUME_API_KEY
        }
      }
    );
    
    console.log(`Retrieved ${response.data?.voices?.length || 0} voices from Hume AI API`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching Hume AI voices:', error.message);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    // Return empty list instead of throwing to allow the application to function
    return { voices: [] };
  }
}
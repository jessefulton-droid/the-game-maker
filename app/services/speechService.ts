import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

// Request permissions for audio recording
export const requestAudioPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting audio permissions:', error);
    return false;
  }
};

// Record audio from user
export const recordAudio = async (): Promise<Audio.Recording> => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    return recording;
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

// Stop recording and get URI
export const stopRecording = async (
  recording: Audio.Recording
): Promise<string> => {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (!uri) {
      throw new Error('Failed to get recording URI');
    }
    
    return uri;
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
};

// Convert audio to text using OpenAI Whisper API
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // Get OpenAI API key from environment
    const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY || 
                   process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_key_here') {
      console.warn('⚠️ OPENAI_API_KEY not configured. Voice input will not work.');
      throw new Error('OpenAI API key not configured. Please add it to your .env file.');
    }

    console.log('🎤 Starting Whisper transcription...');

    // Create FormData for the API request
    const formData = new FormData();
    
    // Append the audio file
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);
    
    // Specify the Whisper model
    formData.append('model', 'whisper-1');
    
    // Optional: Specify language for better accuracy
    formData.append('language', 'en');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      console.error('❌ Whisper API error:', errorMessage);
      throw new Error(`Whisper API error: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('✅ Transcription complete:', data.text);
    
    return data.text || '[No transcription available]';
  } catch (error) {
    console.error('❌ Error transcribing audio:', error);
    
    // Provide user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Voice input is not configured. Please add your OpenAI API key.');
      }
      throw error;
    }
    
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

// Text-to-speech for agent responses (optional feature)
export const speakText = async (text: string): Promise<void> => {
  try {
    await Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  } catch (error) {
    console.error('Error speaking text:', error);
  }
};

// Stop any ongoing speech
export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};


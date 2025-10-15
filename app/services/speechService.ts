import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

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

// Convert audio to text using a speech-to-text service
// For MVP, we'll use a simple approach. In production, integrate with a service like:
// - OpenAI Whisper API
// - Google Cloud Speech-to-Text
// - Rev.ai
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // TODO: Integrate with actual speech-to-text service
    // For now, this is a placeholder that would need implementation
    
    // Example implementation with Whisper API:
    // const formData = new FormData();
    // formData.append('file', {
    //   uri: audioUri,
    //   type: 'audio/m4a',
    //   name: 'recording.m4a',
    // });
    // formData.append('model', 'whisper-1');
    //
    // const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //   },
    //   body: formData,
    // });
    //
    // const data = await response.json();
    // return data.text;
    
    console.warn('Speech-to-text not yet implemented. Please add your preferred service.');
    return '[Transcription would appear here - please implement speech-to-text service]';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
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


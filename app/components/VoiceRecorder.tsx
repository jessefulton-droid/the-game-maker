import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { recordAudio, stopRecording, transcribeAudio, requestAudioPermissions } from '../services/speechService';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription, disabled = false }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermissions();
      if (!hasPermission) {
        alert('Please grant microphone permission to use voice input');
        return;
      }

      const newRecording = await recordAudio();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please try again.');
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsTranscribing(true);

      const uri = await stopRecording(recording);
      const transcription = await transcribeAudio(uri);
      
      onTranscription(transcription);
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording or transcribe:', error);
      alert('Failed to process your recording. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.recording : styles.idle,
          disabled && styles.disabled,
        ]}
        onPress={isRecording ? stopRecordingAndTranscribe : startRecording}
        disabled={disabled || isTranscribing}
      >
        {isTranscribing ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.buttonText}>
            {isRecording ? '🎤 Tap to Stop' : '🎤 Hold to Talk'}
          </Text>
        )}
      </TouchableOpacity>
      {isTranscribing && <Text style={styles.hint}>Processing...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: '#4CAF50',
  },
  recording: {
    backgroundColor: '#F44336',
  },
  disabled: {
    backgroundColor: '#999',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});


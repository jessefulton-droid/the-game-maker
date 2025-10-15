import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Generation'>;

export const GenerationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameDesign } = route.params;
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  
  const maxTime = 15 * 60; // 15 minutes in seconds
  const steps = [
    '🎨 Creating graphics...',
    '🎵 Adding sound effects...',
    '🕹️ Building game mechanics...',
    '⚡ Optimizing performance...',
    '🎮 Finalizing your game...',
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate generation process
    const progressInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);
      
      // Calculate progress (simulate varying speeds)
      const newProgress = Math.min((elapsed / 30) * 100, 95); // Complete "generation" in ~30 seconds for demo
      setProgress(newProgress);
      
      // Update step based on progress
      const stepIndex = Math.floor((newProgress / 100) * steps.length);
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
      }
      
      // Complete after demo time
      if (elapsed >= 30) {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        completeGeneration();
      }
      
      // Abort if taking too long (15 min max)
      if (elapsed >= maxTime) {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 500);

    const timerInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const completeGeneration = () => {
    // TODO: Get generated game from orchestrator
    const mockGeneratedGame = {
      design: gameDesign,
      code: '// Game code would be here',
      htmlWrapper: '', // Empty so it falls back to template
      generatedAt: new Date(),
      version: 1,
    };

    setProgress(100);
    setCurrentStep('✨ Your game is ready!');
    
    setTimeout(() => {
      navigation.navigate('Game', { generatedGame: mockGeneratedGame });
    }, 1000);
  };

  const handleTimeout = () => {
    alert('Generation took too long. Please try a simpler game design.');
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedRemaining = Math.max(0, 30 - timeElapsed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Building Your Game!</Text>
        <Text style={styles.subtitle}>{gameDesign.gameTitle}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <Text style={styles.currentStep}>{currentStep}</Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Time Elapsed</Text>
            <Text style={styles.timeValue}>{formatTime(timeElapsed)}</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Est. Remaining</Text>
            <Text style={styles.timeValue}>{formatTime(estimatedRemaining)}</Text>
          </View>
        </View>

        <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Did you know?</Text>
          <Text style={styles.tipText}>
            Your game uses real physics and AI to bring the story to life!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  currentStep: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  spinner: {
    marginVertical: 20,
  },
  tipsContainer: {
    backgroundColor: '#FFF9C4',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { VoiceRecorder } from '../components/VoiceRecorder';

type Props = NativeStackScreenProps<RootStackParamList, 'Feedback'>;

export const FeedbackScreen: React.FC<Props> = ({ navigation, route }) => {
  const { generatedGame, onSpiceItUp } = route.params;
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceTranscription = (text: string) => {
    setFeedback(text);
  };

  const handleSpiceItUp = async () => {
    if (!feedback.trim()) {
      Alert.alert('Tell me what to change', 'Please describe what you want to change about the game');
      return;
    }

    setIsProcessing(true);
    
    // TODO: Integrate with orchestrator to regenerate game
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Game Updated!',
        'Your game has been updated with your feedback!',
        [
          {
            text: 'Play Updated Game',
            onPress: () => {
              // For now, just go back to the game
              // In full implementation, would pass updated game
              navigation.navigate('Game', { generatedGame });
            },
          },
        ]
      );
    }, 3000);
  };

  const handlePlayAgain = () => {
    navigation.navigate('Game', { generatedGame });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleNewGame = () => {
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🎮 How was your game?</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{generatedGame.design.gameTitle}</Text>
          <Text style={styles.cardSubtitle}>
            Game Type: {generatedGame.design.gameType}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.actionButtonIcon}>🔄</Text>
            <Text style={styles.actionButtonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.newGameButton]}
            onPress={handleNewGame}
          >
            <Text style={styles.actionButtonIcon}>📚</Text>
            <Text style={styles.actionButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spiceItUpSection}>
          <Text style={styles.sectionTitle}>✨ Spice It Up!</Text>
          <Text style={styles.sectionDescription}>
            Want to make your game even better? Tell me what you'd like to change!
          </Text>

          <VoiceRecorder
            onTranscription={handleVoiceTranscription}
            disabled={isProcessing}
          />

          <Text style={styles.orText}>or type your changes</Text>

          <TextInput
            style={styles.feedbackInput}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Example: Make the dragons bigger, add more tacos, make it faster..."
            multiline
            numberOfLines={4}
            editable={!isProcessing}
          />

          <TouchableOpacity
            style={[styles.spiceButton, isProcessing && styles.spiceButtonDisabled]}
            onPress={handleSpiceItUp}
            disabled={isProcessing || !feedback.trim()}
          >
            {isProcessing ? (
              <Text style={styles.spiceButtonText}>Updating...</Text>
            ) : (
              <Text style={styles.spiceButtonText}>Spice It Up! ✨</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  newGameButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spiceItUpSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 16,
    fontSize: 14,
  },
  feedbackInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  spiceButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  spiceButtonDisabled: {
    backgroundColor: '#CCC',
  },
  spiceButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#666',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


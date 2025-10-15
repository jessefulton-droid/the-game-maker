import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { GameWebView } from '../components/GameWebView';
import { generateGameHTML, getTemplate } from '../templates/phaserTemplates';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { generatedGame } = route.params;
  const [showControls, setShowControls] = useState(true);

  // For MVP, use a template game since we don't have real generation yet
  const template = getTemplate(generatedGame.design.gameType);
  const gameHtml = generatedGame.htmlWrapper || generateGameHTML(template);

  const handleGameMessage = (message: string) => {
    console.log('Game message:', message);
    // Handle messages from the game (scores, events, etc.)
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Game',
      'Do you want to exit the game?',
      [
        { text: 'Keep Playing', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Feedback', {
              generatedGame,
              onSpiceItUp: handleSpiceItUp,
            });
          },
        },
      ]
    );
  };

  const handleSpiceItUp = (feedback: string) => {
    // TODO: Implement spice it up flow
    console.log('Spice it up feedback:', feedback);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Game Header */}
      {showControls && (
        <View style={styles.header}>
          <Text style={styles.gameTitle}>{generatedGame.design.gameTitle}</Text>
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Game View */}
      <GameWebView html={gameHtml} onMessage={handleGameMessage} />

      {/* Controls Hint */}
      {showControls && (
        <View style={styles.controlsHint}>
          <Text style={styles.controlsText}>
            Use arrow keys or swipe to control
          </Text>
          <TouchableOpacity onPress={() => setShowControls(false)}>
            <Text style={styles.hideText}>Hide</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  exitButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  controlsHint: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsText: {
    color: '#fff',
    fontSize: 14,
  },
  hideText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

